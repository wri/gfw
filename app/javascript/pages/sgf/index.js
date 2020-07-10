import { connect } from 'react-redux';

import PageComponent from './component';

const mapStateToProps = ({ location }) => ({
  section: location?.payload?.section,
});

export default connect(mapStateToProps)(PageComponent);
