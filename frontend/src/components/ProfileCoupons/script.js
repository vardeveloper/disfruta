import axios from 'axios';
import Coupon from '@/components/Coupon/index';

export default {
  name: 'ProfileCoupons',
  components: {
    Coupon
  },
  data: function() {
    return {
      isBusy: 0,
      data: null
    };
  },
  methods: {
    getData: function() {
      const self = this;
      self.isBusy = 1;
      axios({
        url: '?xhr=1',
        method: 'get',
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        }
      })
        .then(function(response) {
          const data = (response.data || {}).data;

          if (data && data.length) {
            self.data = data;
          } else {
            self.data = null;
          }
          self.isBusy = 0;
        })
        .catch(function() {
          self.isBusy = 0;
          self.data = null;
        });
    },
    formatDate: function(value) {
      let str = value.split('/');
      const d = new Date(str[2], parseInt(str[1] - 1, 10), str[0]);

      if (d instanceof Date && !isNaN(d)) {
        return (
          {
            '0': 'Domingo',
            '1': 'Lunes',
            '2': 'Martes',
            '3': 'Miércoles',
            '4': 'Jueves',
            '5': 'Viernes',
            '6': 'Sábado'
          }[d.getDay()] +
          ', ' +
          d.getDate() +
          ' de ' +
          {
            '0': 'Enero',
            '1': 'Febrero',
            '2': 'Marzo',
            '3': 'Abril',
            '4': 'Mayo',
            '5': 'Junio',
            '6': 'Julio',
            '7': 'Agosto',
            '8': 'Setiembre',
            '9': 'Octubre',
            '10': 'Noviembre',
            '11': 'Diciembre'
          }[d.getMonth()] +
          ' de ' +
          d.getFullYear()
        );
      }

      return value;
    }
  },
  created: function() {
    const data = (window.__template_data || {}).couponsHistory || null;
    if (data) {
      this.data = data;
    } else {
      this.getData();
    }
  }
};
