import Page from '@/components/Page/index';
import HeaderSimple from '@/components/HeaderSimple/index';
import Footer from '@/components/Footer/index';

export default {
  name: 'Profile',
  components: {
    Page,
    HeaderSimple,
    Footer
  },
  computed: {
    premium: function() {
      const currentUser = this.$store.state.currentUser;
      if (currentUser && currentUser.premium) {
        return true;
      }
      return false;
    }
  }
}
