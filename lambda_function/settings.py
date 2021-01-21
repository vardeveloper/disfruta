import os
import string


DEBUG = True
ES_HOSTS = os.environ.get('ES_HOSTS')
CODE_CHARS = string.ascii_uppercase + string.digits
DATABASE_DSN = os.environ.get('DATABASE_DSN')
