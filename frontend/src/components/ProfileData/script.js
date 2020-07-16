import Modal from '@/components/Modal/index';
import axios from 'axios'

export default {
  name: 'ProfileData',
  components: {
    Modal
  },
  data: function() {
    return {
      modalComponent: null,
      profileEditForm: false,
      isLoading: 0,
      isLoadingProfile: 0,
      error: null
    }
  },
  computed: {
    profile: function() {
      return this.$store.state.profile
    }
  },
  methods: {
    getData: function() {
      const self = this;

      if (
        self.$store.state.profile &&
        self.$store.state.profile.name1
      ) {
        return;
      }

      self.isLoading = 1;
      axios({
        url: '?xhr=1',
        method: 'GET',
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        }
      })
      .then(function(response) {
        const data = (response.data || {});
        self.isLoading = 0;

        if (data.profile) {
          self.$store.dispatch('setProfile', data.profile);
        }
        if (data.error) {
          self.error = data.error;
        }
      })
      .catch(function() {
        self.isLoading = 0;
        self.error = 'No se pudo obtener tus datos de perfil';
      });
    },
    getProfileData: function() {
      const self = this;
      self.isLoadingProfile = 1;
      axios({
        url: '/perfil/edit',
        method: 'GET',
        headers: {
          'x-requested-with': 'XMLHttpRequest'
        }
      })
      .then(function(response) {
        const data = response.data;
        self.isLoadingProfile = 0;
        if (data && data.ok) {
          if (data.email) {
            self.$store.dispatch('setProfileEmail', data.email);
          }
          if (data.phone) {
            self.$store.dispatch('setProfilePhone', data.phone);
          }
          self.handleOpenEditForm();
        }
      })
      .catch(function() {
        self.isLoadingProfile = 0;
      });
    },
    handleOpenEditForm: function() {
      this.profileEditForm = 1;

      if (!this.modalComponent) {
        this.modalComponent = function() {
          return import(/* webpackChunkName: "formProfileEditContact" */ '@/components/FormProfileEditContact/index.vue');
        };
      }
    },
    handleCloseEditForm: function() {
      this.profileEditForm = 0;
    }
  },
  created: function() {
    const data = (window.__template_data || {}).profile;
    if (data) {
      this.$store.dispatch('setProfile', data);
    }
    else {
      this.getData();
    }
  }
}
