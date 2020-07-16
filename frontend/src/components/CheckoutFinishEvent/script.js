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
      datetimeLimit: null
    };
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
  }
}
