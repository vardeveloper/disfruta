import LogoDisfruta from '@/components/LogoDisfruta.vue'

export default {
  name: 'BaseSidebar',
  components: {
    LogoDisfruta
  },
  computed: {
    menu: function() {
      return this.$store.state.menu;
    }
  },
  methods: {
    handleMenu: function() {
      this.$store.dispatch('setToggleSidebarActive');
    },
    handleClickItemMenu: function() {
      this.$store.dispatch('setClickItemSidebarMenu', 1);
      this.$emit('clickItemMenu');
    }
  }
}
