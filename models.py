from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (
    Column,
    Integer,
    Unicode,
    Enum,
    DateTime,
    UnicodeText,
    Boolean,
    ForeignKey,
    Date
)
from sqlalchemy.dialects.mysql import FLOAT
from sqlalchemy.orm import relationship, backref
import elasticsearch_dsl
from elasticsearch.exceptions import NotFoundError

from datetime import datetime
from uuid import uuid4
import random

import settings


Entity = declarative_base()


def _uuid4():
    return str(uuid4())


class ModelNotCommited(Exception):
    pass


class ESBaseGift(elasticsearch_dsl.Document):
    store_name = elasticsearch_dsl.Text(analyzer='snowball')
    name = elasticsearch_dsl.Text(analyzer='snowball')
    description = elasticsearch_dsl.Text(analyzer='snowball')
    premium = elasticsearch_dsl.Boolean()
    enabled = elasticsearch_dsl.Boolean()

    class Meta:
        doc_type = '_doc'

    class Index:
        name = 'base_gift'
        doc_type = '_doc'
        settings = {
            'number_of_shards': 2
        }


class BaseGift(Entity):
    __tablename__ = 'base_gifts'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    GIFT = 'gift'
    EVENT = 'event'
    COUPON = 'coupon'

    id = Column(Integer, primary_key=True)
    gift_type = Column(Unicode(100))
    store_name = Column(Unicode(100), nullable=False)  # nombreMarca
    store_img = Column(Unicode(255), nullable=False)  # imagenMarca
    name = Column(Unicode(100), nullable=False)  # nombreDescuento
    slug = Column(Unicode(100), nullable=False)
    img = Column(Unicode(255), nullable=False)  # imagenDescuento
    img_large = Column(Unicode(255), nullable=False)  # imagenDetalle
    img_big = Column(Unicode(255), nullable=False)  # imagenAppDetalle
    description = Column(UnicodeText, nullable=False)  # descripcionDescuento
    used_stock = Column(Integer, nullable=False, server_default='0')
    total_stock = Column(Integer, nullable=False, server_default='-1')
    type_stock = Column(Enum('1', '2', '3'), nullable=False)
    status = Column(Enum('enabled', 'disabled'), nullable=False,
                    server_default='enabled', index=True)
    highlight = Column(Boolean, server_default='0')
    order = Column(Integer, nullable=False, server_default='0')
    created_at = Column(DateTime, nullable=False, default=datetime.now)

    id_category = Column(Integer,
                         ForeignKey('categories.id', ondelete='CASCADE'),
                         nullable=False)

    id_provider = Column(Integer,
                         ForeignKey('providers.id', ondelete='CASCADE'))

    stock = relationship('Stock', backref=backref('gift'),
                         passive_deletes=True)

    checkouts = relationship('Checkout', backref=backref('gift'),
                             passive_deletes=True)

    def es_save(self):
        try:
            if not self.id:
                raise ModelNotCommited()
            _gift = ESBaseGift.get(id=self.id)
        except NotFoundError:
            _gift = ESBaseGift(meta={'id': self.id})

        _gift.store_name = self.store_name
        _gift.name = self.name
        _gift.description = self.description
        _gift.premium = not isinstance(self, Coupon)
        _gift.enabled = self.status == 'enabled'
        _gift.save()

    __mapper_args__ = {
        'polymorphic_identity': 'base_gifts',
        'polymorphic_on': gift_type,
        'with_polymorphic': '*'
    }


class Gift(BaseGift):
    __tablename__ = 'gifts'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, ForeignKey('base_gifts.id'), primary_key=True)
    pre = Column(UnicodeText)
    post = Column(UnicodeText)
    last_exchange_date = Column(Date, nullable=False)
    disclaimer = Column(UnicodeText)

    TYPE_PICKUP = 'pickup'
    TYPE_DIGITAL = 'digital'
    TYPE_DELIVERY = 'delivery'
    TYPE_DELIVERY_FULL = 'delivery_full'
    delivery_type = Column(Unicode(255), nullable=False)

    id_special_event = Column(Integer,
                              ForeignKey('special_events.id',
                                         ondelete='CASCADE')
                              )

    __mapper_args__ = {'polymorphic_identity': 'gift'}


class Event(BaseGift):
    __tablename__ = 'events'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, ForeignKey('base_gifts.id'), primary_key=True)
    taken_place_on = Column(DateTime)
    taken_place_on2 = Column(DateTime)
    start_on = Column(DateTime)
    synopsis = Column(UnicodeText)
    cast = Column(UnicodeText)
    place = Column(Unicode(200))
    invitation_detail = Column(UnicodeText)
    has_combo = Column(Boolean, nullable=False, server_default='0')
    combo_detail = Column(Unicode(200))
    has_seats = Column(Boolean, nullable=False, server_default='0')
    seats_detail = Column(Unicode(200))
    last_exchange_date = Column(Date, nullable=False)
    disclaimer = Column(UnicodeText)
    lng = Column(FLOAT(10, 6))
    lat = Column(FLOAT(10, 6))

    id_gallery = Column(Integer,
                        ForeignKey('galleries.id', ondelete='CASCADE'))

    invited = relationship('InvitedUserEvent', backref=backref('event'),
                           passive_deletes=True)

    __mapper_args__ = {'polymorphic_identity': 'event'}


class Coupon(BaseGift):
    __tablename__ = 'coupons'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, ForeignKey('base_gifts.id'), primary_key=True)
    excerpt = Column(Unicode(255), nullable=False)  # descripcionCortaDescuento
    coupon_type = Column(Enum('percentage', 'amount', 'before_after'),
                         nullable=False)  # idTipoDescuento
    coupon_value = Column(Unicode(100))  # textoDescuento
    terms_and_conditions = Column(UnicodeText, nullable=False)  # terminos
    third_party_id = Column(Unicode(100))  # idDescuento

    locations = relationship('Location', backref=backref('coupon'),
                             passive_deletes=True)

    __mapper_args__ = {'polymorphic_identity': 'coupon'}


class Location(Entity):
    __tablename__ = 'locations'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    name = Column(Unicode(100))  # nombreLocal
    address = Column(Unicode(255), nullable=False)  # direccionLocal
    department = Column(Unicode(100), nullable=False)  # departamento
    province = Column(Unicode(100), nullable=False)  # provincia
    district = Column(Unicode(100), nullable=False)  # distrito
    country = Column(Unicode(100), nullable=False)  # pais
    lng = Column(FLOAT(10, 6))  # longitudLocal
    lat = Column(FLOAT(10, 6))  # latitudLocal

    id_coupon = Column(Integer, ForeignKey('coupons.id', ondelete='CASCADE'),
                       nullable=False)


class Category(Entity):
    __tablename__ = 'categories'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    name = Column(Unicode(100), nullable=False)
    slug = Column(Unicode(100), nullable=False, index=True, unique=True)
    premium = Column(Boolean, nullable=False, server_default='0')
    order = Column(Integer, nullable=False, server_default='0')
    status = Column(Enum('disabled', 'enabled'), nullable=False, index=True,
                    server_default='disabled')
    third_party_id = Column(Unicode(100))

    coupons = relationship('BaseGift', backref=backref('category'),
                           passive_deletes=True)
    special_events = relationship('SpecialEvent', backref=backref('category'),
                                  passive_deletes=True)


class Stock(Entity):
    __tablename__ = 'stock'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    uuid = Column(Unicode(36), index=True, unique=True)
    code = Column(Unicode(100))  # codigo
    phone = Column(Unicode(100))
    address = Column(Unicode(200))
    address_reference = Column(Unicode(200))
    status = Column(Enum('pending', 'used'), nullable=False,
                    server_default='pending')
    selected_at = Column(DateTime)
    selected_at = Column(DateTime)
    done_at = Column(DateTime)
    delivered_to_profuturo = Column(Boolean, nullable=False,
                                    server_default='0')
    delivery_type = Column(Enum('pickup', 'delivery'))
    delivery_date = Column(Date)
    delivery_time = Column(Enum('10-12', '12-14', '14-16', '16-18'))

    id_base_gift = Column(Integer,
                          ForeignKey('base_gifts.id', ondelete='CASCADE'),
                          nullable=False)
    id_user = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    id_district = Column(Integer, ForeignKey('districts.id'))

    checkout = relationship('Checkout', uselist=False, back_populates='stock')

    def generate_code(self, length):
        self.code = ''.join(
            random.choice(settings.CODE_CHARS) for i in range(length)
        )


class District(Entity):
    __tablename__ = 'districts'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    name = Column(Unicode(100), nullable=False)
    store = Column(Unicode(100), nullable=False, index=True)
    status = Column(Enum('enabled', 'disabled'), nullable=False,
                    server_default='enabled')

    choices = relationship('Stock', backref=backref('district'),
                           passive_deletes=True)


class Gallery(Entity):
    __tablename__ = 'galleries'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)

    event = relationship('Event', backref=backref('gallery'),
                         passive_deletes=True)
    photos = relationship('Photo', backref=backref('gallery'),
                          passive_deletes=True, order_by='Photo.order')


class Photo(Entity):
    __tablename__ = 'photos'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    order = Column(Integer, nullable=False, server_default='0')

    id_gallery = Column(Integer,
                        ForeignKey('galleries.id', ondelete='CASCADE'),
                        nullable=False)


class User(Entity):
    __tablename__ = 'users'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    ppsuc = Column(Unicode(50), nullable=False, unique=True)
    premium = Column(Boolean, nullable=False, server_default='0')
    status = Column(Enum('enabled', 'disabled'), nullable=False,
                    server_default='enabled')
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    last_login_at = Column(DateTime)
    pep_updated_at = Column(DateTime)

    id_agent = Column(Integer, ForeignKey('agents.id', ondelete='CASCADE'))
    id_director = Column(Integer,
                         ForeignKey('directors.id', ondelete='CASCADE'))
    id_manager = Column(Integer,
                        ForeignKey('managers.id', ondelete='CASCADE'))

    choices = relationship('Stock', backref=backref('user'),
                           passive_deletes=True)
    invites = relationship('InvitedUserEvent', backref=backref('user'),
                           passive_deletes=True)
    checkouts = relationship('Checkout', backref=backref('user'),
                             passive_deletes=True)


class Checkout(Entity):
    __tablename__ = 'checkouts'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    VERIFICATION = 'verification'
    PROFILE = 'profile'
    DELIVERY = 'delivery'
    DONE = 'done'
    ARCHIVE = 'archive'

    id = Column(Integer, primary_key=True)
    uuid = Column(Unicode(36), nullable=False, index=True, unique=True,
                  default=_uuid4)
    step = Column(Enum(VERIFICATION, PROFILE, DELIVERY, DONE, ARCHIVE),
                  nullable=False, index=True, server_default='profile')
    created_at = Column(DateTime, nullable=False, default=datetime.now)
    last_exchange_date = Column(DateTime, nullable=False)

    id_gift = Column(Integer, ForeignKey('base_gifts.id', ondelete='CASCADE'),
                     nullable=False)
    id_user = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'),
                     nullable=False)
    id_stock = Column(Integer, ForeignKey('stock.id', ondelete='CASCADE'))
    
    stock = relationship('Stock', back_populates='checkout')


class InternalUser(Entity):
    __tablename__ = 'internal_users'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    user_type = Column(Unicode(100))
    name = Column(Unicode(255), nullable=False)
    email = Column(Unicode(255), nullable=False, unique=True, index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    last_login_at = Column(DateTime)

    __mapper_args__ = {
        'polymorphic_identity': 'internal_users',
        'polymorphic_on': user_type,
        'with_polymorphic': '*'
    }


class Agent(InternalUser):
    __tablename__ = 'agents'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, ForeignKey('internal_users.id'), primary_key=True)

    users = relationship('User', backref=backref('agent'),
                         passive_deletes=True)

    __mapper_args__ = {'polymorphic_identity': 'agent'}


class Director(InternalUser):
    __tablename__ = 'directors'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, ForeignKey('internal_users.id'), primary_key=True)

    users = relationship('User', backref=backref('director'),
                         passive_deletes=True)

    __mapper_args__ = {'polymorphic_identity': 'director'}


class Manager(InternalUser):
    __tablename__ = 'managers'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, ForeignKey('internal_users.id'), primary_key=True)

    users = relationship('User', backref=backref('manager'),
                         passive_deletes=True)

    __mapper_args__ = {'polymorphic_identity': 'manager'}


class Admin(InternalUser):
    __tablename__ = 'admins'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, ForeignKey('internal_users.id'), primary_key=True)

    __mapper_args__ = {'polymorphic_identity': 'admin'}


class Provider(InternalUser):
    __tablename__ = 'providers'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    TYPE_PICKUP = 'pickup'
    TYPE_DIGITAL = 'digital'
    TYPE_DELIVERY = 'delivery'
    TYPE_DELIVERY_FULL = 'delivery_full'

    id = Column(Integer, ForeignKey('internal_users.id'), primary_key=True)
    store = Column(Unicode(100), nullable=False, index=True, unique=True)
    delivery_type = Column(Unicode(255), nullable=False)

    gifts = relationship('BaseGift', backref=backref('provider'),
                         passive_deletes=True)

    __mapper_args__ = {'polymorphic_identity': 'provider'}


class Banner(Entity):
    __tablename__ = 'banners'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    module = Column(Enum('home', 'experiencias', 'logo'), nullable=False)
    img = Column(Unicode(255), nullable=False)
    description = Column(Unicode(100))
    link = Column(Unicode(255))
    order = Column(Integer, nullable=False, server_default='0')
    status = Column(Enum('disabled', 'enabled'), nullable=False,
                    server_default='enabled')


class SpecialEvent(Entity):
    __tablename__ = 'special_events'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    title = Column(Unicode(100), nullable=False)
    slug = Column(Unicode(100), nullable=False, index=True, unique=True)
    greeting = Column(Unicode(200), nullable=False)
    highlight = Column(Boolean, server_default='0')
    img = Column(Unicode(255), nullable=False)
    img_large = Column(Unicode(255), nullable=False)
    img_big = Column(Unicode(255), nullable=False)
    status = Column(Enum('enabled', 'disabled'), nullable=False,
                    server_default='enabled')
    last_exchange_date = Column(Date, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    id_category = Column(Integer,
                         ForeignKey('categories.id', ondelete='CASCADE'),
                         nullable=False)

    gifts = relationship('Gift', backref=backref('special_event'),
                         passive_deletes=True)
    invited = relationship('InvitedUserEvent',
                           backref=backref('special_event'),
                           passive_deletes=True)


class InvitedUserEvent(Entity):
    __tablename__ = 'invited_user_events'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    status = Column(Enum('pending', 'used'), nullable=False,
                    server_default='pending')

    id_gift = Column(Integer, ForeignKey('events.id', ondelete='CASCADE'))
    id_special_event = Column(Integer,
                              ForeignKey('special_events.id',
                                         ondelete='CASCADE')
                              )
    id_user = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'),
                     nullable=False)


class Suggestion(Entity):
    __tablename__ = 'suggestions'
    __table_args__ = {
        'mysql_engine': 'InnoDB',
        'mysql_charset': 'utf8'
    }

    id = Column(Integer, primary_key=True)
    email = Column(Unicode(150), nullable=False)
    phone = Column(Unicode(50), nullable=False)
    message = Column(UnicodeText, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now)


if __name__ == '__main__':
    from sqlalchemy import create_engine

    engine = create_engine(settings.DATABASE_DSN, echo=settings.DEBUG)
    Entity.metadata.create_all(engine)

    elasticsearch_dsl.connections.create_connection(hosts=settings.ES_HOSTS)
    try:
        ESBaseGift._index.delete()
    except NotFoundError:
        pass
    ESBaseGift.init()
