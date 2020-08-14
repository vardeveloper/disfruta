import { formatDate, formatDateTime } from '@/utils/formatStringDate';

export default {
  name: 'CheckoutFinishEvent',
  data: function() {
    return {
      is_archive: 0,
      id: null,
      name: null,
      store_name: null,
      store_img: null,
      slug: null,
      img: null,
      code: null,
      datetimeLimit: null,
      events_place: null,
      events_income: null,
      events_start: null,
      events_day: null,
    };
  },
  methods: {
    formatDate: function(s) { return formatDate(s); },
    formatDateTime: function(s) { return formatDateTime(s); }
  },
  created: function() {
    const data = (window.__template_data || {}).data || {};
    this.is_archive = (data.is_archive)? 1 : 0;
    this.id = data.id;
    this.name = data.name;
    this.store_name = data.store_name;
    this.store_img = data.store_img;
    this.slug = data.slug;
    this.img = data.img;
    this.code = data.code;
    this.datetimeLimit = data.datetimeLimit;
    this.events_place = data.events_place;
    this.events_income = this.formatDateTime(data.events_income);
    this.events_start = this.formatDateTime(data.events_start);
    this.events_day = this.formatDate(data.events_income);
  }
}

