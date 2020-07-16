import Form from '@/components/Form/index';
import FormInput from '@/components/FormInput/index';
import FormCheckbox from '@/components/FormCheckbox/index';
import axios from 'axios'

const test_phone = /^9(\d){8}$/;
const test_email = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export default {
  name: 'FormProfileEditContact',
  components: {
    Form,
    FormInput,
    FormCheckbox
  },
  props: {
    submitLabel: {
      default: 'Actualizar'
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
      email: null,
      phone: null,
      term: null,
      errorsEmail: [],
      errorsPhone: [],
      errorsTerm: [],
      errorCustom: null
    };
  },
  watch: {
    email: function() {
      this.validEmail();
    },
    phone: function() {
      this.validPhone();
    },
    term: function() {
      this.validTerm();
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
    validTerm: function() {
      let errors = [];
      if (!this.term) {
        errors.push('Este campo es requerido');
      }
      this.errorsTerm = errors;
      return errors.length;
    },
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
    validate: function() {
      return this.validEmail() + this.validPhone() + this.validTerm();
    },
    handleSubmit: function(e) {
      const self = this;
      let data;
      e.preventDefault();
      if (self.validate() === 0) {
        if (self.allowNormalSubmit) {
          if (self.$refs.form && typeof self.$refs.form.submit === 'function') {
            self.$refs.form.submit();
          }
        }
        else {
          self.isFormBusy = 1;
          if (self.$refs.form && typeof self.$refs.form.submit === 'function') {
            data = new FormData();
            data.append('email', self.email);
            data.append('phone', self.phone);
            data.append('_xsrf', self.$store.state.handler.xsrf);
            data.append('accept_terms', true);
            axios({
              url: '/perfil/edit',
              method: 'post',
              data: data,
              headers: {
                'x-requested-with': 'XMLHttpRequest'
              }
            })
            .then(function(response) {
              const data = response.data;
              self.isFormBusy = 0;

              if (data && data.ok) {
                self.formSubmitSuccess = true;
                self.$store.dispatch('setProfileEmail', self.email);
                self.$store.dispatch('setProfilePhone', self.phone);
                try {
                  gtag('event', 'profile_update');
                }
                catch(e) {}
              }
              else {
                if (data.errors) {
                  self.errorCustom = data.errors.join('<br/>');
                }
                else {
                  self.errorCustom = 'Ocurri&oacute; un error inesperado. Por favor, vuelva a intentarlo';
                }
              }
            })
            .catch(function() {
              self.isFormBusy = 0;
              self.errorCustom = 'Ocurri&oacute; un error inesperado. Por favor, vuelva a intentarlo';
            });
          }
        }
      }
    },
    getProfileData: function() {
      const self = this;
      self.isFormBusy = 1;
      axios({
        url: '/perfil/edit',
        method: 'GET',
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        }
      })
      .then(function(response) {
        const data = response.data;
        self.isFormBusy = 0;
        if (data && data.ok) {
          if (data.email) {
            self.$store.dispatch('setProfileEmail', data.email);
            self.email = data.email;
          }
          if (data.phone) {
            self.$store.dispatch('setProfilePhone', data.phone);
            self.phone = data.phone;
          }
        }
      })
      .catch(function() {
        self.isFormBusy = 0;
      });
    }
  },
  created: function() {
    const profile = this.$store.state.profile;
    if (profile) {
      if (profile.email) {
        this.email = profile.email;
      }

      if (profile.phone) {
        this.phone = profile.phone;
      }
    }
  },

  mounted: function() {
    const self = this;
    if (self.requestProfileOnInit) {
      self.getProfileData();
    }
  }
}
