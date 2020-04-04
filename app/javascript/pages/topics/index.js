import { connect } from 'react-redux';
import withRouter from 'utils/withRouter';

import Biodiversity from './config/biodiversity';
import Commodities from './config/commodities';
import Climate from './config/climate';
import Water from './config/water';

import PageComponent from './component';

const contents = {
  biodiversity: Biodiversity,
  commodities: Commodities,
  climate: Climate,
  water: Water,
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
};

const mapStateToProps = (state, { router }) => ({
  title: router?.query?.topic || 'biodiversity',
  section: sections && sections[router?.query?.topic || 'biodiversity'],
  topicData: contents[router?.query?.topic] || contents.biodiversity,
  links: sections
    ? Object.values(sections).map((r) => ({
        label: r.label,
        href: '/topics/[topic]',
        as: `/topics/${r.component}`,
        activeShallow: !router?.query?.topic && r.component === 'biodiversity',
      }))
    : [],
});

export default withRouter(connect(mapStateToProps)(PageComponent));
