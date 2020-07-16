import BaseSidebar from '@/components/BaseSidebar/index.vue'
import PageTransition from '@/mixins/PageTransition'

const page = Object.assign({}, PageTransition.methods);

export default {
  name: 'Base',
  components: {
    BaseSidebar
  },
  data: function() {
    return {
      $currentPageHeader: {},
      $currentPageWrap: {},
      move_x: 0
    };
  },
  computed: {
    sidebarActive: function() {
      return this.$store.state.sidebarActive;
    }
  },
  methods: {
    touchStartContent: function(event) {
      let diff = 0;
      let start = 0;
      let move = 0;
      let move_x = 0;

      if (!this.sidebarActive) { return; }

      if (event.type === 'touchstart') {
        this.left = this.$refs.content.offsetLeft || 0;
        this.start_move_x = event.targetTouches[0].clientX;
        this.start_move = 0;
        this.timestamp = new Date().getTime();
      }
      else if (event.type === 'touchmove') {
        start = this.start_move_x;
        move = event.targetTouches[0].clientX;

        diff = Math.abs( Math.abs(move) - Math.abs(start));

        // izquierda
        if (move < start) {
          move_x = this.left - diff;
        }
        // derecha
        else if (move > start) {
          move_x = this.left + diff;
        }

        if (move_x < 1) { move_x = 0.1; }
        else if (move_x > 250) { move_x = 250; }

        this.move_x = move_x;
        this.$store.dispatch('setMainLeft', this.move_x);
      }
      else if (event.type === 'touchend') {
        move_x = this.move_x;
        start = this.start_move_x;
        diff = Math.abs( Math.abs(move_x) - Math.abs(start));
        this.start_move_x = 0;
        this.move_x = 0;
        this.$store.dispatch('setMainLeft', this.move_x);

        if (move_x > start && diff > 100) {
          this.$store.dispatch('openSidebar');
        }
        else if (move_x !== 0 && move_x < start && diff > 100) {
          this.$store.dispatch('closeSidebar');
        }
      }
    },
    handleMenu: function() {
      this.$store.dispatch('setToggleSidebarActive');
    },
    beforeEnter: function(el) {
      const nav = this.$store.state.navigation;
      const isPageCalledAction = (this.$store.state.isNextPageCalled);
      let $main = el.querySelector('.page-main-inner');

      if (isPageCalledAction && nav.to.name !== 'category' && $main && $main.style) {
        $main.style.opacity = 0;
      }
    },
    enter: function(el, done) {
      const nav = this.$store.state.navigation;
      const isPageCalledAction = (this.$store.state.isNextPageCalled);
      let $main = el.querySelector('.page-main-inner');

      if (!isPageCalledAction) {
        done();
        return;
      }

      if (
        nav.to.name === 'home' &&
        nav.from.name === 'category'
      ) {
        page.$el = el;
        page.pageAfterEnterTopTransition(function() {
          done();
        });
      }
      else if (
        nav.to.name === 'category' &&
        nav.from.name === 'home'
      ) {
        page.$el = el;
        page.$overlay = page.createOverlay(nav.to.params.slug);
        page.$overlay.style.height = '100%';
        page.$overlay.style.top = '0';
        page.$el.appendChild(page.$overlay);

        page.pageAfterEnterTransition(function() {
          page.$el.removeChild(page.$overlay);
          done();
        });
      }
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
      const nav = this.$store.state.navigation;
      const isPageCalledAction = (this.$store.state.isNextPageCalled);

      if (!isPageCalledAction) {
        done();
        return;
      }

      if (
        nav.to.name === 'home' &&
        nav.from.name == 'category'
      ) {
        page.$el = el;
        page.pageBeforeEnterTopTransition('home', function() {
          done();
        });
      }
      else if (
        nav.to.name === 'category' &&
        nav.from.name == 'home'
      ) {
        page.$el = el;
        page.pageBeforeEnterTransition(nav.to.params.slug, function() {
          done();
        });
      }
      else {
        done();
      }
    }
  }
}
