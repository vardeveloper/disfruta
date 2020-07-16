export default {
  name: 'FormCheckbox',
  props: {
    id: {
      default: '',
      type: String
    },
    name: {
      default: '',
      type: String
    },
    type: {
      default: 'checkbox',
      type: String
    },
    value: {
      default: ''
    },
    label: {
      default: '',
      type: String
    },
    errors: {
      default: function() {
        return [];
      },
      type: Array
    },
    attrs: {
      default: function() {
        return {}
      },
      type: Object
    },
    styleLabel: {
      default: '',
      type: String
    }
  },
  data: function() {
    return {
      value_: null
    }
  },
  methods: {
    updated: function(e) {
      this.value_ = e.target.checked;
      this.$emit('input', this.value_);
    }
  },
  created: function() {
    if (this.value) {
      this.value_  = 1;
    }
  },
  mounted: function() {
    let i;

    if (!this.$refs.input) {
      this.$refs.input = this.$el.querySelector('.field-input > input');
    }

    if (this.$refs.input && this.$refs.input.checked) {
      this.updated({
        target: this.$refs.input
      });
    }

    if (this.attrs) {
      for (i in this.attrs) {
        this.$refs.input.setAttribute(i, this.attrs[i]);
      }
    }
  }
}
