import Page from '@/components/Page/index';
import HeaderSimple from '@/components/HeaderSimple/index';
import MixinPage from '@/mixins/Page';
import Coupon from '@/components/Coupon/index';
import Footer from '@/components/Footer/index'
import axios from 'axios'

const _data = (window.__template_data || {}).data;

export default {
  name: 'SpecialEvent',
  mixins: [MixinPage],
  components: {
    Page,
    HeaderSimple,
    Coupon,
    Footer
  },
  data: function() {
    return {
      data: null,
      category: null,
      event: null
    }
  },
  methods: {
    parseData: function(data) {
      let result = [];
      let group = {};
      let item = {};
      const length = data.length;
      let index = 0;
      let last_store_name = '';

      for (; index < length; ++index) {
        item = data[index];
        if (item.store_name !== last_store_name) {
          last_store_name = item.store_name;
          group = {
            name: item.store_name,
            img: item.store_img,
            items: []
          };
          result.push(group);
        }

        group.items.push(item);
      }

      return result;
    },
    getData: function(callback) {
      const self = this;
      if (_data && _data.category && _data.data) {
        self.data = self.parseData(_data.data);
        self.category = Object.assign({}, _data.category);
        self.event = Object.assign({}, _data.special_event);
        _data.data = null;
        _data.category = null;
        delete _data.data;
        delete _data.category;

        if (typeof callback === 'function') {
          callback();
        }
      }
      else {
        axios.get('?xhr=' + new Date().getTime(), {
          headers: {
            'x-requested-with': 'XMLHttpRequest'
          }
        })
        .then(function(response) {
          if (response && response.data) {
            self.data = self.parseData(response.data.data);
            self.category = response.data.category;
            self.event = response.data.special_event;
          }
          if (typeof callback === 'function') {
            callback();
          }
        })
        .catch(function(error) {
          if (error) {
            location.reload();
          }
        });
      }
    }
  },
  mounted: function() {
    const self = this;
    self.getData(function() {
      self.initPageScrollEvents();
    });
  }
}
