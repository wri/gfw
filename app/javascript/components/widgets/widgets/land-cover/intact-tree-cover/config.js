export default {
  widget: 'intactTreeCover',
  title: {
    global: 'Global Intact forest',
    initial: 'Intact forest in {location}'
  },
  categories: ['land-cover'],
  types: ['global', 'country'],
  admins: ['global', 'adm0', 'adm1', 'adm2'],
  options: {
    landCategories: true,
    thresholds: true
  },
  colors: 'extent',
  metaKey: 'widget_ifl',
  datasets: [
    {
      // ifl
      dataset: '13e28550-3fc9-45ec-bb00-5a48a82b77e1',
      layers: ['fd44b976-62e6-4072-8218-8abf6e254ed8']
    },
    // tree cover 2010
    {
      dataset: '044f4af8-be72-4999-b7dd-13434fc4a394',
      layers: {
        2010: '78747ea1-34a9-4aa7-b099-bdb8948200f4',
        2000: 'c05c32fd-289c-4b20-8d73-dc2458234e04'
      }
    }
  ],
  sortOrder: {
    landCover: 3
  },
  sentences: {
    initial:
      'As of 2013, {percentage} of {location} tree cover was <b>intact forest</b>.',
    withIndicator:
      'As of 2013, {percentage} of {location} tree cover in {indicator} was <b>intact forest</b>.',
    noIntact:
      'As of 2013, <b>none</b> of {location} tree cover was <b>intact forest</b>.',
    noIntactwithIndicator:
      'As of 2013, <b>none</b> of {location} tree cover in {indicator} was <b>intact forest</b>.'
  }
};
