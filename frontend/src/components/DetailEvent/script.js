import Maps from '@/components/Maps/index';
import { formatDate, formatDateTime } from '@/utils/formatStringDate';

export default {
  name: 'DetailEvent',
  props: [
    'data',
    'category'
  ],
  computed: {
    locations: function() {
      if (this.data.lat && this.data.lng) {
        return [{
          lat: this.data.lat,
          lng: this.data.lng
        }];
      }

      return null;
    }
  },
  components: {
    Maps
  },
  methods: {
    formatDate: function(s) { return formatDate(s); },
    formatDateTime: function(s) { return formatDateTime(s); }
  },
  mounted: function() {
    this.$emit('mounted', this);
  }
}
