import Form from '@/components/Form/index';
import FormInput from '@/components/FormInput/index';
import FormRadio from '@/components/FormRadio/index';
import axios from 'axios'

const test_phone = /^(\+)?(\d){7,11}$/;
const test_email = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export default {
  name: 'FormProfileVerifyData',
  components: {
    Form,
    FormInput,
    FormRadio
  },
  props: {
    submitLabel: {
      default: 'Actualizar'
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
      name: '',
      email: null,
      phone: null,
      public_job: null,
      description: null,
      job: null,
      sector: null,

      errorCustom: null,
      public_job_error: null,
      form: null
    };
  },
  watch: {
    email: function() { this.validEmail(); },
    phone: function() { this.validPhone(); },
    job: function() { this.validJob(); },
    sector: function() { 
      this.validSector();
      this.getJobs();
    },
    public_job: function(on) {
      if (!on) {
        this.sector = null;
        this.job = null;
      }
      else {
        this.description = null;
      }
    }
  },
  methods: {
    handleCancelBtn: function() {
      this.$emit('cancel');
    },
    validPublic: function() {
      return 0;
    },
    validEmail: function() {
      const value = this.email;
      const form = this.form || {};
      let errors = [];

      if (!form.email) { 
        return 0;
      }

      if (!value) {
        errors.push('Este campo es requerido');
      }
      else if (!test_email.test(value)) {
        errors.push('Email inválido');
      }
      form.email.errors = errors;
      return errors.length;
    },
    validPhone: function() {
      const value = this.phone;
      const form = this.form || {};
      let errors = [];

      if (!form.phone) { 
        return 0;
      }

      if (!value) {
        errors.push('Este campo es requerido');
      }
      else if (!test_phone.test(value)) {
        errors.push('Teléfono inválido');
      }
      form.phone.errors = errors;
      return errors.length;
    },
    validSector: function() {
      const value = this.sector;
      const form = this.form || {};
      let errors = [];

      if (!form.sector) { 
        return 0;
      }

      if (this.public_job && !value) {
        errors.push('Este campo es requerido');
      }
      form.sector.errors = errors;
      return errors.length;
    },
    validJob: function() {
      const value = this.job;
      const form = this.form || {};
      let errors = [];

      if (!form.job) { 
        return 0;
      }

      if (this.public_job && !value) {
        errors.push('Este campo es requerido');
      }
      form.job.errors = errors;
      return errors.length;
    },
    validatePublicJob: function() {
      if ( this.public_job == null ) {
        this.public_job_error = 'Por favor elige un opción';
        return 1;
      }

      this.public_job_error = null;
      return 0;
    },
    validate: function() {
      let result = 0;
      const form = this.form || {};

      if (form.email) { result += this.validEmail(); }
      if (form.phone) { result += this.validPhone(); }
      if (form.job) { result += this.validJob(); }
      if (form.sector) { result += this.validSector(); }
      result += this.validatePublicJob();
      return result;
    },
    handleSubmit: function(e) {
      const self = this;
      e.preventDefault();
      if (self.validate() === 0) {
        if (self.$refs.form && typeof self.$refs.form.submit === 'function') {
          self.$refs.form.submit();
          if (self.form.email) {
            try {
              gtag('event', 'profile_update');
            }
            catch(e) {}
          }

          try {
            gtag('event', 'pep_update');
          }
          catch(e) {}
        }
      }
    },
    getSectors: function() {
      const self = this;
      self.isFormBusy = 1;

      axios({
        url: '/api/get-sectors',
        method: 'get'
      })
      .then(function(response) {
        const data = response.data;
        if (data && data.ok && data.choices) {
          if (self.form.sector) {
            self.form.sector.options = [].concat(data.choices);
          }
        }
        self.isFormBusy = 0;
      })
      .catch(function() {
        if (self.form.job) {
          self.form.job.options = [];
          self.job = null;
          self.$refs.job.$refs.input.blur();
        }
        self.isFormBusy = 0;
      });
    },
    getJobs: function() {
      const self = this;
      self.isFormBusy = 1;

      axios({
        url: '/api/get-jobs/' + this.sector,
        method: 'get'
      })
      .then(function(response) {
        const data = response.data;
        if (data && data.ok && data.choices) {
          if (self.form.job) {
            self.form.job.options = data.choices;
          }
        }
        self.isFormBusy = 0;
      })
      .catch(function() {
        if (self.form.job) {
          self.form.job.options = [];
        }
        self.isFormBusy = 0;
      });
    },
    function1: function() {
      this.public_job = true;
    },
    function2: function() {
      this.public_job = false;
    },
    activeTooltip: function() {
      this.$refs.tooltip.classList.add('info-tooltip-active');
    },
    closeTooltip: function() {
      this.$refs.tooltip.classList.remove('info-tooltip-active');
    }
  },
  created: function() {
    const templateData = (window.__template_data || {});
    this.form = templateData.form || {};
    this.name = templateData.name || '';
    this.errorCustom = templateData.errorCustom;
    if (this.form.sector) {
      this.getSectors()
    }
  }
}
