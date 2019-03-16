import { connect } from 'react-redux';

import Biodiversity from './config/biodiversity';
import Commodities from './config/commodities';
import Climate from './config/climate';
import Water from './config/water';

import PageComponent from './component';

const contents = {
  biodiversity: Biodiversity,
  commodities: Commodities,
  climate: Climate,
  water: Water
};

const mapStateToProps = ({ location }, { sections }) => ({
  title: location.payload.tab || 'biodiversity',
  section:
    location && sections && sections[location.payload.tab || 'biodiversity'],
  topicData:
    (location && contents[location.payload.tab]) || contents.biodiversity,
  links: Object.values(sections)
    .filter(r => r.submenu)
    .map(r => ({ label: r.label, path: r.path })),
  location
});

export default connect(mapStateToProps)(PageComponent);
