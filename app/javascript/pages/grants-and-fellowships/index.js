import { connect } from 'react-redux';

import PageComponent from './component';

const mapStateToProps = ({ location }) => ({
  section: location.section
})

export default connect(mapStateToProps)(PageComponent);
