import tornado.web
import tornado.httpclient
from tornado.escape import json_decode, json_encode
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
from jose import jwt, ExpiredSignatureError, JWTError
import boto3

import os
import urllib.parse

import models


class RequestHandler(tornado.web.RequestHandler):

    def __init__(self, application, request, **kwargs):
        self._db = None
        self._http_client = None
        self._public_key = None
        self._s3 = None
        self._sqs = None
        super(RequestHandler, self).__init__(application, request, **kwargs)

    @property
    def s3(self):
        if self._s3 is None:
            self._s3 = boto3.client('s3')
        return self._s3

    def get_s3_file(self, key):
        try:
            return self.s3.get_object(
                Bucket=self.settings.get('aws_s3_bucket'),
                Key=key
            )
        except:
            return False

    @property
    def sqs(self):
        if self._sqs is None:
            self._sqs = boto3.client('sqs')
        return self._sqs

    def sqs_queue(self, name):
        return boto3.resource('sqs').get_queue_by_name(
            QueueName=name
        )

    @property
    def public_key(self):
        if not self._public_key:
            _file = os.path.join(self.settings.get('keys_path'), 'public.pem')
            with open(_file, 'rb+') as f:
                self._public_key = f.read()
        return self._public_key

    @property
    def http_client(self):
        if not self._http_client:
            self._http_client = tornado.httpclient.AsyncHTTPClient()
        return self._http_client

    @property
    def db(self):
        if not self._db:
            self._db = sessionmaker(bind=self.application._db_engine)()
        return self._db

    def on_finish(self):
        if self._db:
            self._db.close()
            self._db = None

    def render_string(self, template, **kwargs):
        kwargs.update({'handler': self})
        return self.application._template_env.get_template(template)\
            .render(**kwargs)

    def render(self, template, **kwargs):
        self.finish(self.render_string(template, **kwargs))

    def get_file(self, name):
        return self.request.files.get(name)

    def get_menu(self):
        menu = self.db.query(
            models.Category.id,
            models.Category.name,
            models.Category.slug
        )

        premium = False
        if self.current_user:
            premium = self.current_user.get('premium', False)

        if not premium:
            menu = menu.filter(
                models.Category.premium == False  # noqa
            )

        menu = menu.filter(
            models.Category.status == 'enabled'
        ).order_by(
            models.Category.order
        ).all()

        return menu

    def get_category(self, category_slug, category_id):
        category = self.db.query(
            models.Category.id,
            models.Category.name,
            models.Category.slug,
            models.Category.premium
        )

        premium = False
        if self.current_user:
            premium = self.current_user.get('premium', False)

        if not premium:
            category = category.filter(
                models.Category.premium == False  # noqa
            )

        category = category.filter(
            models.Category.slug == category_slug,
            models.Category.id == category_id,
            models.Category.status == 'enabled'
        ).one()

        return category

    def get_basegift(self, gift_slug, gift_id, category):
        _gift = self.db.query(
            models.BaseGift
        ).filter(
            models.BaseGift.slug == gift_slug,
            models.BaseGift.id == gift_id,
            models.BaseGift.status == 'enabled'
        ).one()

        if not category or not category.premium:
            return _gift

        gift = self.db.query(
            models.BaseGift
        )
        if not self.current_user:
            return None

        if isinstance(gift, models.Event):
            gift = gift.join(
                models.InvitedUserEvent
            )
        elif isinstance(gift, models.Gift):
            gift = gift.join(
                models.InvitedUserEvent,
                models.InvitedUserEvent
                .id_special_event == models.BaseGift.id_special_event
            )

        gift = gift.filter(
            models.BaseGift.slug == gift_slug,
            models.BaseGift.id == gift_id,
            models.BaseGift.status == 'enabled'
        ).one()

        return gift

    def get_invited_user_event(self, gift):
        invited_event = None
        if isinstance(gift, models.Event):
            invited_event = self.db.query(
                models.InvitedUserEvent
            ).filter(
                models.InvitedUserEvent.id_gift == gift.id,
                models.InvitedUserEvent.id_user == self.current_user.get('id'),
                models.InvitedUserEvent.status == 'pending'
            ).one()
        elif isinstance(gift, models.Gift):
            invited_event = self.db.query(
                models.InvitedUserEvent
            ).filter(
                models.InvitedUserEvent
                .id_special_event == gift.id_special_event,
                models.InvitedUserEvent.id_user == self.current_user.get('id'),
                models.InvitedUserEvent.status == 'pending'
            ).one()
        return invited_event

    def get_current_user(self):
        user = self.get_secure_cookie('user')

        if not user:
            return None

        try:
            user = json_decode(user)
        except ValueError:
            return None

        try:
            _user = self.db.query(
                models.User.id,
                models.User.premium
            ).filter(
                models.User.status == 'enabled',
                models.User.id == user.get('id')
            ).one()
        except NoResultFound:
            return None

        res = {
            'premium': _user.premium,
            'id': _user.id
        }

        if user.get('access_token'):
            res.update({'access_token': user.get('access_token')})
            try:
                _access_token = jwt.decode(
                    user.get('access_token'),
                    self.public_key,
                    algorithms=['RS256']
                )
            except (ExpiredSignatureError, JWTError):
                self.clear_all_cookies()
                self.redirect(
                    self.reverse_url('login') + '?' + urllib.parse.urlencode({
                        'next_url': self.request.full_url()
                    })
                )
                return
            else:
                res.update({'jwt': _access_token})

        return res

    def send_email(self, to, subject, text, html=None):
        if to and not isinstance(to, list):
            to = [to]

        message = {
            'action': 'email',
            'to': ','.join(to),
            'from': '%s <%s>' % (
                self.settings.get('email_from_name'),
                self.settings.get('email_from_email')
            ),
            'subject': subject,
            'text': text,
            'html': html
        }
        try:
            self.sqs_queue(self.settings.get('aws_sqs_queue')).send_message(
                MessageBody=json_encode(message)
            )
        except:
            pass
