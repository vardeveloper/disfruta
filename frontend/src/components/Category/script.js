import axios from 'axios'
import Coupon from '@/components/Coupon/index';
import Loader from '@/components/Loader';

export default {
  name: 'Category',
  props: [
    'slug',
    'id',
    'visible'
  ],
  components: {
    Coupon,
    Loader
  },
  data: function() {
    return {
      coupons: null,
      isBusy: 0
    }
  },
  watch: {
    visible: function() {
      if (!this.coupons) {
        this.getData();
      }
    },
    slug: function(value, last_value) {
      if (value !== last_value && this.visible) {
        this.coupons = null;
        this.getData();
      }
    }
  },
  methods: {
    getData: function(callback) {
      const self = this;
      self.isBusy = 1;
      self.coupons = null;
      self.$emit('beforeLoadData', { slug: self.slug, id: self.id });
      axios.get('/categoria/'+ self.slug +'-' + self.id + '?xhr=1', {
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        }
      })
      .then(function(response) {
        self.isBusy = 0;
        if (response && response.data) {
          self.coupons = response.data;
        }
        if (typeof callback === 'function') {
          callback();
        }
        self.$emit('loadedData', { slug: self.slug, id: self.id, data: self.coupons });
      })
      .catch(function(error) {
        self.isBusy = 0;
        if (error) {
          location.reload();
        }
      });
    }
  },
  created: function() {
    if (this.visible) {
      this.getData();
    }
  }
}
