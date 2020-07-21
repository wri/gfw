import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = ({ location }) => ({
  open: location && location.query && !!location.query.gfwfires,
  location,
});

export default connect(mapStateToProps)(Component);
