import { connect } from 'react-redux';

import Biodiversity from './config/biodiversity';
import Commodities from './config/commodities';
import Climate from './config/climate';
import Water from './config/water';
import Fires from './config/fires';

import PageComponent from './component';

const contents = {
  biodiversity: Biodiversity,
  commodities: Commodities,
  climate: Climate,
  water: Water,
  fires: Fires
};

const sections = {
  biodiversity: {
    label: 'Biodiversity',
    component: 'biodiversity',
    path: '/topics/biodiversity',
  },
  climate: {
    label: 'Climate',
    component: 'climate',
    path: '/topics/climate',
  },
  commodities: {
    label: 'Commodities',
    component: 'commodities',
    path: '/topics/commodities',
  },
  water: {
    label: 'Water',
    component: 'water',
    path: '/topics/water',
  },
  fires: {
    label: 'Fires',
    component: 'fires',
    path: '/topics/water',
  },
};

const mapStateToProps = ({ location }) => ({
  title: location?.topic || 'biodiversity',
  section: sections && sections[location?.topic || 'biodiversity'],
  topicData: contents[location?.topic] || contents.biodiversity,
  links: sections
    ? Object.values(sections).map((r) => ({
        label: r.label,
        href: '/topics/[topic]',
        as: `/topics/${r.component}`,
        activeShallow: !location?.topic && r.component === 'biodiversity',
      }))
    : [],
});

export default connect(mapStateToProps)(PageComponent);
