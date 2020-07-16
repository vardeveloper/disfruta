import { stringToDate } from '@/utils/formatStringDate';

export default {
  name: 'CheckoutFinishCoupon',
  data: function() {
    return {
      is_archive: 0,
      id: null,
      name: null,
      store_name: null,
      store_img: null,
      coupon_value: null,
      coupon_type: null,
      slug: null,
      img: null,
      code: null,
      category_slug: null,
      category_id: null,

      timeout: null,
      enddate: null,
      countInterval: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  },
  computed: {
    value: function() {
      var value = this.coupon_value;
      if (value) {
        value = value
          .trim()
          .split(' ').join('')
          .split('dscto.').join('');
      }

      if (
        this.coupon_type === 'before_after' &&
        value.indexOf('|') !== -1
      ) {
        value = value.split('|')
      }

      return value;
    },
  },
  methods: {
    countDown: function() {
      const now = new Date().getTime();
      const end = this.enddate.getTime();
      let diff = end - now;
      if (diff < 0) { diff = 0; }
      this.renderCountDown(diff);
    },
    renderCountDown: function(dist) {
      this.days = Math.floor(dist / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((dist % (1000 * 60)) / 1000);
    },
    formatDateTime: function(s) {
      var d = stringToDate(s);
      if (d === s) { return false; }
      return d;
    }
  },
  created: function() {
    const data = (window.__template_data || {}).data || {};
    this.is_archive = (data.is_archive)? 1 : 0;
    this.id = data.id;
    this.name = data.name;
    this.store_name = data.store_name;
    this.store_img = data.store_img;
    this.coupon_type = data.coupon_type;
    this.coupon_value = data.coupon_value;
    this.slug = data.slug;
    this.img = data.img;
    this.code = data.code;
    this.enddate = this.formatDateTime(data.dateTimeLimit);
    this.category_slug = data.category_slug;
    this.category_id = data.category_id;
    if (
      this.enddate &&
      typeof this.enddate.getTime === 'function' &&
      this.enddate.getTime() > Date.now()
    ) {
      this.timeout = false;
    }
    else {
      this.timeout = true;
    }
    const self = this;
    setTimeout(function() {
      try { 
        gtag('event', 'coupon_exchange', {
          'event_category' : self.category_slug
        });
      }
      catch(e) { console.log(e); } 
    }, 1000);
  },
  mounted: function() {
    const self = this;
    if (this.enddate && this.timeout === false) {
      self.countDown();
      self.countInterval = setInterval(function() {
        self.countDown();
      }, 1000);
    }
  }
}
