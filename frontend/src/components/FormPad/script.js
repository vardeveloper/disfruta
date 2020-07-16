export default {
  name: 'FormPad',
  data: function() {
    return {
      keys: [
        1,2,3,4,5,6,7,8,9,0
      ]
    };
  },
  methods: {
    shuffle: function(a) {
      var j = 0;
      var i = a.length - 1;
      var x;
      for (; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
      }
      return a;
    },
    handleKey: function(event) {
      const target = event.target;
      if (target) {
        this.$emit(
          'clickKey', 
          target.getAttribute('type'),
        );
      }
    }
  },
  created: function() {
    this.keys = this.shuffle(this.keys);
  }
}
