import ImageLayer from './abstract/image-layer';

const OPTIONS = {
  dataMaxZoom: 12,
  urlTemplate:
    'https://earthengine.google.org/static/hansen_2013/gain_alpha/{z}/{x}/{y}.png'
};

class ForestGain extends ImageLayer {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
  }
}

export default ForestGain;
