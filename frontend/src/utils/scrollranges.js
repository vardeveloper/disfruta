export default class ScrollRanges {
  constructor(navbar) {
    this.ranges = [];
    this.sections = [];
    this.scroll_timeout_id = 0;
    this.navBar = navbar;
    this.last_data = [];
    this.section_data_attribute = 'data-header_class';
    this.section_query = '.section-item';
    this.regular_screen_height = 0;
  }

  setPage(page) {
    this.page = page;
  }

  getScrollRanges(sections) {
    this.sections = [{slug: 'home'}].concat(sections);
    this.ranges = [];
    var section = {};
    var i = 0;
    var l = this.sections.length;

    for (; i < l; ++i) {
      section = this.page.querySelector('.section-' + this.sections[i].slug);
      if (section) {
        this.ranges.push(section.offsetTop);
      }
    }

    this.regular_screen_height = window.innerHeight * 0.9;
  }
  
  indexOfClosest(nums, target) {
    let i = 0;
    let l = nums.length;
    let n = 0;
    let index = -1;

    for(; i < l; ++i) {
      n = nums[i];
      if (n <= target) {
        index = i;
      }
      else {
        break;
      }
    }

    return index;
  }
  
  onScroll(e) {
    const self = this;
    clearTimeout(this.scroll_timeout_id);
    this.scroll_timeout_id = setTimeout(function() {
      const top = e.target.scrollTop + self.regular_screen_height;
      let index = self.indexOfClosest(self.ranges, top);
      if (typeof self.useCustomHeaderClasToSectionDataConfig === 'function') {
        self.useCustomHeaderClasToSectionDataConfig(
          self.sections[index]
        );
      }
    }, 1);
  }
}
