export default {
  name: 'FormRadio',
  props: {
    id: {
      default: '',
      type: String
    },
    name: {
      default: '',
      type: String
    },
    value: {
      default: ''
    },
    checked: {
      default: false
    },
    label: {
      default: '',
      type: String
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
  model: {
    prop: 'checked',
    event: 'input'
  },
  methods: {
    check: function() {},
  },
  created: function() {
    if (this.value) {
      this.value_ = 1;
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
