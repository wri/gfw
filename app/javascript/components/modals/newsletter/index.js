import { connect } from 'react-redux';

import * as actions from './actions';
import Component from './component';

const mapStateToProps = ({ location }) => ({
  open: location && location.query && location.query.newsletter
});

export default connect(mapStateToProps, { ...actions })(Component);
