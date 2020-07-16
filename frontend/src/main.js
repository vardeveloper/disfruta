import Vue from 'vue'
import App from '@/components/App/index'
import router from '@/router'
import store from '@/store'
import Vue2TouchEvents from 'vue2-touch-events'

const templateData = window.__template_data;

store.commit('setMenu', templateData.menu || []);
store.commit('setHandler', templateData.handler || {});
store.commit('setCurrentUser', templateData.currentUser);

Vue.config.productionTip = false

Vue.use(Vue2TouchEvents);

Vue.mixin({
  computed: {
    handler: function() {
      return this.$store.state.handler;
    }
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

location
	if (location.search.indexOf('login') != -1) { 
		try { 
			gtag('event', 'login_success');
		}
		catch(e) {} 
	}