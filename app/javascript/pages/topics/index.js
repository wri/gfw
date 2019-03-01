import { connect } from 'react-redux';

import PageComponent from './component';

const mapStateToProps = ({ location }, { sections }) => ({
  section: location && sections[location.payload.tab || 'biodiversity'],
  links: Object.values(sections)
    .filter(r => r.submenu)
    .map(r => ({ label: r.label, path: r.path }))
});

export default connect(mapStateToProps)(PageComponent);
