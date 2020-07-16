import ScrollSpeed from '@/utils/scrollspeed';

export default {
  data: function() {
    return {
      stickClass: '',
      timeoutHandleScroll: 0
    }
  },
  mounted: function() {
    const self = this;
    self.scrollSpeed = new ScrollSpeed();
    self.wheelSpeed = new ScrollSpeed();
  },
  methods: {
    initPageScrollEvents: function() {
      this.$el.addEventListener('scroll', this.handleScroll);
    },
    endPageScrollEvents: function() {
      this.$el.removeEventListener('scroll', this.handleScroll);
    },
    handleScroll: function() {
      const self = this;
      const scrollTop = self.$el.scrollTop;
      const speed = self.scrollSpeed.get(scrollTop);
      clearTimeout(self.timeoutHandleScroll);
      self.timeoutHandleScroll = setTimeout(function() {
        if (speed < -10 || scrollTop < 100) {
          self.stickClass = '';
        }
        else if (speed >= 0 && scrollTop > 100) {
          self.stickClass = 'page-stick-header';
        }

        if (self.allowScrollNavigation) {
          if (scrollTop === 0) {
            self.isScrollTop = 1;
          }
          else {
            self.isScrollTop = 0;
          }
        }
      }, 50);
    }
  }
}
