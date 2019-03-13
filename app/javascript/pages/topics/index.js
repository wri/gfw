import { connect } from 'react-redux';

import Biodiversity from 'pages/topics/content/biodiversity.json';
import Commodities from 'pages/topics/content/commodities.json';
import Climate from 'pages/topics/content/climate.json';
import Water from 'pages/topics/content/water.json';

import PageComponent from './component';

const contents = {
  biodiversity: Biodiversity,
  commodities: Commodities,
  climate: Climate,
  water: Water
};

const mapStateToProps = ({ location }, { sections }) => ({
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
