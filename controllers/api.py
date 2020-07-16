from controllers import RequestHandler

import tornado.httpclient
from tornado.web import authenticated
from tornado.gen import coroutine
from tornado.escape import json_decode


class GetSectors(RequestHandler):

    @authenticated
    @coroutine
    def get(self):
        ok = True
        try:
            sectors_req = tornado.httpclient.HTTPRequest(
                self.settings.get('profuturo_api') +
                '/profuturo-rest-afiliado-war/pep/sector?' +
                'codAplicacion=' + self.settings.get('profuturo_cod_app') +
                '&codOpcion=' + self.settings.get('profuturo_cod_opcion'),
                headers={
                    'Authorization': 'bearer %s' % self.current_user.get(
                        'access_token'
                    )
                },
                method='GET'
            )
            sectors = yield self.http_client.fetch(sectors_req)
            if sectors.error:
                raise tornado.httpclient.HTTPError(400)
            sectors = json_decode(sectors.body)
            if sectors.get('rpta', None) != 'true':
                raise tornado.httpclient.HTTPError(400)
        except tornado.httpclient.HTTPError:
            ok = False
        else:
            _sectors = [
                (s.get('codigo'), s.get('descripcion'))
                for s in sectors.get('sectores')
            ]

        res = {'ok': ok}
        if ok:
            res.update({'choices': _sectors})
        self.finish(res)


class GetJobs(RequestHandler):

    @authenticated
    @coroutine
    def get(self, cod_sector):
        ok = True
        try:
            jobs_req = tornado.httpclient.HTTPRequest(
                self.settings.get('profuturo_api') +
                '/profuturo-rest-afiliado-war/pep/cargo?' +
                'codAplicacion=' +
                self.settings.get('profuturo_cod_app') +
                '&codOpcion=' + self.settings.get('profuturo_cod_opcion') +
                '&codSector=' + cod_sector,
                headers={
                    'Authorization': 'bearer %s' % self.current_user.get(
                        'access_token'
                    )
                },
                method='GET'
            )
            jobs = yield self.http_client.fetch(jobs_req)
            if jobs.error:
                raise tornado.httpclient.HTTPError(400)
            jobs = json_decode(jobs.body)
            if jobs.get('rpta', None) != 'true':
                raise tornado.httpclient.HTTPError(400)
        except tornado.httpclient.HTTPError:
            ok = False
        else:
            _jobs = [
                (j.get('codigo'), j.get('descripcion'))
                for j in jobs.get('cargos')
            ]

        res = {'ok': ok}
        if ok:
            res.update({'choices': _jobs})
        self.finish(res)
