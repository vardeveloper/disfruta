import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

const _data = window.__template_data;
const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

Vue.use(Vuex)

function parseMenuItem(item) {
  if (!item || item.length === 0) {
    return {
    };
  }

  return {
    id: item[0],
    name: item[1],
    slug: item[2]
  };
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    isIE11: isIE11,
    navigation: {},
    currentUser: null,
    profile: {
      email: null,
      phone: null,
      name1: null,
      name2: null,
      last_name1: null,
      last_name2: null
    },
    menu: [],
    menu_index: {},
    currentMenu: {},
    nextMenu: {},
    prevMenu: {},
    handler: {},
    sidebarActive: 0,
    homeBanner: {},
    homeLogos: [],
    isNextPageCalled: 0,
    isPrevPageCalled: 0,
    clickItemSidebarMenu: 0,
    main_left: 0
  },
  mutations: {
    setMenu: function(state, items) {
      var result = [];
      var result_index = {};
      const length = items.length;
      var index = 0;
      var item = {};

      for (; index < length; ++index) {
        item = parseMenuItem(items[index])
        result.push(item);
        result_index[item.slug] = {
          index: index,
          name: item.name
        };
      }

      state.menu = result;
      state.menu_index = result_index;
    },
    setCurrentMenu: function(state, id) {
      // find index in menu
      const length = state.menu.length;
      var item = [];
      var index = -1;

      if (!state.menu  || !state.menu.length) {
        return;
      }

      if (id) {
        for (; index < length; ++index) {
          item = state.menu[index];
          if (item && parseInt(item.id, 10) === parseInt(id, 10)) {
            break;
          }
        }
      }

      if (index !== -1) {
        state.currentMenu = state.menu[index];
        state.currentMenu.index = index;
      }
      else {
        state.currentMenu = {};
      }

      // set nextMenu
      if (index + 1 < length) {
        state.nextMenu = state.menu[index+1];
        state.nextMenu.index = index+1;
      }
      else {
        state.nextMenu = {};
      }

      // set prevMenu
      if (index - 1 >= 0) {
        state.prevMenu = state.menu[index-1];
        state.prevMenu.index = index-1;
      }
      else {
        state.prevMenu = {};
      }
    },
    setHandler: function(state, handler) {
      state.handler = Object.assign({}, handler);
    },
    setSidebarActive: function(state, data) {
      state.sidebarActive = data;
    },
    setHomeBanner: function(state, data) {
      state.homeBanner = Object.assign({}, data);
    },
    setHomeLogos: function(state, data) {
      state.homeLogos = data;
    },
    setCurrentUser: function(state, data) {
      if (data) {
        state.currentUser = Object.assign({}, data);
      }
    },
    setProfile: function(state, data) {
      state.profile = Object.assign({}, data);
    },
    setProfileEmail: function(state, data) {
      state.profile.email = data;
    },
    setProfilePhone: function(state, data) {
      state.profile.phone = data;
    },
    setNavigation: function(state, data) {
      state.navigation = data.data;
    },
    setIsNextPageCalled: function(state, data) {
      state.isNextPageCalled = data;
    },
    setIsPrevPageCalled: function(state, data) {
      state.isPrevPageCalled = data;
    },
    setClickItemSidebarMenu: function(state, data) {
      state.clickItemSidebarMenu = state.clickItemSidebarMenu + data;
    },
    setMainLeft: function(state, data) {
      state.main_left = data;
    }
  },
  actions: {
    getHomeBannersAndLogos: function({ commit }) {
      if (_data && (_data.banner || _data.logos)) {
        commit('setHomeBanner', _data.banner || {});
        commit('setHomeLogos', _data.logos || []);
        _data.banner = null;
        _data.logos = null;
        delete _data.banner;
        delete _data.logos;
      }

      else {
        axios.get('/?xhr=' + new Date().getTime(), {
          headers: {
            'x-requested-with': 'XMLHttpRequest'
          }
        })
        .then(function(response) {
          if (response && response.data) {
            commit('setHomeBanner', {
              img: response.data.img,
              description: response.data.description,
              link: response.data.link
            });
            commit('setHomeLogos', response.data.logos);
          }
        });
      }
    },
    setCurrentMenu: function({ commit }, data) {
      commit('setCurrentMenu', data.id);
    },
    closeSidebar: function({ commit }) {
      commit('setSidebarActive', 0);
    },
    openSidebar: function({ commit }) {
      commit('setSidebarActive', 1);
    },
    setToggleSidebarActive: function({ commit, state }) {
      if (state.sidebarActive) {
        commit('setSidebarActive', 0);
      }
      else {
        commit('setSidebarActive', 1);
      }
    },
    setCurrentUser: function({ commit }, data) {
      commit('setCurrentUser', data);
    },
    setProfile: function({ commit }, data) {
      commit('setProfile', data);
    },
    setProfileEmail: function({ commit }, data) {
      commit('setProfileEmail', data);
    },
    setProfilePhone: function({ commit }, data) {
      commit('setProfilePhone', data);
    },
    setNavigation: function({ commit }, data) {
      commit('setNavigation', data);
    },
    setIsNextPageCalled: function({ commit }, data) {
      commit('setIsNextPageCalled', data);
    },
    setIsPrevPageCalled: function({ commit }, data) {
      commit('setIsPrevPageCalled', data);
    },
    setClickItemSidebarMenu: function({ commit }, data) {
      commit('setClickItemSidebarMenu', data);
    },
    setMainLeft: function({ commit }, data) {
      commit('setMainLeft', data);
    }
  }
});
