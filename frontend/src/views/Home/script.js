import Page from '@/components/Page/index';
import BaseHeader from '@/components/BaseHeader/index';
import Footer from '@/components/Footer/index';
import Banner from '@/components/Banner/index';
import MixinPageScroll from '@/mixins/PageScroll';
import ScrollBooster from 'scrollbooster';
import Category from '@/components/Category/index';
import ScrollRanges from '@/utils/scrollranges';
import smoothscroll from 'smoothscroll-polyfill';

smoothscroll.polyfill();

export default {
  name: 'Home',
  mixins: [MixinPageScroll],
  data: function() {
    return {
      partnerLogosLoadLength: 0,
      scroll_ranges: null,
      page_class: null,
      sections: [],
      autoScrollOnLoadCategory: '',
      scroll_category_slug: null,
      scroll_category_name: null,
    };
  },
  components: {
    Page,
    BaseHeader,
    Banner,
    Category,
    Footer
  },
  watch: {
    clickItemSidebarMenu: function() {
      this.autoScroll();
    }
  },
  computed: {
    clickItemSidebarMenu: function() {
      return this.$store.state.clickItemSidebarMenu;
    },
    banner: function() {
      return this.$store.state.homeBanner;
    },
    partnerLogos: function() {
      return this.$store.state.homeLogos || [];
    },
    partnerLogosLength: function() {
      return this.partnerLogos.length;
    }
  },
  methods: {
    partnerLoad: function() {
      ++this.partnerLogosLoadLength;
      if (this.partnerLogosLoadLength >= this.partnerLogosLength) {
        this.showPartnerLogos();
      }
    },
    showPartnerLogos: function() {
      const $viewport = this.$el.querySelector('#home-partner-company');
      const $content = this.$el.querySelector('#home-partner-company-track');
      const $partnerLogos = this.$el.querySelectorAll('.slide-track-img');
      let index = 0;
      let length = this.partnerLogosLength;
      let timeout = 100;
      let slide_track_width = 0;

      for (; index < length; ++index) {
        slide_track_width += $partnerLogos[index].offsetWidth + 100;
      }

      $content.style.width = slide_track_width + 'px';

      index = 0;

      for (; index < length; ++index) {
        setTimeout(
          (function(el) {
            return function() {
              el.style.opacity = 1;
            };
          })($partnerLogos[index]),
          timeout * index
        );
      }

      new ScrollBooster({
        viewport: $viewport,
        content: $content,
        onUpdate: function(data) {
          if (slide_track_width > $viewport.offsetWidth) {
            $content.style.transform = `translateX(${-data.position.x}px)`;
          }
        }
      });
    },
    parseLocation: function() {
      const url = location.pathname
        .split('/categoria/')
        .join('')
        .split('-');
      let id = parseInt(url.pop(), 10);
      let slug = url.join('-');
      return {
        id: id,
        slug: slug
      };
    },
    clickItemMenu: function() {
      this.autoScroll();
    },
    autoScroll: function(config) {
      const self = this;
      config = config || {};
      const current_section = config.section || {
        slug: location.hash.split('#').join('')
      };
      const $current_section = self.$el.querySelector(
        '.section-' + current_section.slug
      );

      if (current_section.slug && $current_section) {
        if (config.behavior === 'auto') {
          self.$el.scrollTop = $current_section.offsetTop;
        } else {
          self.$el.scroll({
            top: $current_section.offsetTop,
            behavior: 'smooth'
          });
        }
      }
    },
    scrollToAnimated: function(scrollTopValue) {
      const self = this;
      let startScrollTop = (self.$el.scrollTop - scrollTopValue) / 2;
      let scrollCount = 0;
      let oldTimestamp = window.performance.now();

      function step(newTimestamp) {
        let tsDiff = newTimestamp - oldTimestamp;

        if (tsDiff > 100) {
          tsDiff = 30;
        }

        scrollCount += Math.PI / (500 / tsDiff);

        if (scrollCount >= Math.PI) {
          return;
        }

        let moveStep = Math.round(
          scrollTopValue +
            startScrollTop +
            startScrollTop * Math.cos(scrollCount)
        );
        self.$el.scrollTo = moveStep;
        oldTimestamp = newTimestamp;
        window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    },
    setVisibleSection: function(slug, callback) {
      const self = this;
      let i = 0;
      let l = self.sections.length;
      let item = {};
      for (; i < l; ++i) {
        item = self.sections[i];

        if (item.slug === slug) {
          self.sections[i].visible = 1;

          // show next
          if (
            i < l - 1 &&
            self.sections[i + 1] &&
            self.sections[i + 1].slug &&
            self.sections[i + 1].visible !== 1
          ) {
            self.sections[i + 1].visible = 1;
          }

          // show prev
          if (
            i > 0 &&
            self.sections[i - 1] &&
            self.sections[i - 1].slug &&
            self.sections[i - 1].visible !== 1
          ) {
            self.sections[i - 1].visible = 1;
          }

          if (typeof callback === 'function') {
            callback();
          }
          break;
        }
      }
    },
    createSections: function() {
      const self = this;
      let menu = self.$store.state.menu;
      let i = 0;
      let l = menu.length;
      let item = {};
      let result = [];
      for (; i < l; ++i) {
        item = menu[i];
        result.push({
          slug: item.slug,
          id: item.id,
          visible: 0
        });
      }
      return result;
    },
    handlerIconScroll: function() {
      this.autoScroll({ section: this.sections[0] });
    },
    loadedDataCategory: function(section) {
      const self = this;
      setTimeout(function() {
        self.scroll_ranges.getScrollRanges(self.sections);

        setTimeout(function() {
          if (
            self.autoScrollOnLoadCategory &&
            section &&
            section.slug &&
            section.slug === self.autoScrollOnLoadCategory
          ) {
            self.autoScroll({
              behavior: 'auto',
              section: {
                slug: section.slug
              }
            });
            setTimeout(function() {
              self.autoScrollOnLoadCategory = '';
            }, 500);
          }
        }, 1000);
      }, 250);
    }
  },
  created: function() {
    const self = this;
    let last_slug = '';

    self.sections = self.createSections();

    self.$store.dispatch({
      type: 'setCurrentMenu'
    });

    self.$store.dispatch({
      type: 'getHomeBannersAndLogos'
    });

    self.scroll_ranges = new ScrollRanges();
    self.scroll_ranges.useCustomHeaderClasToSectionDataConfig = function(
      section
    ) {
      if (self.autoScrollOnLoadCategory) {
        self.page_class = 'page-section-' + self.autoScrollOnLoadCategory;
        self.scroll_category_slug = self.autoScrollOnLoadCategory || null;
        if (self.scroll_category_slug) {
          self.scroll_category_name = (self.$store.state.menu_index[self.scroll_category_slug] || {}).name || null;
        }
        return;
      }

      if (section && section.slug) {
        self.page_class = 'page-section-' + section.slug;
        self.scroll_category_slug = section.slug;
        self.scroll_category_name = (self.$store.state.menu_index[self.scroll_category_slug] || {}).name;
      } else {
        self.page_class = '';
        self.scroll_category_slug = null;
        self.scroll_category_name = null;
      }

      if (section && section.slug !== 'home' && section.slug !== last_slug) {
        location.hash = section.slug;
        last_slug = section.slug;
        self.setVisibleSection(section.slug);
      } else if (section && section.slug === 'home') {
        self.$router.push({
          path: '/'
        });
      }
    };
  },
  mounted: function() {
    const self = this;
    self.initPageScrollEvents();
    self.scroll_ranges.setPage(self.$el);
    self.scroll_ranges.getScrollRanges(self.sections);

    self.$el.addEventListener('scroll', function(e) {
      self.scroll_ranges.onScroll(e);
    });

    window.addEventListener('resize', function() {
      self.scroll_ranges.getScrollRanges(self.sections);
    });

    const l = self.sections.length;
    const slug = location.hash.split('#').join('');
    let i = 0;
    let item = {};

    if (slug) {
      for (; i < l; ++i) {
        item = self.sections[i];
        if (item && item.slug) {
          item.visible = 1;
        }

        if (item.slug === slug) {
          // visible al siguiente
          if (
            i < l - 1 &&
            self.sections[i + 1].slug &&
            self.sections[i + 1].visible !== 1
          ) {
            self.sections[i + 1].visible = 1;
          }

          self.autoScrollOnLoadCategory = slug;
          break;
        }
      }
    }
    else if (self.sections && self.sections.length > 0) {
      self.sections[0].visible = 1;
    }
  }
};
