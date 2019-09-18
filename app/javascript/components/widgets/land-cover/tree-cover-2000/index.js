import treeCover from 'components/widgets/land-cover/tree-cover';

export default {
  ...treeCover,
  widget: 'treeCover2000',
  datasets: [
    // tree cover
    {
      dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
      layers: ['c05c32fd-289c-4b20-8d73-dc2458234e04']
    }
  ],
  visible: ['analysis'],
  settings: {
    threshold: 30,
    extentYear: 2000
  }
};
