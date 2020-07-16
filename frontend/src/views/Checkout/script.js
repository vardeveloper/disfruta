import PageLogin from '@/components/PageLogin/index';
import HeaderSimple from '@/components/HeaderSimple/index';
import Footer from '@/components/Footer/index';

const templateData = window.__template_data;

function importLogin() {
  return import(/* webpackChunkName: "formLogin" */ '@/components/FormLogin/index.vue');
}

function importProfileVerifyData() {
  return import(/* webpackChunkName: "formProfileVerifyData" */ '@/components/FormProfileVerifyData/index.vue');
}

function importDelivery() {
  return import(/* webpackChunkName: "formDelivery" */ '@/components/FormDelivery/index.vue');
}

function importFinishEvent() {
  return import(/* webpackChunkName: "checkoutFinishEvent" */ '@/components/CheckoutFinishEvent/index.vue');
}

function importFinishCoupon() {
  return import(/* webpackChunkName: "checkoutFinishCoupon" */ '@/components/CheckoutFinishCoupon/index.vue');
}

function importOutofstock() {
  return import(/* webpackChunkName: "outofstock" */ '@/components/CheckoutOutofstock/index.vue');
}

export default {
	name: 'Checkout',
  template: '#checkout',
	components:{
		PageLogin,
		HeaderSimple,
		Footer
  },
  data: function() {
    return {
      mainComponent: null,
      current_step: 0,
      total_steps: 0,
      formTitle: null,
      category: null
    }
  },
  methods: {
    handleCancelBtn: function() {
      this.$router.push({
        name: 'gift',
        params: this.$route.params
      });
    }
  },
  created: function() {
    const current_step = templateData.current_step || 0
    this.current_step = current_step;
    this.total_steps = templateData.total_steps || 0;

    this.formTitle = templateData.formTitle || null;
    this.category = templateData.category || null;

    if (current_step === 0) {
      this.mainComponent = importLogin;
    }
    else if (current_step === 1) {
      this.mainComponent = importProfileVerifyData;
    }
    else if (current_step === 2) {
      this.mainComponent = importDelivery;
    }
    else if (current_step === 3) {
      if (templateData.category && templateData.category[2] === 'experiencias') {
        this.mainComponent = importFinishEvent;
      }
      else {
        this.mainComponent = importFinishCoupon;
      }
    }
    else if (current_step === -1) {
      this.mainComponent = importOutofstock;
    }
  }
}
