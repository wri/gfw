import moment from 'moment';
import Canvas from './canvas';

const OPTIONS = {
  duration: 15000,
  currentOffset: 0
};

class AnimatedCanvas extends Canvas {
  constructor(map, options) {
    super(map, OPTIONS);
    this.options = { ...this.options, ...options };
    this.currentDate = this.options.currentDate || [
      moment.utc(this.options.mindate),
      this.options.maxdate
    ];
  }

  setupAnimation() {
    let startDate = this.currentDate[0];
    if (!moment.isMoment(startDate)) {
      startDate = moment.utc(startDate);
    }

    let endDate = this.currentDate[1];
    if (!moment.isMoment(endDate)) {
      endDate = moment.utc(endDate);
    }

    this.numberOfDays = Math.abs(startDate.diff(endDate)) / 1000 / 3600 / 24;
  }

  setDateRange(dates) {
    this.currentDate = dates;
    delete this.timelineExtent;
    this.setupAnimation();
    this.updateTiles();
  }

  setDate(date) {
    this.stop();
    this.presenter.animationStopped();

    const newDate = moment.utc(date);
    this.setOffsetFromDate(newDate);
    this.renderTime(newDate);
  }

  setOffsetFromDate(date) {
    const startDate = moment.utc(this.currentDate[0]);
    const daysFromStart = Math.abs(startDate.diff(date)) / 1000 / 3600 / 24;
    this.animationOptions.currentOffset =
      daysFromStart / this.numberOfDays * this.animationOptions.duration;
  }

  renderTime(time) {
    this.timelineExtent = [moment.utc(this.currentDate[0]), time];
    this.updateTiles();
  }

  start() {
    if (this.animationInterval !== undefined) {
      this.stop();
    }

    const startDate = moment.utc(this.currentDate[0]);
    const endDate = this.currentDate[1];
    let lastTimestamp = +new Date();

    const step = () => {
      const now = +new Date();
      const dt = now - lastTimestamp;
      this.animationOptions.currentOffset += dt;
      if (
        this.animationOptions.currentOffset === this.animationOptions.duration
      ) {
        this.animationOptions.currentOffset = 0;
      }

      const duration = this.animationOptions.duration;
      const currentOffset = this.animationOptions.currentOffset;
      const daysToAdd = currentOffset / duration * this.numberOfDays;
      const currentDate = startDate.clone().add('days', daysToAdd);

      if (daysToAdd >= this.numberOfDays) {
        this.renderTime(endDate);
        this.presenter.animationStopped();
        this.animationOptions.currentOffset = 0;
        return this.stop();
      }

      this.renderTime(currentDate);

      lastTimestamp = now;
      this.animationInterval = window.requestAnimationFrame(step);
    };

    step();
  }

  stop() {
    window.cancelAnimationFrame(this.animationInterval);
    delete this.animationInterval;
  }

  toggle() {
    if (this.animationInterval !== undefined) {
      this.stop();
    } else {
      this.start();
    }
  }
}

export default AnimatedCanvas;
