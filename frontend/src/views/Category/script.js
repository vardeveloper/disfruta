import Page from '@/components/Page/index';
import BaseHeader from '@/components/BaseHeader/index';
import Footer from '@/components/Footer/index';
import MixinPageScroll from '@/mixins/PageScroll';
import Category from '@/components/Category/index';
import Loader from '@/components/Loader';
import Banner from '@/components/Banner/index';

export default {
  name: 'CategoryView',
  mixins: [MixinPageScroll],
  components: {
    Banner,
    Page,
    BaseHeader,
    Category,
    Footer,
    Loader
  },
  data: function() {
    return {
      isBusy: 1,
      emptyMessage: 0,
      banner: null
    };
  },
  methods: {
    loadedDataCategory: function(category) {
      const self = this;

      if (!category || !category.data || category.data.length === 0) {
        self.emptyMessage = 1;
      }

      self.isBusy = 0;

      self.banner = category.data.banner_category;
    },
    beforeLoadData: function() {
      this.isBusy = 1;
      this.emptyMessage = 0;
    }
  },
  mounted: function() {
    const self = this;
    self.initPageScrollEvents();
  },
  created: function() {
    const self = this;
    const data = (window.__template_data || {});
    self.banner = data.banner_category;
  }
};
