from controllers import RequestHandler
import models
import forms

from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy import func
from tornado.web import HTTPError, authenticated
from tornado.gen import coroutine, Return
import tornado.httpclient
from tornado.escape import json_decode, json_encode
import elasticsearch_dsl
from jose import jwt

import urllib
from datetime import datetime, timedelta
from uuid import uuid4

import logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class Main(RequestHandler):

    def get(self):
        banner = self.db.query(
            models.Banner.img,
            models.Banner.description,
            models.Banner.link
        ).filter(
            models.Banner.module == 'home',
            models.Banner.status == 'enabled'
        ).order_by(
            models.Banner.order
        ).first()

        logos = self.db.query(
            models.Banner.img
        ).filter(
            models.Banner.module == 'logo',
            models.Banner.status == 'enabled'
        ).order_by(
            models.Banner.order
        ).all()

        if self.request.headers.get(
                'X-Requested-With',
                None
        ) == 'XMLHttpRequest':
            res = {}
            if banner:
                res.update({
                    'img': banner.img,
                    'description': banner.description,
                    'link': banner.link
                })
            if logos:
                res.update({
                    'logos': [{
                        'img': logo.img
                    } for logo in logos]
                })
            self.finish(res)
        else:
            self.render('site/index.html', banner=banner, logos=logos)


class GetCoupons(RequestHandler):

    def get(self, category_slug, category_id):

        logger.debug('Regalos')

        try:
            category = self.get_category(category_slug, category_id)
        except NoResultFound:
            #raise HTTPError(404)
            self.redirect(self.reverse_url('home'))
            return

        res = {
            'category': {
                'name': category.name,
                'slug': category.slug,
                'id': category.id
            }
        }

        coupons = self.db.query(
            models.BaseGift
        )

        if category.premium:
            if not self.current_user:
                self.redirect(self.reverse_url('login'))
                return

            coupons = coupons.join(
                models.InvitedUserEvent
            ).filter(
                models.InvitedUserEvent.id_user == self.current_user.get('id'),
                models.InvitedUserEvent.status == 'pending'
            )

        coupons = coupons.filter(
            models.BaseGift.id_category == category.id,
            models.BaseGift.status == 'enabled'
        ).order_by(
            models.BaseGift.order
        ).all()

        _coupons = []
        for coupon in coupons:
            _ = {
                'id': coupon.id,
                'name': coupon.name,
                'slug': coupon.slug,
                'highlight': coupon.highlight,
                'img': coupon.img,
                'img_large': coupon.img_large,
                'store_name': coupon.store_name,
                'store_img': coupon.store_img
            }
            if isinstance(coupon, models.Coupon):
                _.update({
                    'coupon_type': coupon.coupon_type,
                    'coupon_value': coupon.coupon_value,
                    'excerpt': coupon.excerpt,
                    'type': 'coupon'
                })
            elif isinstance(coupon, models.Event):
                _.update({
                    'type': 'event'
                })
            elif isinstance(coupon, models.Gift):
                _.update({
                    'type': 'gift'
                })
            _coupons.append(_)

        if self.current_user and self.current_user.get('premium'):
            special_events = self.db.query(
                models.SpecialEvent
            ).join(
                models.InvitedUserEvent
            ).filter(
                models.InvitedUserEvent.id_user == self.current_user.get('id'),
                models.InvitedUserEvent.status == 'pending',
                models.SpecialEvent.id_category == category.id,
                models.SpecialEvent.status == 'enabled',
                models.SpecialEvent.start_date <= datetime.now(),
                models.SpecialEvent.end_date >= datetime.now()
            ).all()

            for se in special_events:
                _ = {
                    'id': se.id,
                    'name': se.title,
                    'slug': se.slug,
                    'highlight': se.highlight,
                    'img': se.img,
                    'img_large': se.img_large,
                    'type': 'special-event'
                }
                _coupons.append(_)

        res.update({'data': _coupons})

        banner = self.db.query(
            models.Banner.img,
            models.Banner.description,
            models.Banner.link
        ).filter(
            models.Banner.module == category_slug,
            models.Banner.status == 'enabled'
        ).order_by(
            models.Banner.order
        ).first()

        if banner:
            res.update({
                'banner_category': {
                    'img': banner.img,
                    'description': banner.description,
                    'link': banner.link
                }
            })

        if self.request.headers.get(
                'X-Requested-With',
                None
        ) == 'XMLHttpRequest':
            self.finish(res)
        else:
            self.render('site/index.html', category=res.get('category'),
                        data=_coupons, banner_category=banner)


class SpecialEventGifts(RequestHandler):

    @authenticated
    def get(self, category_slug, category_id, special_event_slug,
            special_event_id):

        logger.debug('GET REGALOS DE CAMPAnA')

        try:
            category = self.get_category(category_slug, category_id)
        except NoResultFound:
            raise HTTPError(404)

        try:
            special_event = self.db.query(
                models.SpecialEvent
            ).join(
                models.InvitedUserEvent
            ).filter(
                models.InvitedUserEvent.id_user == self.current_user.get('id'),
                models.InvitedUserEvent.status == 'pending',
                models.SpecialEvent.id_category == category.id,
                models.SpecialEvent.status == 'enabled',
                models.SpecialEvent.end_date >= datetime.now(),
                models.SpecialEvent.slug == special_event_slug,
                models.SpecialEvent.id == special_event_id
            ).one()
        except NoResultFound:
            raise HTTPError(404)

        res = {
            'category': {
                'name': category.name,
                'slug': category.slug,
                'id': category.id
            },
            'special_event': {
                'id': special_event.id,
                'name': special_event.title,
                'slug': special_event.slug,
                'greeting': special_event.greeting,
                'img_large': special_event.img_large,
                'img_big': special_event.img_big
            }
        }

        gifts = self.db.query(
            models.Gift
        ).join(
            models.InvitedUserEvent,
            models.InvitedUserEvent
            .id_special_event == models.Gift.id_special_event
        ).filter(
            models.InvitedUserEvent.id_user == self.current_user.get('id'),
            models.InvitedUserEvent.status == 'pending',
            models.Gift.id_category == category.id,
            models.Gift.status == 'enabled',
            models.Gift.id_special_event == special_event.id
        ).order_by(
            models.Gift.store_name,
            models.Gift.order
        ).all()

        _gifts = []
        for gift in gifts:
            _ = {
                'id': gift.id,
                'name': gift.name,
                'slug': gift.slug,
                'highlight': gift.highlight,
                'img': gift.img,
                'img_large': gift.img_large,
                'store_name': gift.store_name,
                'store_img': gift.store_img,
                'type': 'gift'
            }
            _gifts.append(_)

        res.update({'data': _gifts})

        if self.request.headers.get(
                'X-Requested-With',
                None
        ) == 'XMLHttpRequest':
            self.finish(res)
        else:
            self.render('site/special_event.html',
                        category=res.get('category'), data=_gifts,
                        special_event=res.get('special_event'))


class Gift(RequestHandler):

    def get(self, category_slug, category_id, gift_slug, gift_id):
        
        logger.debug('Detalle regalo')
        
        try:
            category = self.get_category(category_slug, category_id)
        except NoResultFound:
             #raise HTTPError(404)
            self.redirect(self.reverse_url('home'))
            return

        res = {
            'category': {
                'name': category.name,
                'slug': category.slug,
                'id': category.id
            }
        }

        try:
            gift = self.get_basegift(gift_slug, gift_id, category)
        except NoResultFound:
            raise HTTPError(404)

        _data = {
            'id': gift.id,
            'store_name': gift.store_name,
            'name': gift.name,
            'slug': gift.slug,
            'description': gift.description,
            'store_img': gift.store_img,
            'img_big': gift.img_big,
            'used_stock': gift.used_stock,
            'total_stock': gift.total_stock
        }

        if isinstance(gift, models.Coupon):
            _data.update({
                'type': 'coupon',
                'excerpt': gift.excerpt,
                'coupon_type': gift.coupon_type,
                'coupon_value': gift.coupon_value,
                'terms_and_conditions': gift.terms_and_conditions,
                'locations': [{
                    'name': location.name,
                    'address': location.address,
                    'lng': location.lng,
                    'lat': location.lat
                } for location in gift.locations]
            })
        elif isinstance(gift, models.Gift):
            _data.update({
                'type': 'gift',
                'pre': gift.pre,
                'post': gift.post,
                'disclaimer': gift.disclaimer,
                'delivery_type': gift.delivery_type
            })
            try:
                special_event = self.db.query(
                    models.SpecialEvent.id,
                    models.SpecialEvent.slug
                ).filter(
                    models.SpecialEvent.id == gift.id_special_event
                ).one()
            except NoResultFound:
                pass
            else:
                _data.update({
                    'special_event_id': special_event.id,
                    'special_event_slug': special_event.slug
                })
        elif isinstance(gift, models.Event):
            _data.update({
                'type': 'event',
                'taken_place_on': None,
                'taken_place_on2': None,
                'start_on': None,
                'synopsis': gift.synopsis,
                'cast': gift.cast,
                'place': gift.place,
                'invitation_detail': gift.invitation_detail,
                'has_combo': gift.has_combo,
                'combo_detail': gift.combo_detail,
                'has_seats': gift.has_seats,
                'seats_detail': gift.seats_detail,
                'disclaimer': gift.disclaimer,
                'lng': gift.lng,
                'lat': gift.lat
            })
            if gift.taken_place_on:
                _data.update({
                    'taken_place_on': gift.taken_place_on.isoformat()
                })
            if gift.taken_place_on2:
                _data.update({
                    'taken_place_on2': gift.taken_place_on2.isoformat()
                })
            if gift.start_on:
                _data.update({
                    'start_on': gift.start_on.isoformat()
                })

        res.update({'data': _data})

        if self.request.headers.get(
                'X-Requested-With',
                None
        ) == 'XMLHttpRequest':
            self.finish(res)
        else:
            self.render('site/detail.html', category=res.get('category'),
                        data=_data)


class Search(RequestHandler):

    def get(self):
        q = self.get_argument('q', None)
        _data = []

        if q:
            _search = models.ESBaseGift.search(
            ).source(
                fields=[]
            ).query(
                elasticsearch_dsl.query.MultiMatch(
                    query=str(q),
                    fields=['store_name', 'name', 'description']
                )
            )

            if not self.current_user or not self.current_user.get('premium'):
                _search = _search.filter(
                    'term',
                    premium=False
                )

            _search = _search.filter(
                'term',
                enabled=True
            ).execute()

            if len(_search):
                _results = self.db.query(
                    models.BaseGift
                ).filter(
                    models.BaseGift.id.in_([h.meta.id for h in _search])
                ).all()

                for result in _results:
                    _ = {
                        'id': result.id,
                        'name': result.name,
                        'slug': result.slug,
                        'highlight': result.highlight,
                        'img': result.img,
                        'img_large': result.img_large,
                        'category_id': result.category.id,
                        'category_slug': result.category.slug
                    }
                    if isinstance(result, models.Coupon):
                        _.update({
                            'coupon_type': result.coupon_type,
                            'coupon_value': result.coupon_value,
                            'excerpt': result.excerpt,
                            'store_name': result.store_name,
                            'store_img': result.store_img
                        })
                    _data.append(_)

        if self.request.headers.get(
                'X-Requested-With',
                None
        ) == 'XMLHttpRequest':
            self.finish({'data': _data})
        else:
            self.render('site/search.html', data=_data)


class Suggestion(RequestHandler):

    def get(self, form=forms.Suggestion()):
        self.render('site/suggestion.html', form=form)

    @coroutine
    def post(self):
        g_recaptcha_response = self.get_argument('g-recaptcha-response')
        form = forms.Suggestion(forms.MultiDict(self))

        try:
            recaptcha_req = tornado.httpclient.HTTPRequest(
                self.settings.get('recaptcha_verify_url'),
                body=urllib.urlencode({
                    'secret': self.settings.get('recaptcha_secret'),
                    'response': g_recaptcha_response,
                    'remoteip': self.request.remote_ip
                }),
                method='POST'
            )
            recaptcha = yield self.http_client.fetch(recaptcha_req)
            if recaptcha.error:
                raise tornado.httpclient.HTTPError(403)
            recaptcha = json_decode(recaptcha.body)
            if not recaptcha.get('success', False):
                raise tornado.httpclient.HTTPError(403)
        except tornado.httpclient.HTTPError:
            form.errors.update({
                'custom': u'Error en validaci\xf3n recaptcha'
            })
        else:
            if form.validate():
                suggestion = models.Suggestion()
                form.populate_obj(suggestion)
                self.db.add(suggestion)

                try:
                    self.db.commit()
                except:
                    self.db.rollback()
                    form.errors.update({
                        'custom': u'Error inesperado'
                    })

        self.render('site/suggestion.html', form=form)


class Login(RequestHandler):

    def get(self, form=forms.Login()):
        if self.current_user:
            self.redirect(self.reverse_url('home'))
            return

        self.render('site/login.html', form=form)

    @coroutine
    def post(self):
        form = forms.Login(forms.MultiDict(self))

        if form.validate():
            try:
                login_req = tornado.httpclient.HTTPRequest(
                    self.settings.get('profuturo_api') +
                    '/profuturo-rest-oauth-war/afiliados/oauth/token',
                    body=urllib.urlencode({
                        'grant_type': 'password',
                        'tipoDocumento': form.doc_type.data,
                        'numeroDocumento': form.doc_number.data,
                        'clave': form.clave.data,
                        'codAplicacion': self.settings.get(
                            'profuturo_cod_app'
                        ),
                        'codOpcion': self.settings.get('profuturo_cod_opcion')
                    }),
                    headers={
                        'Authorization': self.settings.get(
                            'profuturo_basic_auth'
                        )
                    },
                    method='POST'
                )
                login = yield self.http_client.fetch(login_req)
                if login.error:
                    raise tornado.httpclient.HTTPError(403)
                login = json_decode(login.body)
                if login.get('rpta', None) != 'true':
                    raise tornado.httpclient.HTTPError(403)
            except tornado.httpclient.HTTPError:
                form.errors.update({
                    'custom': u'Error en la autenticaci\xf3n'
                })
            else:
                try:
                    _access_token = jwt.decode(
                        login.get('access_token'),
                        self.public_key,
                        algorithms=['RS256']
                    )

                    user = self.db.query(
                        models.User
                    ).filter(
                        models.User.ppsuc == _access_token.get('cuspp')
                    ).first()

                    if not user:
                        user = models.User()
                        user.ppsuc = _access_token.get('cuspp')

                    user.last_login_at = datetime.now()
                    user.premium = (
                        _access_token.get('esExperiencias', 'false') == 'true'
                    )
                    self.db.add(user)
                    self.db.commit()

                except:
                    form.errors.update({
                        'custom': u'Error en la autenticaci\xf3n'
                    })
                else:
                    self.set_secure_cookie(
                        'user',
                        json_encode({
                            'id': user.id,
                            'access_token': login.get('access_token')
                        }),
                        # add 18000 for time zone offset
                        expires=datetime.fromtimestamp(
                            _access_token.get('exp') + 18000
                        )
                    )
                    self.redirect(
                        self.get_argument('next', self.reverse_url('home')) +
                        '?login=1'
                    )
                    return

        self.render('site/login.html', form=form)


class Logout(RequestHandler):

    def get(self):
        self.clear_all_cookies()
        self.redirect(self.reverse_url('home'))


class Profile(RequestHandler):

    @authenticated
    @coroutine
    def get(self):
        error = None
        _profile = {
            'name1': None,
            'name2': None,
            'last_name1': None,
            'last_name2': None,
            'email': None,
            'phone': None
        }
        try:
            profile_req = tornado.httpclient.HTTPRequest(
                self.settings.get('profuturo_api') +
                '/profuturo-rest-afiliado-war/afiliados/me?codAplication=' +
                self.settings.get('profuturo_cod_app') + '&codOpcion=' +
                self.settings.get('profuturo_cod_opcion'),
                headers={
                    'Authorization': 'bearer %s' % self.current_user.get(
                        'access_token'
                    )
                },
                method='GET'
            )
            profile = yield self.http_client.fetch(profile_req)
            if profile.error:
                raise tornado.httpclient.HTTPError(403)
            profile = json_decode(profile.body)
            if profile.get('rpta', None) != 'true':
                raise tornado.httpclient.HTTPError(403)
        except tornado.httpclient.HTTPError:
            error = u'Error al obtener el perfil del usuario'
        else:
            _profile = {
                'name1': profile.get('primerNombre'),
                'name2': profile.get('segundoNombre'),
                'last_name1': profile.get('primerApellido'),
                'last_name2': profile.get('segundoApellido'),
                'email': profile.get('email'),
                'phone': profile.get('celular')
            }

        if self.request.headers.get(
            'X-Requested-With',
            None
        ) == 'XMLHttpRequest':
            self.finish({
                'profile': _profile,
                'error': error
            })
        else:
            self.render('site/profile.html', profile=_profile, error=error)


class EditProfile(RequestHandler):

    @authenticated
    @coroutine
    def get(self):
        res = {'ok': False}
        try:
            profile_req = tornado.httpclient.HTTPRequest(
                self.settings.get('profuturo_api') +
                '/profuturo-rest-afiliado-war/afiliados/me?codAplication=' +
                self.settings.get('profuturo_cod_app') + '&codOpcion=' +
                self.settings.get('profuturo_cod_opcion'),
                headers={
                    'Authorization': 'bearer %s' % self.current_user.get(
                        'access_token'
                    )
                },
                method='GET'
            )
            profile = yield self.http_client.fetch(profile_req)
            if profile.error:
                raise tornado.httpclient.HTTPError(403)
            profile = json_decode(profile.body)
            if profile.get('rpta', None) != 'true':
                raise tornado.httpclient.HTTPError(403)
        except tornado.httpclient.HTTPError:
            res.update({
                'errors': [u'Error al obtener el perfil del usuario']
            })
        else:
            res = {
                'ok': True,
                'email': profile.get('email'),
                'phone': profile.get('celular')
            }

        self.finish(res)

    @authenticated
    @coroutine
    def post(self):
        form = forms.Profile(forms.MultiDict(self))
        res = {'ok': False}

        if form.validate():
            try:
                profile_req = tornado.httpclient.HTTPRequest(
                    self.settings.get('profuturo_api') +
                    '/profuturo-rest-afiliado-war/afiliados/me/' +
                    'regdatospuntuales',
                    body=urllib.urlencode({
                        'codAplicacion': self.settings.get(
                            'profuturo_cod_app'
                        ),
                        'codOpcion': self.settings.get('profuturo_cod_opcion'),
                        'codigoTipoSolicitud': 8,
                        'email': form.email.data,
                        'celular': form.phone.data
                    }),
                    headers={
                        'Authorization': 'bearer %s' % self.current_user.get(
                            'access_token'
                        )
                    },
                    method='POST'
                )
                profile = yield self.http_client.fetch(profile_req)
                if profile.error:
                    raise tornado.httpclient.HTTPError(403)
                profile = json_decode(profile.body)
                if profile.get('rpta', None) != 'true':
                    raise tornado.httpclient.HTTPError(403)
            except tornado.httpclient.HTTPError:
                res.update({
                    'errors': [u'Error al actualizar perfil']
                })
            else:
                res = {'ok': True}
        else:
            res.update({
                'errors': form.errors
            })

        self.finish(res)


class CheckoutHistory(RequestHandler):

    @authenticated
    def get(self):
        checkouts = self.db.query(
            models.Checkout.id.label('checkout_id'),
            models.Checkout.uuid,
            func.DATE_FORMAT(
                models.Checkout.created_at,
                '%d/%m/%Y'
            ).label('created_at'),
            models.BaseGift.gift_type,
            models.BaseGift.id,
            models.BaseGift.name,
            models.BaseGift.highlight,
            models.BaseGift.img,
            models.BaseGift.img_large,
            models.BaseGift.store_name,
            models.BaseGift.store_img,
            models.BaseGift.slug,
            models.Coupon.coupon_type,
            models.Coupon.coupon_value,
            models.Coupon.excerpt,
            models.Category.slug.label('category_slug'),
            models.Category.id.label('category_id')
        ).join(
            models.BaseGift
        ).join(
            models.Category,
            models.Category.id == models.BaseGift.id_category
        ).filter(
            models.Checkout.step == models.Checkout.ARCHIVE,
            models.Checkout.id_user == self.current_user.get('id')
        ).order_by(
            -models.Checkout.created_at
        ).all()

        _checkouts = []
        _current_date = None
        _current_group = None
        for co in checkouts:
            _ = {
                'id': co.id,
                'name': co.name,
                'highlight': co.highlight,
                'img': co.img,
                'img_large': co.img_large,
                'store_name': co.store_name,
                'store_img': co.store_img,
                'category_slug': co.category_slug,
                'category_id': co.category_id,
                'slug': co.slug,
                'uuid': co.uuid
            }
            if co.gift_type == 'coupon':
                _.update({
                    'coupon_type': co.coupon_type,
                    'coupon_value': co.coupon_value,
                    'excerpt': co.excerpt
                })
            if co.created_at != _current_date:
                _current_date = co.created_at
                _checkouts.append({
                    'date': _current_date,
                    'items': []
                })
                _current_group = _checkouts[-1]
            _current_group.get('items').append(_)

        if self.request.headers.get(
            'X-Requested-With',
            None
        ) == 'XMLHttpRequest':
            self.finish({'data': _checkouts})
        else:
            self.render('site/checkouts.html', coupons=_checkouts)


class Checkout(RequestHandler):

    @authenticated
    def get(self, category_slug, category_id, gift_slug, gift_id):

        try:
            category = self.get_category(category_slug, category_id)
        except NoResultFound:
            raise HTTPError(404)

        try:
            gift = self.get_basegift(gift_slug, gift_id, category)
            if gift.total_stock != -1 and gift.used_stock >= gift.total_stock:
                raise NoResultFound
        except NoResultFound:
            raise HTTPError(404)

        checkout = models.Checkout()
        checkout.id_user = self.current_user.get('id')
        checkout.id_gift = gift.id
        checkout.last_exchange_date = (
            datetime.now() +
            timedelta(seconds=self.settings.get('coupon_duration'))
        )
        self.db.add(checkout)

        try:
            self.db.commit()
        except:
            self.db.rollback()
            raise
        else:
            self.redirect(
                self.reverse_url(
                    'checkout_steps',
                    category.slug,
                    category.id,
                    gift.slug,
                    gift.id,
                    checkout.uuid
                )
            )


class CheckoutSteps(RequestHandler):

    def get_checkout(self, uuid, id_gift, id_user):
        checkout = self.db.query(
            models.Checkout
        ).filter(
            models.Checkout.uuid == uuid,
            models.Checkout.id_gift == id_gift,
            models.Checkout.id_user == id_user
        ).one()

        if checkout.step != models.Checkout.ARCHIVE and int(
            (datetime.now() - checkout.created_at).total_seconds()
        ) > self.settings.get('checkout_expiration'):
            # checkout process has expired
            return None

        return checkout

    @coroutine
    def check_mark(self, _type):
        try:
            req = tornado.httpclient.HTTPRequest(
                self.settings.get('profuturo_api') +
                '/profuturo-rest-zp/me/marca?cuspp=' +
                urllib.quote(
                    self.current_user.get('jwt').get('cuspp').encode('utf8')
                ) +
                '&tipoMarca=' +
                _type +
                '&codigoCanal=07',
                headers={
                    'Authorization': 'bearer %s' % self.current_user.get(
                        'access_token'
                    )
                },
                method='GET'
            )
            _client = tornado.httpclient.HTTPClient()
            res = _client.fetch(req)
            if res.error:
                raise tornado.httpclient.HTTPError(403)
            res = json_decode(res.body)
            if res.get('rpta', None) != 'true':
                raise tornado.httpclient.HTTPError(403)
        except tornado.httpclient.HTTPError:
            raise Return(False)
        else:
            _ = res.get('marca').get('indicadorMarca', None)
            raise Return(_ is not None and _.lower() == 'si')

    @authenticated
    @coroutine
    def get(self, category_slug, category_id, gift_slug, gift_id, checkout_uuid,
            form=None, name=None):

        logger.debug('LO QUIERO')

        try:
            category = self.get_category(category_slug, category_id)
        except NoResultFound:
            raise HTTPError(404)

        try:
            checkout = self.get_checkout(checkout_uuid, gift_id,
                                         self.current_user.get('id'))
            if not checkout:
                self.redirect(self.reverse_url(
                    'gift',
                    category_slug,
                    category_id,
                    gift_slug,
                    gift_id
                ))
                return
        except NoResultFound:
            raise HTTPError(404)

        try:
            gift = self.get_basegift(gift_slug, gift_id, category)
        except NoResultFound:
            raise HTTPError(404)

        _step = checkout.step
        stock = None

        if checkout.step == models.Checkout.VERIFICATION:
            logger.debug('GET ' + models.Checkout.VERIFICATION)
            if form is None:
                form = forms.Login()

        if checkout.step == models.Checkout.PROFILE:
            logger.debug('GET ' + models.Checkout.PROFILE)
            if form is None:
                _fields = []
                t = yield self.check_mark('E')
                if t:
                    _fields.append(forms.CheckoutEmail)
                t = yield self.check_mark('P')
                if t:
                    _fields.append(forms.CheckoutPhone)

                try:
                    user = self.db.query(
                        models.User
                    ).filter(
                        models.User.id == self.current_user.get('id'),
                        models.User.status == 'enabled'
                    ).one()
                except NoResultFound:
                    raise HTTPError(500)

                if user.pep_updated_at is None or (
                        user.pep_updated_at is not None and
                        int((
                            datetime.now() - user.pep_updated_at
                        ).total_seconds()) > self.settings.get(
                            'pep_update_expiration'
                        )):
                    _fields.append(forms.CheckoutPEP)
                    try:
                        profile_req = tornado.httpclient.HTTPRequest(
                            self.settings.get('profuturo_api') +
                            '/profuturo-rest-afiliado-war/afiliados/me?' +
                            'codAplication=' +
                            self.settings.get('profuturo_cod_app') +
                            '&codOpcion=' +
                            self.settings.get('profuturo_cod_opcion'),
                            headers={
                                'Authorization': 'bearer %s' % (
                                    self.current_user.get('access_token')
                                )
                            },
                            method='GET'
                        )
                        profile = yield self.http_client.fetch(profile_req)
                        if profile.error:
                            raise tornado.httpclient.HTTPError(403)
                        profile = json_decode(profile.body)
                        if profile.get('rpta', None) != 'true':
                            raise tornado.httpclient.HTTPError(403)
                    except tornado.httpclient.HTTPError:
                        pass
                    else:
                        name = profile.get('primerNombre')

                if len(_fields) == 0:
                    if isinstance(gift, models.Coupon):
                        logger.debug('CUPON')
                        checkout.step = models.Checkout.DONE
                        _step = checkout.step
                    elif isinstance(gift, models.Event):
                        logger.debug('EVENT')
                        checkout.step = models.Checkout.DONE
                        _step = checkout.step

                        stock = models.Stock()
                        stock.uuid = str(uuid4())
                        stock.generate_code(self.settings.get('code_length'))
                        gift.stock.append(stock)
                    elif isinstance(gift, models.Gift):
                        logger.debug('CAMPAIGN')
                        checkout.step = models.Checkout.DONE
                        _step = checkout.step

                        if (gift.type_stock != 2):
                            stock = models.Stock()
                            stock.uuid = str(uuid4())
                            stock.generate_code(self.settings.get('code_length'))
                            gift.stock.append(stock)

                    else:
                        '''
                            try:
                                provider = self.db.query(
                                    models.Provider
                                ).filter(
                                    models.Provider.id == gift.id_provider
                                ).one()
                            except NoResultFound:
                                raise HTTPError(500)
                            else:
                                if provider.delivery_type == models.Provider.\
                                        TYPE_DIGITAL:
                                    checkout.step = models.Checkout.DONE
                                    _step = checkout.step
                                else:
                                    checkout.step = models.Checkout.DELIVERY
                                    _step = checkout.step
                        '''

                    self.db.add(gift)
                    self.db.add(checkout)

                    try:
                        self.db.commit()
                    except:
                        self.db.rollback()
                        raise HTTPError(500)
                    else:
                        form = None

                else:
                    form = forms.CheckoutProfileUpdate()(*_fields)

        if checkout.step == models.Checkout.DELIVERY:
            logger.debug('GET ' + models.Checkout.DELIVERY)
            '''
                try:
                    provider = self.db.query(
                        models.Provider
                    ).filter(
                        models.Provider.id == gift.id_provider
                    ).one()
                except NoResultFound:
                    raise HTTPError(500)
                else:
                    if not form:
                        if provider.delivery_type == models.Provider.TYPE_DELIVERY:
                            form = forms.Delivery()
                        elif provider.delivery_type == models.Provider\
                                .TYPE_DELIVERY_FULL:
                            form = forms.DeliveryFull()
                        else:
                            raise HTTPError(500)

                    form.district.query = self.db.query(
                        models.District
                    ).filter(
                        models.District.store == provider.store
                    ).order_by(
                        models.District.name
                    )
            '''

        if checkout.step == models.Checkout.DONE:
            logger.debug('GET ' + models.Checkout.DONE)
            if gift.total_stock == -1:
                stock = models.Stock()
                stock.uuid = str(uuid4())
                stock.generate_code(self.settings.get('code_length'))
                gift.stock.append(stock)
            else:
                if checkout.id_stock:
                    stock = checkout.stock
                elif gift.used_stock < gift.total_stock:
                    stock = self.db.query(
                        models.Stock
                    ).filter(
                        models.Stock.id_base_gift == gift.id,
                        models.Stock.status == 'pending'
                    ).first()

                try:
                    user = self.db.query(
                        models.User
                    ).filter(
                        models.User.id == self.current_user.get('id'),
                        models.User.status == 'enabled'
                    ).one()
                except NoResultFound:
                    raise HTTPError(500)

            if stock:
                stock.status = 'used'
                stock.id_user = self.current_user.get('id')
                stock.selected_at = datetime.now()
                checkout.stock = stock

                if checkout.id_stock is None and \
                        not isinstance(gift, models.Coupon):
                    try:
                        invited_event = self.get_invited_user_event(
                            gift
                        )
                        if not invited_event:
                            raise NoResultFound
                    except NoResultFound:
                        raise HTTPError(404)
                    else:
                        invited_event.status = 'used'
                        self.db.add(invited_event)

            else:
                self.render('site/outofstock.html')
                return

            checkout.step = models.Checkout.ARCHIVE
            _step = models.Checkout.DONE
            gift.used_stock += 1
            self.db.add(gift)
            self.db.add(checkout)

            try:
                self.db.commit()
            except:
                self.db.rollback()
                raise HTTPError(500)
            else:
                form = None
                try:
                    profile_req = tornado.httpclient.HTTPRequest(
                        self.settings.get('profuturo_api') +
                        '/profuturo-rest-afiliado-war/afiliados/me' +
                        '?codAplication=' +
                        self.settings.get('profuturo_cod_app') +
                        '&codOpcion=' +
                        self.settings.get('profuturo_cod_opcion'),
                        headers={
                            'Authorization': 'bearer %s' % self.current_user
                            .get('access_token')
                        },
                        method='GET'
                    )
                    profile = yield self.http_client.fetch(profile_req)
                    if profile.error:
                        raise tornado.httpclient.HTTPError(403)
                    profile = json_decode(profile.body)
                    if profile.get('rpta', None) != 'true':
                        raise tornado.httpclient.HTTPError(403)
                except tornado.httpclient.HTTPError:
                    pass
                else:
                    self.send_email(
                        to=profile.get('email'),
                        subject=self.settings.get('email_subject'),
                        text=self.render_string(
                            'mailing/confirmed.txt',
                            checkout=checkout,
                            gift=gift,
                            stock=stock,
                            user=profile
                        ),
                        html=self.render_string(
                            'mailing/confirmed.html',
                            checkout=checkout,
                            gift=gift,
                            stock=stock,
                            user=profile
                        )
                    )

        self.render('site/checkout_%s.html' % _step, category=category,
                    gift=gift, checkout=checkout, form=form, name=name)

    @authenticated
    @coroutine
    def post(self, category_slug, category_id, gift_slug, gift_id,
             checkout_uuid):
        form = None
        name = None
        try:
            category = self.get_category(category_slug, category_id)
        except NoResultFound:
            raise HTTPError(404)

        try:
            gift = self.get_basegift(gift_slug, gift_id, category)
        except NoResultFound:
            raise HTTPError(404)

        try:
            checkout = self.get_checkout(checkout_uuid, gift_id,
                                         self.current_user.get('id'))
            if not checkout:
                self.redirect(self.reverse_url(
                    'gift',
                    category_slug,
                    category_id,
                    gift_slug,
                    gift_id
                ))
                return
        except NoResultFound:
            raise HTTPError(404)

        if checkout.step == models.Checkout.VERIFICATION:
            logger.debug('POST ' + models.Checkout.VERIFICATION)
            form = forms.Login(forms.MultiDict(self))

            if form.validate():
                try:
                    login_req = tornado.httpclient.HTTPRequest(
                        self.settings.get('profuturo_api') +
                        '/profuturo-rest-oauth-war/afiliados/oauth/token',
                        body=urllib.urlencode({
                            'grant_type': 'password',
                            'tipoDocumento': form.doc_type.data,
                            'numeroDocumento': form.doc_number.data,
                            'clave': form.clave.data,
                            'codAplicacion': self.settings.get(
                                'profuturo_cod_app'
                            ),
                            'codOpcion': self.settings.get(
                                'profuturo_cod_opcion'
                            )
                        }),
                        headers={
                            'Authorization': self.settings.get(
                                'profuturo_basic_auth'
                            )
                        },
                        method='POST'
                    )
                    login = yield self.http_client.fetch(login_req)
                    if login.error:
                        raise tornado.httpclient.HTTPError(403)
                    login = json_decode(login.body)
                    if login.get('rpta', None) != 'true':
                        raise tornado.httpclient.HTTPError(403)
                except tornado.httpclient.HTTPError:
                    form.errors.update({
                        'custom': u'Error en la verificaci\xf3n'
                    })
                else:
                    checkout.step = models.Checkout.PROFILE
                    self.db.add(checkout)

                    try:
                        self.db.commit()
                    except:
                        self.db.rollback()
                        raise HTTPError(500)
                    else:
                        form = None

        elif checkout.step == models.Checkout.PROFILE:
            logger.debug('POST ' + models.Checkout.PROFILE)
            _fields = []
            t = yield self.check_mark('E')
            if t:
                _fields.append(forms.CheckoutEmail)
            t = yield self.check_mark('P')
            if t:
                _fields.append(forms.CheckoutPhone)

            try:
                user = self.db.query(
                    models.User
                ).filter(
                    models.User.id == self.current_user.get('id'),
                    models.User.status == 'enabled'
                ).one()
            except NoResultFound:
                raise HTTPError(500)

            if user.pep_updated_at is None or (
                        user.pep_updated_at is not None and
                        int((
                            datetime.now() - user.pep_updated_at
                        ).total_seconds()) > self.settings.get(
                            'pep_update_expiration'
                        )):
                _fields.append(forms.CheckoutPEP)
                try:
                    profile_req = tornado.httpclient.HTTPRequest(
                        self.settings.get('profuturo_api') +
                        '/profuturo-rest-afiliado-war/afiliados/me?' +
                        'codAplication=' +
                        self.settings.get('profuturo_cod_app') +
                        '&codOpcion=' +
                        self.settings.get('profuturo_cod_opcion'),
                        headers={
                            'Authorization': 'bearer %s' % (
                                self.current_user.get('access_token')
                            )
                        },
                        method='GET'
                    )
                    profile = yield self.http_client.fetch(profile_req)
                    if profile.error:
                        raise tornado.httpclient.HTTPError(403)
                    profile = json_decode(profile.body)
                    if profile.get('rpta', None) != 'true':
                        print('ERROR')
                        raise tornado.httpclient.HTTPError(403)
                except tornado.httpclient.HTTPError:
                    pass
                else:
                    name = profile.get('primerNombre')

            form = forms.CheckoutProfileUpdate()(*_fields)
            form.process(forms.MultiDict(self))

            if form.validate():
                _profile_fields = None
                _pep_fields = None
                ok = True

                for field in form:
                    if field.name == 'email':
                        if _profile_fields is None:
                            _profile_fields = {'email': field.data}
                        else:
                            _profile_fields.update({'email': field.data})
                    if field.name == 'phone':
                        if _profile_fields is None:
                            _profile_fields = {'celular': field.data}
                        else:
                            _profile_fields.update({
                                'celular': field.data
                            })
                    if field.name == 'public_job':
                        _pep_fields = {
                            'cargoPublico': field.data,
                            'descripcionCargo': form.description.data
                            .encode('utf-8')
                        }
                        if field.data == '1':
                            _pep_fields.update({
                                'codCargoLaboral': self.get_argument('job')
                            })

                if _profile_fields:
                    _profile_fields.update({
                        'codAplication': self.settings.get(
                            'profuturo_cod_app'
                        ),
                        'codOpcion': self.settings.get(
                            'profuturo_cod_opcion'
                        ),
                        'codigoTipoSolicitud': 8
                    })
                    try:
                        profile_req = tornado.httpclient.HTTPRequest(
                            self.settings.get('profuturo_api') +
                            '/profuturo-rest-ffee-war/ffee/me/datos',
                            body=urllib.urlencode(_profile_fields),
                            headers={
                                'Authorization': 'bearer %s' % (
                                    self.current_user.get('access_token')
                                )
                            },
                            method='POST'
                        )
                        profile = yield self.http_client.fetch(profile_req)
                        logger.debug('PROFILE ' + str(profile))
                        if profile.error:
                            raise tornado.httpclient.HTTPError(403)
                        profile = json_decode(profile.body)
                        if profile.get('rpta', None) != 'true':
                            raise tornado.httpclient.HTTPError(403)
                    except tornado.httpclient.HTTPError:
                        ok = False
                        form.errors.update({
                            'custom': u'Error al actualizar perfil'
                        })

                if _pep_fields:
                    _pep_fields.update({
                        'codAplicacion': self.settings.get(
                            'profuturo_cod_app'
                        ),
                        'codOpcion': self.settings.get('profuturo_cod_opcion'),
                        'codPersona': self.current_user.get('jwt')
                        .get('cuspp').encode('utf-8')
                    })
                    try:
                        pep_req = tornado.httpclient.HTTPRequest(
                            self.settings.get('profuturo_api') +
                            '/profuturo-rest-afiliado-war/pep/datoslaborales' +
                            '?' + urllib.urlencode(_pep_fields),
                            headers={
                                'Authorization': 'bearer %s' % (
                                    self.current_user.get('access_token')
                                )
                            },
                            method='PUT',
                            allow_nonstandard_methods=True
                        )
                        pep = yield self.http_client.fetch(pep_req)
                        logger.debug('PEP ' + str(pep))
                        if pep.error:
                            raise tornado.httpclient.HTTPError(403)
                        pep = json_decode(pep.body)
                        if pep.get('rpta', None) != 'true':
                            raise tornado.httpclient.HTTPError(403)
                    except tornado.httpclient.HTTPError:
                        ok = False
                        form.errors.update({
                            'custom': u'Error al actualizar perfil'
                        })

                if ok:
                    user.pep_updated_at = datetime.now()
                    self.db.add(user)
                    checkout.step = models.Checkout.DONE

                    try:
                        self.db.commit()
                    except:
                        self.db.rollback()
                        raise HTTPError(500)
                    else:
                        form = None

        elif checkout.step == models.Checkout.DELIVERY:
            logger.debug('POST ' + models.Checkout.DELIVERY)
            try:
                provider = self.db.query(
                    models.Provider
                ).filter(
                    models.Provider.id == gift.id_provider
                ).one()
            except NoResultFound:
                raise HTTPError(500)
            else:
                if provider.delivery_type == models.Provider.TYPE_DELIVERY:
                    form = forms.Delivery(forms.MultiDict(self))
                elif provider.delivery_type == models.Provider\
                        .TYPE_DELIVERY_FULL:
                    form = forms.DeliveryFull(forms.MultiDict(self))
                    form.last_exchange_date = gift.last_exchange_date
                else:
                    raise HTTPError(500)

                if form:
                    form.district.query = self.db.query(
                        models.District
                    ).filter(
                        models.District.store == provider.store
                    ).order_by(
                        models.District.name
                    )

                    if form.validate():
                        if gift.total_stock != -1 and \
                                gift.used_stock < gift.total_stock:
                            stock = self.db.query(
                                models.Stock
                            ).filter(
                                models.Stock.id_base_gift == gift.id,
                                models.Stock.status == 'pending'
                            ).first()

                            if stock:
                                stock.status = 'used'
                                stock.address = form.address.data
                                stock.address_reference = form\
                                    .address_reference.data
                                stock.district = form.district.data
                                stock.phone = form.phone.data
                                if provider.delivery_type == models.Provider\
                                        .TYPE_DELIVERY_FULL:
                                    stock.delivery_date = datetime.strptime(
                                        form.delivery_date.data,
                                        '%d/%m/%Y'
                                    )
                                    stock.delivery_time = form\
                                        .delivery_time.data

                                stock.id_user = self.current_user.get('id')
                                stock.selected_at = datetime.now()
                                checkout.stock = stock

                                try:
                                    invited_event = self.\
                                        get_invited_user_event(gift)
                                    if not invited_event:
                                        raise NoResultFound
                                except NoResultFound:
                                    raise HTTPError(404)
                                else:
                                    invited_event.status = 'used'
                                    self.db.add(invited_event)

                            else:
                                self.render('site/outofstock.html')
                                return

                        gift.used_stock += 1
                        self.db.add(gift)
                        checkout.step = models.Checkout.DONE
                        self.db.add(checkout)

                        try:
                            self.db.commit()
                        except:
                            self.db.rollback()
                            raise HTTPError(500)
                        else:
                            form = None

        yield self.get(category.slug, category.id, gift.slug, gift.id,
                       checkout_uuid, form, name)


class ListGalleries(RequestHandler):

    @authenticated
    def get(self):
        galleries = self.db.query(
            models.Event.id,
            models.Event.slug,
            models.Event.name,
            models.Event.img
        ).join(
            models.InvitedUserEvent
        ).filter(
            models.InvitedUserEvent.id_user == self.current_user.get('id'),
            models.InvitedUserEvent.status == 'used',
            models.Event.id_gallery != None  # noqa
        ).order_by(
            models.Event.created_at
        ).all()

        if self.request.headers.get(
                'X-Requested-With',
                None
        ) == 'XMLHttpRequest':
            self.finish({
                'galleries': [{
                    'id': gallery.id,
                    'slug': gallery.slug,
                    'name': gallery.name,
                    'img': gallery.img
                } for gallery in galleries]
            })
        else:
            self.render('site/galleries.html', galleries=galleries)


class Photos(RequestHandler):

    @authenticated
    def get(self, gift_slug, gift_id):
        try:
            event = self.db.query(
                models.Event.id,
                models.Event.slug,
                models.Event.name,
                models.Event.id_gallery
            ).join(
                models.InvitedUserEvent
            ).filter(
                models.Event.id == gift_id,
                models.Event.slug == gift_slug,
                models.Event.id_gallery != None,  # noqa
                models.InvitedUserEvent.id_user == self.current_user.get('id'),
                models.InvitedUserEvent.status == 'used'
            ).one()
            gallery = self.db.query(
                models.Gallery
            ).filter(
                models.Gallery.id == event.id_gallery
            ).one()
        except NoResultFound:
            raise HTTPError(404)

        photos = self.db.query(
            models.Photo
        ).filter(
            models.Photo.id_gallery == gallery.id
        ).order_by(
            models.Photo.order
        ).all()

        if self.request.headers.get(
                'X-Requested-With',
                None
        ) == 'XMLHttpRequest':
            self.finish({
                'event': {
                    'id': event.id,
                    'name': event.name,
                    'slug': event.slug
                },
                'photos': [{
                    'id': photo.id
                } for photo in photos]
            })
        else:
            self.render('site/photos.html', event=event, photos=photos)


class DownloadPhoto(RequestHandler):

    @authenticated
    def get(self, gift_slug, gift_id, photo_id):
        try:
            event = self.db.query(
                models.Event
            ).join(
                models.InvitedUserEvent
            ).filter(
                models.Event.id == gift_id,
                models.Event.slug == gift_slug,
                models.Event.id_gallery != None,  # noqa
                models.InvitedUserEvent.id_user == self.current_user.get('id'),
                models.InvitedUserEvent.status == 'used'
            ).one()
            gallery = self.db.query(
                models.Gallery
            ).filter(
                models.Gallery.id == event.id_gallery
            ).one()
            photo = self.db.query(
                models.Photo
            ).filter(
                models.Photo.id_gallery == gallery.id,
                models.Photo.id == photo_id
            ).one()
        except NoResultFound:
            raise HTTPError(404)

        if self.s3:
            _file = self.get_s3_file(
                'static/photos/' + event.slug + '-' + event.id + '/' +
                photo.id + '.jpg'
            )
            if _file:
                self.set_header(
                    'Content-Disposition',
                    'attachment; filename=foto.jpg'
                )
                self.set_header(
                    'Content-Type',
                    'application/octet-stream'
                )
                self.finish(_file.get_contents_as_string())
        else:
            raise HTTPError(405)
