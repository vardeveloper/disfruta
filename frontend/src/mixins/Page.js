import ScrollSpeed from '@/utils/scrollspeed';

export default {
  data: function() {
    return {
      allowScrollNavigation: 0,
      isScrollBottom: 0,
      isNextPageCalled: 0,

      isScrollTop: 1,
      isPrevPageCalled: 0,
      scrollTopTimeout: 0,

      scrollBottomTimeout: 0,

      $wrap: {},
      $header: {}
    }
  },
  computed: {
    nextMenu: function(){
      const item = this.$store.state.nextMenu || {};
      if (item.id) {
        return item
      }

      return {};
    },
    prevMenu: function(){
      const item = this.$store.state.prevMenu || {};
      if (item.id) {
        return item
      }

      return {};
    },
    currentMenu: function(){
      const item = this.$store.state.currentMenu || {};
      if (item.id) {
        return item
      }

      return {};
    },
    nextPageUrl: function() {
      const item = this.nextMenu || {};
      if (item.id) {
        return {
          name: 'category',
          params: {
            slug: item.slug,
            id: item.id,
            index: item.index
          }
        }
      }

      return {
        name: '',
        params: {}
      };
    },
    prevPageUrl: function() {
      const item = this.prevMenu || {};
      if (item.id) {
        return {
          name: 'category',
          params: {
            slug: item.slug,
            id: item.id,
            index: item.index
          }
        }
      }

      return {
        name: 'home',
        params: {}
      };
    },
    getPageNextLoader: function() {
      return function() {
        return this.$el.querySelector('.page-next-loader-trigger');
      };
    }
  },
  methods: {
    resetScroll: function() {
      const self = this;
      this.$el.scrollTop = 0;

      this.isResetScroll = 1;

      this.isScrollBottom = 0;
      this.isNextPageCalled = 0;
      self.$store.dispatch('setIsNextPageCalled', 0);

      this.isScrollTop = 1;

      this.$el.classList.remove('page-state-bottom');

      self.isPrevPageCalled = 0;

      self.$store.dispatch('setIsPrevPageCalled', 0);
    },
    handleScrollTop: function(scrollTop) {
      const self = this;
      const $el = self.$el;
      const speed = self.scrollSpeed.get(scrollTop);

      if (speed < -10 || scrollTop < 100) {
        if ($el.classList.contains('page-stick-header')) {
          $el.classList.remove('page-stick-header');
        }
      }
      else if (speed > 0 && scrollTop > 100) {
        if (!$el.classList.contains('page-stick-header')) {
          $el.classList.add('page-stick-header');
        }
      }

      if (self.allowScrollNavigation) {
        if (scrollTop === 0) {
          self.isScrollTop = 1;
        }
        else {
          self.isScrollTop = 0;
        }
      }
    },
    handleScrollBottom: function(scrollTop) {
      const self = this;
      const $el = self.$el;
      let viewportScrollHeight = 0;
      let viewportHeight = 0;

      if (!self.isNextPageCalled) {
        viewportScrollHeight = self.$wrap.clientHeight;
        viewportHeight = $el.clientHeight;

        //self.configureIconScroll({
          //scrollTop: scrollTop,
          //viewportHeight: viewportHeight,
          //viewportScrollHeight: viewportScrollHeight
        //});

        if (self.allowScrollNavigation) {
          if (scrollTop + viewportHeight >= viewportScrollHeight) {
            self.isScrollBottom = 1;
            $el.classList.add('page-state-bottom');
          }

          else {
            self.isScrollBottom = 0;
            $el.classList.remove('page-state-bottom');
          }
        }
      }
    },
    handleScroll: function() {
      const self = this;
      const scrollTop = self.$el.scrollTop;

      clearTimeout(self.scrollTopTimeout);
      self.scrollTopTimeout = setTimeout(function() {
        self.handleScrollTop(scrollTop);
      }, 1);

      clearTimeout(self.scrollBottomTimeout);
      self.scrollBottomTimeout = setTimeout(function() {
        self.handleScrollBottom(scrollTop);
      }, 50);
    },
    handleWheel: function(e) {
      const self = this;
      const deltaY = e.deltaY;
      const speed = Math.abs(self.wheelSpeed.get(deltaY));

      if (speed > 20) {
        if (
          deltaY > 0 &&
          self.isScrollBottom &&
          !self.isNextPageCalled
        ) {
          self.isNextPageCalled = 1;
          self.$store.dispatch('setIsNextPageCalled', 1);
          self.handleNextPage();
        }

        else if (
          deltaY < 0 &&
          self.isScrollTop &&
          !self.isPrevPageCalled
        ) {
          self.isPrevPageCalled = 1;
          self.$store.dispatch('setIsPrevPageCalled', 1);
          self.handlePrevPage();
        }
      }
      else if (speed <= 1) {
        if (self.isPrevPageCalled) {
          self.isPrevPageCalled = 0;
          self.$store.dispatch('setIsPrevPageCalled', 0);
        }
      }
    },
    handleNextPage: function() {
      if (this.nextPageUrl && this.nextPageUrl.name) {
        this.$router.push({
          name: this.nextPageUrl.name,
          params: Object.assign({
          },this.nextPageUrl.params)
        });
      }
    },
    handlePrevPage: function() {
      if (this.prevPageUrl && this.prevPageUrl.name) {
        this.$router.push({
          name: this.prevPageUrl.name,
          params: Object.assign({
          },this.prevPageUrl.params)
        });
      }
    },
    pageTransitionPrev: function(to, next) {
      const self = this;
      self.endPageScrollEvents();

      setTimeout(function() {
        if (typeof self.pageEnterTopTransition === 'function') {
          self.pageEnterTopTransition(to.params.slug, function() {
            if (typeof next === 'function') {
              next();
            }

            self.resetScroll();
            setTimeout(function() {
              self.initPageScrollEvents();
            }, 100)
          })
        }
        else {
          if (typeof next === 'function') {
            next();
          }

          self.resetScroll();
          setTimeout(function() {
            self.initPageScrollEvents();
          }, 100);
        }
      }, 100);
    },
    pageTransitionNext: function(to, next) {
      const self = this;
      self.endPageScrollEvents();

      setTimeout(function() {
        if (typeof self.pageEnterTransition === 'function') {
          self.pageEnterTransition(to.params.slug, function() {
            next();

            self.resetScroll();
            setTimeout(function() {
              self.initPageScrollEvents();
            }, 100)
          });
        } else {
          next();

          self.resetScroll();
          setTimeout(function() {
            self.initPageScrollEvents();
          }, 100)
        }
      }, 100);
    },
    initPageScrollEvents: function() {
      this.$el.addEventListener('scroll', this.handleScroll);
      if (this.allowScrollNavigation) {
        this.$el.addEventListener('wheel', this.handleWheel);
      }
    },
    endPageScrollEvents: function() {
      this.$el.removeEventListener('scroll', this.handleScroll);
      if (this.allowScrollNavigation) {
        this.$el.removeEventListener('wheel', this.handleWheel);
      }
    },
    configureIconScroll: function(config) {
      config = config || {};
      const self = this;
      const $el = config.$el || self.$el;
      const scrollTop = config.scrollTop || $el.scrollTop;
      const viewportHeight = config.viewportHeight || $el.clientHeight;
      const viewportScrollHeight = config.viewportScrollHeight || self.$wrap.clientHeight;

      if (self.$iconScroll) {
        if (viewportScrollHeight - (viewportHeight + scrollTop) < 200) {
          if (!self.$iconScroll.classList.contains('icon-scroll-active')) {
            self.$iconScroll.classList.add('icon-scroll-active');
          }
        }
        else {
          self.$iconScroll.classList.remove('icon-scroll-active');
        }
      }
    }
  },
  updated: function() {
    this.configureIconScroll();
  },
  mounted: function() {
    const self = this;
    const $el = self.$el;
    self.$wrap = $el.querySelector('.page-wrap');
    self.$header = $el.querySelector('.page-header');
    self.$iconScroll = $el.querySelector('.icon-scroll');
    self.scrollSpeed = new ScrollSpeed();
    self.wheelSpeed = new ScrollSpeed();
  }
}
