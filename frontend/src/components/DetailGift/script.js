import Maps from '@/components/Maps/index';

export default {
  name: 'DetailGift',
  props: [
    'data',
    'category'
  ],
  components: {
    Maps
  },
  computed: {
    terms_and_conditions: function() {
      const terms_and_conditions = this.data.terms_and_conditions;
      if (!terms_and_conditions || terms_and_conditions.length === 0) {
        return '';
      }
      return (terms_and_conditions || '').split('|');
    }
  },
  mounted: function() {
    this.$emit('mounted', this);
  }
}
