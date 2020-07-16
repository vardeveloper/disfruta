from controllers import RequestHandler


class StaticTemplate(RequestHandler):

    def initialize(self, tpl):
        self._tpl = tpl

    def get(self):
        self.render(self._tpl)
