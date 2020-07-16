import HeaderSimple from '@/components/HeaderSimple/index';
import Page from '@/components/Page/index';
import Footer from '@/components/Footer/index';
import Loader from '@/components/Loader';
import MixinPage from '@/mixins/Page';
import axios from 'axios';

const _data = (window.__template_data || {});

function importDetailEvent() {
  return import(/* webpackChunkName: "DetailEvent" */ '@/components/DetailEvent/index.vue');
}

function importDetailSpecialEvent() {
  return import(/* webpackChunkName: "DetailSpecialEvent" */ '@/components/DetailSpecialEvent/index.vue');
}

function importDetailGift() {
  return import(/* webpackChunkName: "DetailGift" */ '@/components/DetailGift/index.vue');
}

export default {
  name: 'Details',
  mixins: [MixinPage],
  components: {
    Page,
    HeaderSimple,
    Footer,
    Loader
  },
  data: function() {
    return {
      data: null,
      category: null,
      mainComponent: null,
      allowScrollNavigation: 0,
      backUrl: '',
      isBusy: 1
    }
  },
  computed: {
    value: function() {
      const data = this.data;
      var value = data.coupon_value;
      const coupon_type = data.coupon_type;

      if (value) {
        value = value
          .trim()
          .split(' ').join('')
          .split('dscto.').join('');
      }

      if (
        coupon_type === 'before_after' &&
        value.indexOf('|') !== -1
      ) {
        value = value.split('|')
      }

      return value;
    }
  },
  methods: {
    importDetailEvent: importDetailEvent,
    importDetailGift: importDetailGift,
    getData: function(callback) {
      const self = this;
      self.isBusy = 1;

      if (_data && _data.detail) {
        self.data = Object.assign({}, _data.detail.data || {});
        self.category = Object.assign({}, _data.detail.category || {});
        _data.detail = null;
        delete _data.detail;
        self.isBusy = 0;

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
        .then(function(response){
          self.isBusy = 0;
          if (response && response.data) {
            self.data = response.data.data;
            self.category = response.data.category;
          }
          if (typeof callback === 'function') {
            callback();
          }
        })
        .catch(function(error) {
          self.isBusy = 0;
          if (error) {
            location.reload();
          }
        });
      }
    },
    mainComponentMounted: function(component) {
      const self = this;
      const hash = location.hash.split('#')[1];
      const top = component.$el.offsetTop;
      let y = 0;

      if (hash === 'terminos-y-condiciones' && self.$refs.headerSimple && self.$refs.headerSimple.$el) {
        y = top - (self.$refs.headerSimple.$el.clientHeight || 0);
        self.$el.scrollTo(0, y);
      }
    }
  },
  mounted: function() {
    const self  = this;

    self.getData(function() {
      self.backUrl = '/categoria/' + 
        self.$route.params.slug + '-' + self.$route.params.id;

      if (self.data && self.data.type === 'event') {
        self.mainComponent = importDetailEvent;
      }
      if (self.data && self.data.type === 'gift') {
        self.mainComponent = importDetailSpecialEvent;
        self.backUrl = '/evento-especial/' +
          self.$route.params.slug + '-' + self.$route.params.id + '/' +
          self.data.special_event_slug + '-' + self.data.special_event_id;
      }
      if (self.data && self.data.type === 'coupon') {
        self.mainComponent = importDetailGift;
      }

      self.initPageScrollEvents();
    });
  }
}
