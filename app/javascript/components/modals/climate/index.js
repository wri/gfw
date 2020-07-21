import { connect } from 'react-redux';

import Component from './component';

const mapStateToProps = ({ location }) => ({
  open: location && location.query && !!location.query.gfwclimate,
});

export default connect(mapStateToProps)(Component);
