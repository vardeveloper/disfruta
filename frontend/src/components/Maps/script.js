/* global google: true */

export default {
  name: 'Maps',
  props: [
    'pointers'
  ],
  data: function() {
    return {
      $map: {},
      gmap: null,
      markers: [],
      hideMap: 0
    }
  },
  watch: {
    pointers: function() {
      this.initMap();
      this.removeMarkers();
      this.addMarkers();
      this.centerMap();
    }
  },
  methods:{
    loadGoogleMapsApi: function() {
      return new Promise((resolve) => {
        if (window['GoogleMapsInit']) {
          resolve();
        }
        else {
          window['GoogleMapsInit'] = resolve;
          let GMap = document.createElement('script');
          GMap.setAttribute('src','https://maps.googleapis.com/maps/api/js?key=' + (window._gmap_key || '') + '&callback=GoogleMapsInit');
          document.body.appendChild(GMap); 
        }
      });
    },
    createMarker: function(position) {
      return new google.maps.Marker({
        position: position,
        map: this.gmap
      });
    },
    addMarkers: function() {
      let index = 0;
      let point = {};
      const length = (this.pointers || []).length;
      if (!this.gmap) {
        return;
      }
      for (; index < length; ++index) {
        point = this.pointers[index];
        if (point && point.lat && point.lng) {
          this.markers.push(this.createMarker(point));
        }
      }
    },
    removeMarkers: function() {
      let index = 0;
      let marker = {};
      const length = (this.markers || []).length;

      for (; index < length; ++index) {
        marker = this.markers[index];
        if (marker && typeof marker.setMap === 'function') {
          marker.setMap(null);
        }
      }
      this.markers = [];
    },
    centerMap: function() {
      const point = (this.pointers || [])[0];
      if (point && point.lat && point.lng && this.gmap) {
        this.gmap.setCenter(point);
      }
    },
    initMap: function () {
      if (
        this.pointers &&
        this.pointers.length && 
        this.pointers[0].lat &&
        this.pointers[0].lng &&
        !this.gamp
      ) {
        this.hideMap = 0;
        this.gmap = new google.maps.Map(this.$el, {
          zoom: 17,
          disableDefaultUI: true
        });
        this.centerMap();
        this.addMarkers();
      }
      else if (this.gmap) {
        this.hideMap = 1;
      }
    }
  },
  mounted: function() {
    const self = this;
    self.loadGoogleMapsApi().then(function() {
      self.initMap()
    });
  },
}
