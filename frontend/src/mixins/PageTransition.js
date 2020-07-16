import TweenLite from 'gsap/TweenMax';
const speed = 0.8;

export default {
  methods: {
    createOverlay: function(slug) {
      const content = document.createElement('div');
      content.classList.add('page-next-overlay-' + slug);
      content.style.width = '100%';
      content.style.height = '0%';
      content.style.position = 'fixed';
      content.style.left = 0;
      content.style.zIndex = 100;
      return content;
    },
    pageBeforeEnterTransition: function(slug, callback) {
      const self = this;
      const $el = self.$el;
      const $pageOverlay = self.createOverlay(slug || '');
      $pageOverlay.style.bottom = 0;

      $el.appendChild($pageOverlay);

      TweenLite.to(
        $pageOverlay, speed, {
          height: '100%',
          onComplete: function() {
            self.$el.scrollTop = 0;

            if (typeof callback === 'function') {
              callback($pageOverlay);
            }
          }
        }
      );
    },
    pageAfterEnterTransition: function(callback) {
      const self = this;
      const $el = self.$el;
      let $wrap = $el.querySelector('.page-wrap');
      let $header = $el.querySelector('.page-header');
      let $main = $el.querySelector('.page-main-inner');

      $header.style.position = 'absolute';
      $wrap.style.position = 'fixed';
      $wrap.style.top = '100%';
      $main.style.opacity = 0;

      TweenLite.to(
        $wrap, speed, {
          top: 0,
          delay: .1,
          onStart: function() {
            $wrap.style.zIndex = 200;
            // TODO: No debe ocultar la cabecera en la transicion
            //if (!$el.classList.contains('page-stick-header')) {
              //$el.classList.add('page-stick-header');
            //}
          },
          onComplete: function() {
            if (typeof callback === 'function') {
              callback();
            }
            $header.removeAttribute('style');
            $wrap.removeAttribute('style');

            TweenLite.to(
              $main, speed, {
                opacity: 1,
                delay: .2
              }
            );
          }
        }
      );
    },
    pageEnterTransition: function(slug, next) {
      const self = this;
      const $el = self.$el;

      self.pageBeforeEnterTransition(slug, function($pageOverlay) {
        if (typeof next === 'function') {
          next();
        }

        self.pageAfterEnterTransition(function() {
          if ($el && typeof $el.removeChild) {
            $el.removeChild($pageOverlay);
          }
        });
      });
    },
    pageBeforeEnterTopTransition: function(slug, callback) {
      const self = this;
      const $el = self.$el;
      const $pageOverlay = self.createOverlay(slug || '');
      $pageOverlay.style.top = 0;

      $el.appendChild($pageOverlay);

      TweenLite.to(
        $pageOverlay, speed, {
          height: '100%',
          onComplete: function() {
            self.$el.scrollTop = 0;

            if (typeof callback === 'function') {
              callback($pageOverlay);
            }
          }
        }
      );
    },
    pageAfterEnterTopTransition: function(callback) {
      const self = this;
      const $el = self.$el;
      let $wrap = $el.querySelector('.page-wrap');
      let $header = $el.querySelector('.page-header');
      let $main = $el.querySelector('.page-main-inner');

      $header.style.position = 'absolute';
      $wrap.style.position = 'fixed';
      $wrap.style.top = '-' + $wrap.clientHeight + 'px';
      $wrap.style.height = window.innerHeight + 'px';
      $wrap.style.overflow = 'hidden';
      $main.style.opacity = 0;

      TweenLite.to(
        $wrap, speed, {
          top: 0,
          delay: .1,
          onStart: function() {
            $wrap.style.zIndex = 200;
            // TODO: No debe ocultar la cabecera en la transicion
            //if (!$el.classList.contains('page-stick-header')) {
              //$el.classList.add('page-stick-header');
            //}
          },
          onComplete: function() {
            if (typeof callback === 'function') {
              callback();
            }
            $header.removeAttribute('style');
            $wrap.removeAttribute('style');

            TweenLite.to(
              $main, speed, {
                opacity: 1,
                delay: .2
              }
            );
          }
        }
      );
    },
    pageEnterTopTransition: function(slug, next) {
      const self = this;
      const $el = self.$el;

      self.pageBeforeEnterTopTransition(slug, function($pageOverlay) {
        if (typeof next === 'function') {
          next();
        }

        self.pageAfterEnterTopTransition(function() {
          if ($el && typeof $el.removeChild) {
            $el.removeChild($pageOverlay);
          }
        });
      });
    }
  }
}
