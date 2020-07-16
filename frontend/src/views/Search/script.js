import Page from '@/components/Page/index';
import BaseHeader from '@/components/BaseHeader/index';
import Footer from '@/components/Footer/index'
import MixinPage from '@/mixins/Page';
import Coupon from '@/components/Coupon/index';
import Loader from '@/components/Loader';
import axios from 'axios'

const _data = window.__template_data;

export default {
  name: 'Search',
  mixins: [MixinPage],
  components: {
    Page,
    BaseHeader,
    Footer,
    Coupon,
    Loader
  },
  data: function() {
    return {
      query: {},
      isBusy: 1,
      allowScrollNavigation: 0,
      results: null
    }
  },
  watch: {
    '$route': 'search'
  },
  methods: {
    getData: function(callback) {
      const self = this;
      self.isBusy = 1;
      if (_data && _data.searchResults) {
        self.results = [].concat( _data.searchResults || []);
        _data.searchResults = null;
        delete _data.searchResults;
        self.isBusy = 0;

        if (typeof callback === 'function') {
          callback();
        }
      }
      else {
        axios.get('?q='+ self.$route.query.q +'&xhr=' + new Date().getTime(), {
          headers: {
            'x-requested-with': 'XMLHttpRequest'
          }
        })
        .then(function(response) {
          self.isBusy = 0;
          if (response && response.data) {
            self.results = [].concat(response.data.data || []);
          }
          if (typeof callback === 'function') {
            callback();
          }
        })
        .catch(function() {
          self.isBusy = 0;
          if (typeof callback === 'function') {
            callback();
          }
        });
      }
    },
    parseQueryString: function() {
      let query = location.search.split('?').join('').split('&');
      let result = {};
      let index = 0;
      let length = query.length;
      let item = [];

      for (; index < length; ++index) {
        item = query[index].split('=');
        result[item[0]] = item[1];
      }

      return result;
    },
    search: function() {
      this.query = this.$route.query;
      this.getData();
    }
  },
  mounted: function() {
    const self = this;
    self.query = self.parseQueryString();
    self.getData(function() {
      self.initPageScrollEvents();
    });
  }
}
