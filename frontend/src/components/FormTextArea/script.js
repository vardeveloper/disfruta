export default {
  name: 'FormTextArea',
  props: {
    'id': {
      default: '',
      type: String
    },
    'name': {
      default: '',
      type: String
    },
    'type': {
      default: 'text',
      type: String
    },
    'label': {
      default: '',
      type: String
    },
    'open': {
      default: 0,
      type: Number
    },
    'value': {
      default: '',
      type: String
    },
    'errors': {
      default: function() {
        return []
      },
      type: Array
    },
    'attrs': {
      default: function() {
        return {}
      },
      type: Object
    }
  },
  data: function() {
    return {
      isOpen: 0,
      value_: null
    }
  },
  watch: {
    open: function(value) {
      this.isOpen = value;
    },
    value: function(v) {
      if (v) {
        this.isOpen = 1;
      }
      else {
        this.isOpen = 0;
      }
    }
  },
  methods: {
    handleFocus: function(event) {
      const type = event.type;
      const target = event.target;

      if (
        type === 'focusout' && (target && !target.value)
      ) {
        this.isOpen = 0;
      }
      else if (
        type === 'focusin' && !this.isOpen
      ) {
        this.isOpen = 1;
      }
    },
    updated: function(e) {
      this.value_ = e.target.value;
      this.$emit('input', this.value_);
    }
  },
  created: function() {
    this.value_ = this.value;
    if (this.value_) {
      this.isOpen = 1;
    }
  },
  mounted: function() {
    let i;

    if (!this.$refs.input) {
      this.$refs.input = this.$el.querySelector('.field-input > input') || this.$el.querySelector('.field-input > select');
    }

    if (this.$refs.input && this.$refs.input.value) {
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
};
