export default {
  name: 'Modal',
  mounted: function() {
    const self = this;
    setTimeout(function() {
      self.$el.style.opacity = 1;
    }, 250);
    setTimeout(function() {
      self.$refs.main.style.opacity = 1;
    }, 500);
  }
}
