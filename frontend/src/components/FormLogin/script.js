import Form from '@/components/Form/index';
import FormInput from '@/components/FormInput/index';
import FormPad from '@/components/FormPad/index';
//const numeric = /^[0-9]*$/;
const templateData = window.__template_data;

export default {
  name: 'FormLogin',
  components: {
    Form,
    FormInput,
    FormPad
  },
  props:[
    'action',
    'method',
    'formTitle',
    'submitLabel'
  ],
  data: function() {
    return {
      isFormBusy: 1,
      formSubmitSuccess: false,
      errorCustom: null,

      openInputClave: 0,

      errorsDocNumber: [],
      errorsDocType: [],
      errorsClave: [],

      doc_number: null,
      doc_type: null,
      clave: '',

      docTypeOptions: []
    };
  },
  watch: {
    doc_number: function() {
      this.validDocNumber();
    },
    clave: function() {
      this.validClave();
    },
    doc_type: function() {
      this.validDocType();
    }
  },
  methods: {
    handleBack: function() {
      if (document.referrer.indexOf('/login') !== -1) {
        this.$router.push({ path: '/' });
      }
      else {
        this.$router.go(-1);
      }
    },
    handleClickKey: function(key) {
      if (key === 'clear') {
        this.clave = '';
        this.openInputClave = 0;
      }
      else if (key && this.clave.length < 4) {
        this.clave += key;
        this.openInputClave = 1;
      }
    },
    validDocNumber: function() {
      const value = this.doc_number;
      let errors = [];
      if (!value) {
        errors.push('Este campo es requerido');
      } 
      this.errorsDocNumber = errors;
      return errors.length;
    },
    validClave: function() {
      const value = this.clave;
      let errors = [];
      if (!value) {
        errors.push('Este campo es requerido');
      }
      this.errorsClave = errors;
      return errors.length;
    },
    validDocType: function() {
      const value = this.doc_type;
      let errors = [];
      if (!value) {
        errors.push('Este campo es requerido');
      }
      this.errorsDocType = errors;
      return errors.length;
    },
    validate: function() {
      return this.validDocType() + this.validDocNumber() + this.validClave();
    },
    handleSubmit: function(e) {
      e.preventDefault();

      if (this.validate() === 0) {
        if (this.$refs.form && typeof this.$refs.form.submit === 'function') {
          this.$refs.form.submit();
        }
      }
    }
  },
  created: function() {
    this.errorsDocNumber = templateData.errorsDocNumber || [];
    this.errorsDocType = templateData.errorsDocType || [];
    this.docTypeOptions = templateData.docTypeOptions;
    this.errorCustom = templateData.errorCustom;
    if (this.errorCustom) {
      try {
        gtag('event', 'login_failed');
      }
      catch(e) {}
    }
  }
}
