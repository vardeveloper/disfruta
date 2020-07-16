import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import nprogress from 'nprogress';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/',
  routes: [
    {
      path: '/terminos-y-condiciones',
      name: 'tyc',
      component: () => import(/* webpackChunkName: "tyc" */ './views/TyC/index.vue')
    },
    {
      path: '/politicas-de-privacidad',
      name: 'politics',
      component: () => import(/* webpackChunkName: "politics" */ './views/PoliticsPrivacyd/index.vue')
    },
    {
      path: '/categoria/:slug-:id(\\d+)/:gift_slug-:gift_id(\\d+)',
      name: 'gift',
      component: () => import(/* webpackChunkName: "details" */ './views/Details/index.vue')
    },
    {
      path: '/evento-especial/:slug-:id(\\d+)/:gift_slug-:gift_id(\\d+)',
      name: 'special_event',
      component: () => import(/* webpackChunkName: "specialEvent" */ './views/SpecialEvent/index.vue')
    },
    {
      path: '/acerca-de',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About/index.vue')
    },
    {
      path: '/sugerencias',
      name: 'suggestion',
      component: () => import(/* webpackChunkName: "suggestion" */ './views/Suggestion/index.vue')
    },
    {
      path: '/categoria/:slug-:id(\\d+)/:gift_slug-:gift_id(\\d+)/checkout/([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})',
      name: 'checkout',
      component: () => import(/* webpackChunkName: "checkout" */ './views/Checkout/index.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login/index.vue')
    },
    {
      path: '/perfil',
      component: () => import(/* webpackChunkName: "profile" */ './views/Profile/index.vue'),
      children: [
        {
          path: '',
          component: () => import(/* webpackChunkName: "profileData" */ './components/ProfileData/index.vue')
        },
        {
          path: 'cupones-canjeados',
          name: 'checkouts',
          component: () => import(/* webpackChunkName: "profileCoupons" */ './components/ProfileCoupons/index.vue')
        },
        {
          path: 'galerias-de-fotos',
          name: 'galleries',
          component: () => import(/* webpackChunkName: "galleries" */ './components/Galleries/index.vue'),
        },
        {
          path: 'galerias-de-fotos/:slug(.*)-:id(\\d+)',
          name: 'photos',
          component: () => import(/* webpackChunkName: "galleryPhotos" */ './components/GalleryPhotos/index.vue')
        }
      ]
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "base" */ './components/Base/index.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import(/* webpackChunkName: "home" */ './views/Home/index.vue')
        },
        {
          path: 'categoria/:slug-:id(\\d+)',
          name: 'category-view',
          component: () => import(/* webpackChunkName: "category-view" */ './views/Category/index.vue')
        },
        {
          path: 'buscar',
          name: 'search',
          component: () => import(/* webpackChunkName: "search" */ './views/Search/index.vue')
        }
      ]
    }
  ]
});

router.beforeEach(function(to, from, next) {
  if (to.name) {
    nprogress.start();
  }
  store.dispatch({
    type: 'setNavigation',
    data: { to, from }
  });
  next();
});

router.afterEach(function() {
  nprogress.done();
});

export default router;
