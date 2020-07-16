/* global grecaptcha: true */
import FormInput from '@/components/FormInput/index';
import FormTextArea from '@/components/FormTextArea/index';

const test_phone = /^9(\d){8}$/;
const test_email = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const templateData = window.__template_data;

export default {
  name: 'FormSuggestion',
  template: '',
  components: {
    FormInput,
    FormTextArea
  },
  props: [
    'action',
    'method',
  ],
  data: function() {
    return {
      isLoaded: 0,
      errorsEmail: [],
      errorsPhone: [],
      errorsMessage: [],
      email: null,
      phone: null,
      message: null
    }
  },
  watch: {
    email: function() {
      this.validEmail();
    },
    phone: function() {
      this.validPhone();
    },
    message: function() {
      this.validMessage();
    }
  },
  methods: {
    validEmail: function() {
      const value = this.email;
      let errors = [];
      if (!value) {
        errors.push('Este campo es requerido');
      }
      else if (!test_email.test(value)) {
        errors.push('Email inválido');
      }
      this.errorsEmail = errors;
      return errors.length;
    },
    validPhone: function() {
      const value = this.phone;
      let errors = [];
      if (!value) {
        errors.push('Este campo es requerido');
      }
      else if (!test_phone.test(value)) {
        errors.push('Teléfono inválido');
      }
      this.errorsPhone = errors;
      return errors.length;
    },
    validMessage: function() {
      const value = this.message;
      let errors = [];
      if (!value) {
        errors.push('Este campo es requerido');
      }
      this.errorsMessage = errors;
      return errors.length;
    },
    validate: function() {
      return this.validEmail() + this.validMessage() + this.validPhone();
    },
    handleSubmit: function() {
      if (this.validate() === 0) {
        grecaptcha.execute();
      }
    }
  },
  created: function() {
    const self = this;
    let recaptchaScript = {};

    if (!document.querySelector('#recaptchaScript')) {
      recaptchaScript = document.createElement('script');
      recaptchaScript.setAttribute('id', 'recaptchaScript');
      recaptchaScript.setAttribute('src', 'https://www.google.com/recaptcha/api.js?onload=recaptchaOnLoad');
      recaptchaScript.async = true;
      recaptchaScript.defer = true;
      document.head.appendChild(recaptchaScript);
    }

    window.recaptchaOnLoad = function() {
      self.isLoaded = 1;
    };

    window.suggestionFormHandleSubmit = function() {
      self.$refs.form.submit();
    };

    self.errorsPhone = templateData.errorsPhone || [];
    self.errorsEmail = templateData.errorsEmail || [];
    self.errorsMessage = templateData.errorsMessage || [];
  }
};
