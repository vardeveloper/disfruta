try:
    import requests
    from requests.exceptions import HTTPError
except ImportError:
    from botocore.vendored import requests
    from botocore.vendored.requests.exceptions import HTTPError

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm.exc import NoResultFound
import elasticsearch_dsl

import models

from uuid import uuid4
import logging
import re
import unicodedata
import os

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)

_slugify_strip_re = re.compile(r'[^\w\s-]')
_slugify_hyphenate_re = re.compile(r'[-\s]+')


class PromotickSync(object):

    _token = None
    _db = create_engine(os.environ.get('DATABASE_DSN'))
    elasticsearch_dsl.connections.create_connection(
        hosts=os.environ.get('ES_HOSTS')
    )

    DISCOUNT_TYPES = {
        '1': 'percentage',
        '2': 'amount',
        '3': 'before_after'
    }

    def _slugify(self, value):
        if not isinstance(value, unicode):
            value = unicode(value)
        value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore')
        value = unicode(_slugify_strip_re.sub('', value).strip().lower())
        return _slugify_hyphenate_re.sub('-', value)

    def login(self):
        try:
            req = requests.post(
                os.environ.get('PROMOTICK_API_LOGIN'),
                params={
                    'user': os.environ.get('PROMOTICK_API_USER'),
                    'pass': os.environ.get('PROMOTICK_API_PASS'),
                    'idEmpresa': os.environ.get('PROMOTICK_API_BUSINESS_ID')
                }
            )
            if req.status_code != 200:
                raise HTTPError()
            if req.json().get('codigo') != 0:
                raise HTTPError()
        except HTTPError:
            logger.debug('Login Failed')
            return False
        else:
            try:
                self._token = req.json().get('result')\
                    .get('datoscliente')[0].get('token')
                logger.debug('Logged in')
            except IndexError:
                logger.debug('Could not retrieve token')
                return False
        return True

    def sync(self):
        if self._token is None:
            return False

        db = sessionmaker(bind=self._db)()
        ok = True

        try:
            req = requests.post(
                os.environ.get('PROMOTICK_API_COUPONS'),
                headers={
                    'Content-Type': 'application/json',
                    'token': self._token
                },
                json={
                    'idDescuento': 0,
                    'idCatalogo': 187,
                    'categorias': '0',
                    'valoresAbsolutos': '0',
                    'marcas': '0',
                    'buscar': '',
                    'idOrdenar': 1,
                    'pagina': 1,
                    'latitud': None,
                    'longitud': None,
                    'tamanioPagina': 10000,
                    'dispositivo': 1,
                    'idProvincias': '0'
                }
            )
            if req.status_code != 200:
                raise HTTPError()
            if req.json().get('codigo') != 0:
                raise HTTPError()
        except HTTPError:
            logger.debug('Could not retrieve coupons')
            return False
        else:
            categories = req.json().get('result').get('categorias')
            logger.debug('Got %s categories' % len(categories))
            _categories = dict()
            db.query(
                models.Coupon.status
            ).update({
                'status': 'disabled'
            })
            for category in categories:
                try:
                    _category = db.query(
                        models.Category
                    ).filter(
                        models.Category.third_party_id == category.get(
                            'idCategoria'
                        )
                    ).one()
                except NoResultFound:
                    _category = models.Category()
                    _category.third_party_id = category.get('idCategoria')
                    _category.name = category.get('nombreCategoria')
                    _category.slug = self._slugify(
                        category.get('nombreCategoria')
                    )
                    db.add(_category)
                _categories.update({_category.third_party_id: _category})

            coupons = req.json().get('result').get('data')
            logger.debug('Got %s coupons' % len(coupons))
            for coupon in coupons:
                try:
                    _coupon = db.query(
                        models.Coupon
                    ).filter(
                        models.Coupon.third_party_id == coupon.get(
                            'idDescuento'
                        )
                    ).one()
                    db.query(
                        models.Location
                    ).filter(
                        models.Location.id_coupon == _coupon.id
                    ).delete()
                except NoResultFound:
                    _coupon = models.Coupon()

                    _discountType = self.DISCOUNT_TYPES.get(
                        str(coupon.get('idTipoDescuento'))
                    )
                    if _discountType is None:
                        logger.debug(
                            'Got invalid discount type: %s' % _discountType
                        )
                        continue
                    _coupon.coupon_type = _discountType
                    _coupon.coupon_value = coupon.get('textoDescuento')

                    _coupon.third_party_id = coupon.get('idDescuento')

                    if coupon.get('conCupon') == 1:
                        try:
                            codes_req = requests.post(
                                os.environ.get('PROMOTICK_API_CODES'),
                                headers={
                                    'Content-Type': 'application/json',
                                    'token': self._token
                                },
                                params={
                                    'idDescuento': _coupon.third_party_id
                                }
                            )
                            if codes_req.status_code != 200:
                                raise HTTPError()
                            if codes_req.json().get('codigo') != 0:
                                raise HTTPError()
                        except HTTPError:
                            continue
                        else:
                            _codes = codes_req.json().get('result')
                            _coupon.total_stock = len(_codes)
                            for code in _codes:
                                stock = models.Stock()
                                stock.uuid = str(uuid4())
                                stock.code = code.get('codigo')
                                _coupon.stock.append(stock)

                _category = _categories.get(
                    str(coupon.get('idCategoria'))
                )
                if _category is None:
                    logger.debug('Got invalid category id: %s' % (
                        coupon.get('idCategoria')
                    ))
                    continue
                _coupon.category = _category

                _coupon.store_name = coupon.get('nombreMarca')
                _coupon.store_img = coupon.get('imagenMarca')
                _coupon.name = coupon.get('nombreDescuento')
                _coupon.slug = self._slugify(
                    coupon.get('nombreDescuento')
                )
                _coupon.img = coupon.get('imagenDescuento')
                _coupon.img_large = coupon.get('imagenDetalle')
                _coupon.img_big = coupon.get('imagenAppDetalle')
                _coupon.excerpt = coupon.get('descripcionCortaDescuento')
                _coupon.description = coupon.get('descripcionDescuento')
                _coupon.terms_and_conditions = coupon.get('terminos')
                _coupon.status = 'enabled'
                _locations = []
                for location in coupon.get('locales'):
                    _location = models.Location()
                    _location.name = location.get('nombreLocal', None)
                    _location.address = location.get('direccionLocal')
                    _location.department = location.get('departamento')
                    _location.province = location.get('provincia')
                    _location.district = location.get('distrito')
                    _location.country = location.get('pais')
                    _location.lng = location.get('longitudLocal', None)
                    _location.lat = location.get('latitudLocal', None)
                    _location.coupon = _coupon
                    _locations.append(_location)
                _coupon.locations = _locations
                db.add(_coupon)

            try:
                db.commit()
                logger.debug('Updated')
            except:
                db.rollback()
                logger.debug('Fatal DB exception')
                ok = False
            else:
                logger.debug('Updating gift index')
                gifts = db.query(
                    models.BaseGift
                ).all()
                for gift in gifts:
                    gift.es_save()
        finally:
            db.close()

        return ok
