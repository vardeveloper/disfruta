export default class ScrollSpeed {
  constructor(config) {
    config = config || {};
    const self = this;
    this.timer = 0;
    this.delta = 0;
    this.last_delta = 0;
    this.delay = config.delay || 50;

    function clearDelta() {
      self.delta = 0;
      self.last_delta = 0;
    }

    this.clearDelta = clearDelta;
  }

  get(top) {
    if (this.last_delta) {
      this.delta = top - this.last_delta;
    }
    this.last_delta = top;
    clearTimeout(this.timer);
    this.timer = setTimeout(this.clearDelta, this.delay);
    return this.delta;
  }
}

