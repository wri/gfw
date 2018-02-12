import ForestCover from './forest-cover';

const OPTIONS = {
  threshold: 30,
  dataMaxZoom: 12,
  urlTemplate:
    'https://storage.googleapis.com/wri-public/treecover/2010/{threshold}/{z}/{x}/{y}.png'
};

class ForestCover2010 extends ForestCover {
  constructor(map, options) {
    super(map, options);
    this.options = { ...OPTIONS, ...options };
    this.threshold = this.options.threshold;
  }
}

export default ForestCover2010;
