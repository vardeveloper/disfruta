from wtforms import (
    Form,
    TextField,
    TextAreaField,
    SelectField,
    PasswordField,
    BooleanField,
    RadioField
)
from wtforms.validators import (
    Required,
    Email,
    Regexp,
    AnyOf,
    Length,
    Optional,
    ValidationError
)
from wtforms.ext.sqlalchemy.fields import QuerySelectField

from datetime import datetime, timedelta


class MultiDict(object):
    def __init__(self, handler):
        self.handler = handler

    def __iter__(self):
        return iter(self.handler.request.arguments)

    def __len__(self):
        return len(self.handler.request.arguments)

    def __contains__(self, name):
        return (name in self.handler.request.arguments)

    def getlist(self, name):
        return self.handler.get_arguments(name, strip=False)


class CheckoutProfileUpdate():

    def __call__(self, *args):
        return type('CheckoutProfileUpdate', args, dict())()


class Suggestion(Form):
    email = TextField(u'Correo electr\xf3nico', validators=[
        Required(u'Campo requerido'),
        Email(u'Correo electr\xf3nico inv\xe1lido')
    ])
    phone = TextField(u'Celular', validators=[
        Required(u'Campo requerido'),
        Regexp(r'^9(\d){8}', message=u'Tel\xe9fono inv\xe1lido')
    ])
    message = TextAreaField(u'Mensaje', validators=[
        Required(u'Campo requerido')
    ])


class Login(Form):
    doc_type = SelectField(u'Tipo de documento', choices=(
        ('00', u'DNI o Libreta Electoral'),
        ('01', u'Carn\xe9 de Extranjer\xeda'),
        ('02', u'Carn\xe9 Militar o Policial'),
        ('03', u'Libreta del Adolescente Trabajador'),
        ('04', u'Pasaporte')
    ), validators=[
        Required(u'Campo requerido'),
        AnyOf(('00', '01', '02', '03', '04'), message=u'Opci\xf3n inv\xe1lida')
    ])
    doc_number = TextField(u'N\xfamero de documento', validators=[
        Required(u'Campo requerido')
    ])
    clave = PasswordField(u'Clave web')

    def validate_doc_number(form, field):
        _min = 8
        _max = 8
        if form.doc_type.data in ('01', '04'):
            _min = 6
            _max = 11
        Length(min=_min, max=_max,
               message=u'N\xfamero de documento inv\xe1lido')(form, field)


class Profile(Form):
    email = TextField(u'Correo electr\xf3nico', validators=[
        Required(u'Campo requerido'),
        Email(u'Correo electr\xf3nico inv\xe1lido')
    ])
    phone = TextField(u'Celular', validators=[
        Required(u'Campo requerido'),
        Regexp(r'9(\d){8}', message=u'Celular inv\xe1lido')
    ])
    accept_terms = BooleanField(
        u'Acepto los t\xe9rminos y condiciones de uso.',
        validators=[
            Required(u'Debe aceptar los t\xe9rminos y condiciones')
        ]
    )


class CheckoutEmail(Form):
    email = TextField(u'Correo electr\xf3nico', validators=[
        Required(u'Campo requerido'),
        Email(u'Correo electr\xf3nico inv\xe1lido')
    ])


class CheckoutPhone(Form):
    phone = TextField(u'Tel\xe9fono', validators=[
        Required(u'Campo requerido'),
        Regexp(r'(\+)?(\d){7,11}', message=u'Tel\xe9fono inv\xe1lido')
    ])


class CheckoutPEP(Form):
    public_job = RadioField(u'Tengo un cargo p\xfablico', choices=[
        ('1', u'Si'),
        ('0', u'No')
    ])
    description = TextField(u'Ingresa el cargo que ocupas')


class Delivery(Form):
    address = TextField(u'Direcci\xf3n de entrega', validators=[
        Required(u'Campo requerido'),
        Length(min=0, max=200, message=u'Longitud m\xe1xima de 200 caracteres')
    ])
    address_reference = TextField('Referencia (opcional)', validators=[
        Optional(),
        Length(max=200, min=0, message=u'Longitud m\xe1xima de 200 caracteres')
    ])
    district = QuerySelectField(u'Distrito', validators=[
        Required(u'Campo requerido')
    ], get_label='name')
    phone = TextField(u'Celular', validators=[
        Required(u'Campo requerido'),
        Regexp(r'(\+)?(\d){7,11}', message=u'Tel\xe9fono inv\xe1lido')
    ])


class DeliveryFull(Delivery):
    delivery_date = TextField(u'D\xeda de la entrega', validators=[
        Required(u'Campo requerido')
    ])
    delivery_time = SelectField(u'Rango de hora de entrega', choices=(
        ('10-12', u'De 10am a 12pm'),
        ('12-14', u'De 12pm a 2pm'),
        ('14-16', u'De 2pm a 4pm'),
        ('16-18', u'De 4pm a 6pm')
    ), validators=[
        Required(u'Campo requerido'),
        AnyOf(('10-12', '12-14', '14-16', '16-18'),
              message=u'Opci\xf3n inv\xe1lida')
    ])

    def validate_delivery_date(form, field):
        try:
            _ = datetime.strptime(
                field.data,
                '%d/%m/%Y'
            )
            t = datetime.now() + timedelta(days=2)
            if t.weekday() > 4:
                t += timedelta(days=2)

            if _.weekday() in (5, 6) or \
                t.date() > _.date() or \
                    _.date() > form.last_exchange_date:
                raise ValidationError(u'Fecha seleccionada inv\xe1lida')
        except (ValueError, AttributeError):
            raise
            raise ValidationError(u'Formato de fecha inv\xe1lido (dd/mm/YYYY)')
