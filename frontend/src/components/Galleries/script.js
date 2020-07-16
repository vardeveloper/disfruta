import axios from 'axios'
import Coupon from '@/components/Coupon/index';

export default {
  name: 'Galleries',
  components: {
    Coupon
  },
  data: function() {
    return {
      isBusy: 1,
      data: null
    };
  },
  methods: {
    getData: function() {
      const self = this;
      self.isBusy = 1;
      axios({
        url: '?xhr=1',
        method: 'get',
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        }
      })
      .then(function(response) {
        const data = (response.data || {}).galleries;

        if (data && data.length) {
          self.data = data;
        }
        else {
          self.data = null;
        }
        self.isBusy = 0;
      })
      .catch(function() {
        self.isBusy = 0;
        self.data = null;
      });
    }
  },
  created: function() {
    const data = (window.__template_data || {}).galleries || null;
    if (data) {
      this.data = data;
    }
    else {
      this.getData();
    }
  }
}
