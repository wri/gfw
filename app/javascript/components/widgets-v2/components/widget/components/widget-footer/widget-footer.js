import { connect } from 'react-redux';

import { getStatement } from './selectors';
import Component from './component';

const mapStateToProps = (state, ownProps) => ({
  statement: getStatement(ownProps)
});

export default connect(mapStateToProps)(Component);
