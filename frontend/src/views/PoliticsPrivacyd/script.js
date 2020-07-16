import Page from '@/components/Page/index';
import HeaderSimple from '@/components/HeaderSimple/index';
import Footer from '@/components/Footer/index'
import MixinPage from '@/mixins/Page';

export default {
  name: 'PoliticsPrivacyd',
  mixins: [MixinPage],
  components: {
    Page,
    HeaderSimple,
    Footer
  },
  data: function() {
    return {
      allowScrollNavigation: 0
    }
  },
  mounted: function() {
    this.initPageScrollEvents();
  }
}
