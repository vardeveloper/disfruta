export default {
  name: 'BaseHeader',
  props: ['category_slug', 'category_name'],
  data: function() {
    return {
      isOpen: 0,
      isSearched: 0,
      timeoutShowSearchInput: 0,
      searchValue: ''
    }
  },
  computed: {
    menu: function() {
      return this.$store.state.menu;
    }
  },
  methods: {
    handleMenu: function() {
      this.$store.dispatch('setToggleSidebarActive');
    },
    handleSearch: function() {
      const value = (this.$refs.searchInput || {}).value;

      if (this.isSearched) {
        this.isSearched = 0;
        this.searchValue = '';
      }

      else if (value) {
        this.isSearched = 1;
        this.searchValue = value;
        this.$router.push({
          name: 'search',
          query: {
            q: value
          }
        });
        this.$refs.searchInput.blur();
      }
    },
    handleKeydown: function(e) {
      if (e.keyCode === 13) {
        this.handleSearch();
      }
    },
    stopShowSearchInput: function() {
      clearInterval(this.timeoutShowSearchInput);

    },
    showSearchInput: function(event) {
      const self = this;

      if (event.type === 'focusin') {
        self.isOpen = 1;
        if (self.isSearched) {
          self.isSearched = 0;
          self.searchValue = '';
        }
      }
      else {
        this.stopShowSearchInput();
        this.timeoutShowSearchInput = setTimeout(function() {
          self.isOpen = 0;
        }, 250);
      }
    },
    parseQueryString: function() {
      let query = location.search.split('?').join('').split('&');
      let result = {};
      let index = 0;
      let length = query.length;
      let item = [];

      for (; index < length; ++index) {
        item = query[index].split('=');
        result[item[0]] = item[1];
      }

      return result;
    },
    handleClickItemMenu: function() {
      this.$emit('clickItemMenu');
    }
  },
  mounted: function() {
    const query = this.parseQueryString();
    if (query && query.q) {
      this.isSearched = 1;
      this.searchValue = query.q;
    }
  }
}
