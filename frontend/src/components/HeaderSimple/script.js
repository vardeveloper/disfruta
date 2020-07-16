export default {
  name: 'HeaderSimple',
  props: [
    'hs_name',
    'backUrl',
    'noNav',
    'icon_class'
  ],
  methods: {
    backToUrl: function() {
      if (this.backUrl) {
        this.$router.push({
          path: this.backUrl
        });
      }
      else {
        this.$router.go(-1);
      }
    }
  }
}
