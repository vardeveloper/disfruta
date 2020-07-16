export default {
  name: 'Form',
  props: {
    action: {
      default: ''
    },
    method: {
      default: 'POST'
    },
    isFormBusy: {
      default: 0
    },
    submitSuccess: {
      default: false,
      type: Boolean
    }
  },
  data: function() {
    return {
      messageSuccess: null
    }
  },
  methods: {
    handleSubmit: function(e) {
      this.$emit('submit', e);
    },
    submit: function() {
      this.$refs.form.submit();
    }
  },
  mounted: function() {
    const fields = this.$el.querySelectorAll('form > *');
    const length = fields.length;
    let i = 0;
    let f = {};

    for (; i < length; ++i) {
      f = fields[i];
      if (f && f.style) {
        f.style.opacity = 0;
      }
    }

    i = 0;
    f = {};

    function fieldShow() {
      if (i < length) {
        f = fields[i];
        if (f && f.style) {
          f.style.opacity = 1;
        }
        ++i;
        setTimeout(fieldShow, 100);
      }
    }

    setTimeout(fieldShow, 250);
  }
}
