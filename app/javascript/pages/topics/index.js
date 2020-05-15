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

const mapStateToProps = ({ location }, { sections }) => ({
  title: location.payload.type || 'biodiversity',
  section:
    location && sections && sections[location.payload.type || 'biodiversity'],
  topicData:
    (location && contents[location.payload.type]) || contents.biodiversity,
  links: sections
    ? Object.values(sections)
      .filter(r => r.submenu)
      .map(r => ({ label: r.label, path: r.path }))
    : [],
  location
});

export default connect(mapStateToProps)(PageComponent);
