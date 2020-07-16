export default {
  methods: {
    beforeEnter: function(el) {
      const nav = this.$store.state.navigation;
      let $main = el.querySelector('.page-main-inner');

      if (nav.to.name !== 'category' && $main && $main.style) {
        $main.style.opacity = 0;
      }
    },
    enter: function(el, done) {
      const nav = this.$store.state.navigation;
      let $main = el.querySelector('.page-main-inner');

      if (nav.to.name !== 'category' && $main && $main.style) {
        setTimeout(function() {
          $main.style.opacity = 1;
          done();
        }, 200);
      }
      else {
        done();
      }
    },
    leave: function(el, done) {
      done();
    }
  }
};
