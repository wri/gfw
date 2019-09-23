import treeCover from 'components/widgets/land-cover/tree-cover';

export default {
  ...treeCover,
  widget: 'treeCover2010',
  datasets: [
    // tree cover
    {
      dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
      layers: ['78747ea1-34a9-4aa7-b099-bdb8948200f4']
    }
  ],
  visible: ['analysis'],
  settings: {
    threshold: 30,
    extentYear: 2010
  }
};
