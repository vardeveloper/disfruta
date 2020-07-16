export default {
  name: 'Coupon',
  props: [
    'nolink',
    'exlink',
    'href',
    'name',
    'type',
    'coupon_type',
    'coupon_value',
    'excerpt',
    'highlight',
    'id',
    'slug',
    'store_name',
    'store_img',
    'img',
    'cname',
    'category_slug',
    'category_id'
  ],
  data: function() {
    return {
      imgLoaded: 0
    }
  },
  computed: {
    value: function() {
      var value = this.coupon_value;
      if (value) {
        value = value
          .trim()
          .split(' ').join('')
          .split('dscto.').join('');
      }

      if (
        this.coupon_type === 'before_after' &&
        value.indexOf('|') !== -1
      ) {
        value = value.split('|')
      }

      return value;
    },
    store: function() {
      if (!this.store_name) {
        return '';
      }

      return this.store_name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/&/g, '')         // Replace & with 'and'
      .replace(/[^\w-]+/g, '')       // Remove all non-word chars
      .replace(/--+/g, '-');        // Replace multiple - with single -
    }
  },
  methods: {
    onImgLoad: function() {
      const self = this;
      setTimeout(function() {
        self.imgLoaded = 1;
      }, 250);
    }
  }
};
