import Form from '@/components/Form/index';
import FormInput from '@/components/FormInput/index';
import FormCheckbox from '@/components/FormCheckbox/index';
import Datepicker from 'vuejs-datepicker';
import { es } from 'vuejs-datepicker/dist/locale'

function Pesaj(Y) {
  var C = Math.floor(Y/100);
  var N = Y - 19*Math.floor(Y/19);
  var K = Math.floor((C - 17)/25);
  var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
  I = I - 30*Math.floor((I/30));
  I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
  var J = Y + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4);
  J = J - 7*Math.floor(J/7);
  var L = I - J;
  var M = 3 + Math.floor((L + 40)/44);
  var D = L + 28 - 31*Math.floor(M/4);

  return new Date(Y, M - 1,  D);
}

function getGoldenDays(y) {
  const p = Pesaj(y);
  let g = [
    // mes - dia
    '0-1',
    '4-1',
    '5-29',

    // TODO: 06-30, fiorella eguzquisa dice que va todos los años
    '5-30',
    // 

    '6-28',

    // TODO: 07-29, fiorella eguzquisa dice que no va
    //'6-29',
    //

    '7-30',
    '9-8',
    '10-1',
    '11-8',
    '11-25',
    p.getMonth() + '-' + (p.getDate() - 3),
    p.getMonth() + '-' + (p.getDate() - 2)
  ];

  return g;
}

function getNextAvailableDay(){
  var d = new Date();
  var day = d.getDay();
  var ndate = new Date(d.getTime());

  if (day === 0) {
    ndate = new Date(d.setDate(d.getDate() + 3));
  }
  else if (day === 1 || day === 2 || day === 3) {
    ndate = new Date(d.setDate(d.getDate() + 2));
  }
  else if (day === 4 || day === 5 || day === 6) {
    ndate = new Date(d.setDate(d.getDate() + 4));
  }

  return ndate;
}

const test_phone = /^(\+)?(\d){7,11}$/;
const templateData = window.__template_data;
const disabledDates = {
  to: getNextAvailableDay(),
  customPredictor: function(date) {
    const day = date.getDay();
    if(
      day === 0 || day === 6 ||
      getGoldenDays(
        date.getFullYear()
      ).indexOf(date.getMonth() + '-' + date.getDate()) !== -1) {
      return true;
    }
  }
};

export default {
  name: 'FormDelivery',
  components: {
    Form,
    FormInput,
    FormCheckbox,
    Datepicker
  },
  props: {
    submitLabel: {
      default: 'Continuar'
    },
    requestProfileOnInit: {
      default: false,
      type: Boolean
    },
    allowNormalSubmit: {
      default: false,
      type: Boolean
    }
  },
  data: function() {
    return  {
      isFormBusy: 0,
      formSubmitSuccess: false,

      address: null,
      reference: null,
      district: null,
      phone: null,
      deliveryDate: null,
      deliveryTime: null,
      deliveryDatePicker: null,

      districtOptions: '',
      deliveryTimeOptions: [],

      errorsAddress: [],
      errorsReference: [],
      errorsDistrict: [],
      errorsPhone: [],
      errorsDeliveryDate: [],
      errorsDeliveryTime: [],
      errorCustom: null,
      deliveryDatePicker_es: es,
      disabledDates: disabledDates
    };
  },
  watch: {
    address: function() {
      this.validAddress();
    },
    phone: function() {
      this.validPhone();
    },
    deliveryDate: function() {
      this.validDeliveryDate();
    },
    deliveryTime: function() {
      this.validDeliveryTime();
    },
    district: function() {
      this.validDistrict();
    }
  },
  computed: {
    profile: function() {
      return this.$store.state.profile;
    }
  },
  methods: {
    handleCancelBtn: function() {
      this.$emit('cancel');
    },
    valid: function(name, callback) {
      const value = this[name];
      let errors = callback(value);
      this['errors' + name.charAt(0).toUpperCase() + name.slice(1)] = errors;
      return errors.length;
    },
    validPhone: function() {
      return this.valid('phone', function(value) {
        let errors = [];
        if (!value) {
          errors.push('Este campo es requerido');
        }
        else if (!test_phone.test(value)) {
          errors.push('Teléfono inválido');
        }
        return errors;
      });
    },
    validAddress: function() {
      return this.valid('address', function(value) {
        let errors = [];
        if (!value) {
          errors.push('Este campo es requerido');
        }
        return errors;
      });
    },
    validDistrict: function() {
      return this.valid('district', function(value) {
        let errors = [];
        if (!value) {
          errors.push('Este campo es requerido');
        }
        return errors;
      });
    },
    validDeliveryDate: function() {
      const self = this;
      return this.valid('deliveryDate', function(value) {
        let errors = [];
        if (!value && self.deliveryTimeOptions) {
          errors.push('Este campo es requerido');
        }
        return errors;
      });
    },
    validDeliveryTime: function() {
      const self = this;
      return this.valid('deliveryTime', function(value) {
        let errors = [];
        if (!value && self.deliveryTimeOptions) {
          errors.push('Este campo es requerido');
        }
        return errors;
      });
    },
    validate: function() {
      return this.validPhone() +
        this.validAddress() +
        this.validDistrict() +
        this.validDeliveryDate() +
        this.validDeliveryTime();
    },
    handleSubmit: function(e) {
      const self = this;
      e.preventDefault();
      if (self.validate() === 0) {
        if (self.$refs.form && typeof self.$refs.form.submit === 'function') {
          self.$refs.form.submit();
        }
      }
    },
    limitKeysPhone: function(e) {
      const c = String.fromCharCode(e.keyCode);
      if (
        isNaN(parseInt(c, 10)) &&
        [16,17,91,18,37,37,38,39,40,8,9].indexOf(e.keyCode) === -1
      ) {
        e.preventDefault();
      }
    }
  },
  created: function() {
    this.districtOptions = templateData.districtOptions;
    this.deliveryTimeOptions = templateData.deliveryTimeOptions;
    this.errorCustom = templateData.errorCustom;
    this.errorsPhone = templateData.errorsPhone;
    this.errorsAddress = templateData.errorsAddress;
    this.errorsDistrict = templateData.errorsDistrict;
    this.errorsDeliveryDate = templateData.errorsDeliveryDate;
    this.errorsDeliveryTime = templateData.errorsDeliveryTime;

    this.address = templateData.address;
    this.reference = templateData.reference;
    this.district = templateData.district;
    this.phone = templateData.phone;
    this.deliveryTime = templateData.deliveryTime;

    let deliveryDatePicker = (templateData.deliveryDate || '').split('/');
    let newDeliveryDate;
    if (deliveryDatePicker.length > 2) {
      newDeliveryDate = new Date(
        parseInt(deliveryDatePicker[2], 10),
        parseInt(deliveryDatePicker[1], 10) - 1,
        parseInt(deliveryDatePicker[0], 10)
      );

      if (newDeliveryDate instanceof Date && !isNaN(newDeliveryDate)) {
        this.deliveryDate = newDeliveryDate;
      }
    }
  }
}
