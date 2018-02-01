import ImageLayer from './abstract/imageLayer';

const OPTIONS = {
  dataMaxZoom: 12,
  urlTemplate:
    'http://earthengine.google.org/static/hansen_2013/gain_alpha/{z}/{x}/{y}.png'
};

class ForestGain extends ImageLayer {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
  }
}

export default ForestGain;
