import os
import string


DEBUG = False
XSRF_COOKIES = True
COOKIE_SECRET = ';A= /5?-@&-(E|(xdp:9!Q?E4{=1QlO.YSWg&QN7KJ7%y+6b$C|vXlU+2A$(d'
LOGIN_URL = '/login'

DATABASE_DSN = ''

PROMOTICK_API = ''
PROMOTICK_API_LOGIN = ''
PROMOTICK_API_COUPONS = ''
PROMOTICK_API_CODES = ''
PROMOTICK_API_USER = ''
PROMOTICK_API_PASS = ''
PROMOTICK_API_BUSINESS_ID = ''

_local_path = os.path.dirname(__file__)
STATIC_PATH = os.path.join(_local_path, 'static')
STATIC_URL_PREFIX = '/static/'
TEMPLATE_PATH = os.path.join(_local_path, 'templates')
KEYS_PATH = os.path.join(_local_path, 'keys')

ES_HOSTS = ['localhost']

RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify'
RECAPTCHA_SITE_KEY = ''
RECAPTCHA_SECRET_KEY = ''

PROFUTURO_API = 'https://enlinea.profuturo.com.pe'
PROFUTURO_COD_APP = 'PLD0002'
PROFUTURO_COD_OPCION = 'PLR0002'
PROFUTURO_BASIC_AUTH = 'Basic bW9iaWxlX2FwcDo='

AWS_S3_BUCKET = 'disfrutaprofuturo'
AWS_SQS_QUEUE = 'disfrutaprofuturo'

EMAIL_FROM_NAME = 'Disfruta Profuturo'
EMAIL_FROM_EMAIL = 'noreply@profuturo.com.pe'
EMAIL_SUBJECT = 'Regalo Seleccionado'

CHECKOUT_EXPIRATION = 300  # seconds
PEP_UPDATE_EXPIRATION = 24 * 60 * 60  # seconds
COUPON_DURATION = 24 * 60 * 60  # seconds

CODE_CHARS = string.ascii_uppercase + string.digits
CODE_LENGTH = 7

GMAP_KEY = ''

XSRF_COOKIE_KWARGS = {
    'secure': True,
    'httponly': True,
    'samesite': 'strict'
}


from http.cookies import Morsel
Morsel._reserved[str('samesite')] = str('SameSite')


try:
    from local_settings import *  # noqa
except ImportError:
    pass
