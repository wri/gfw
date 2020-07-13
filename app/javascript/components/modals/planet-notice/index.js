import { connect } from 'react-redux';

import * as actions from './actions';
import Component from './component';

const mapStateToProps = ({ planetNotice }) => ({
  open: planetNotice?.open,
});

export default connect(mapStateToProps, actions)(Component);
