import tornado
from tornado.options import define, options, parse_command_line
from sqlalchemy import create_engine
from jinja2 import Environment, FileSystemLoader
from elasticsearch_dsl import connections

import settings
from urls import urls


global_settings = dict((setting.lower(), getattr(settings, setting))
                       for setting in dir(settings) if setting.isupper())


class Application(tornado.web.Application):

    def __init__(self, handlers=None, default_host='', transforms=None,
                 **settings):
        super(Application, self).__init__(handlers, default_host, transforms,
                                          **settings)
        self._db_engine = create_engine(
            self.settings.get('database_dsn'),
            pool_recycle=3600,
            echo=self.settings.get('debug')
        )
        self._template_env = Environment(
            loader=FileSystemLoader(self.settings.get('template_path')),
            auto_reload=self.settings.get('debug'),
            extensions=['jinja2.ext.do']
        )
        connections.create_connection(hosts=self.settings.get('es_hosts'))


if __name__ == '__main__':
    define('host', default='127.0.0.1', help='host address to listen on')
    define('port', default=8888, type=int, help='port to listen on')

    parse_command_line()
    application = Application(urls, **global_settings)
    application.listen(options.port, options.host, xheaders=True)

    tornado.ioloop.IOLoop.instance().start()
