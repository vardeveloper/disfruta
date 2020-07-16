import axios from 'axios'

export default {
  name: 'GalleryPhotos',
  data: function() {
    return {
      isBusy: 1,
      isFullscreen: 0,
      selected: null,
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
        const data = (response.data || {});

        if (data && data.event && data.photos.length) {
          self.data = {
            event: data.event,
            photos: data.photos
          };
        }
        else {
          self.data = null;
        }
        self.isBusy = 0;
      })
      .catch(function() {
        self.isBusy = 0;
        self.data = null;
      });
    },
    handlePhoto: function(index) {
      const self = this;
      if (!this.isFullscreen) {
        this.isFullscreen = 1;
        self.selected = index;
      }
    },
    handleClose: function() {
      if (this.isFullscreen) {
        this.selected = null;
        this.isFullscreen = 0;
      }
    },
    handleNext: function(index) {
      this.selected = index + 1;
    },
    handlePrev: function(index) {
      this.selected = index - 1;
    },
    handleDownload: function(url) {
      window.open(url);
    }
  },
  created: function() {
    const data = (window.__template_data || {}).photos || null;
    if (data) {
      this.data = data;
    }
    else {
      this.getData();
    }
  }
}
