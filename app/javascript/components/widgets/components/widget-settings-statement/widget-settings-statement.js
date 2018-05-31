import { connect } from 'react-redux';

import { getStatement } from './widget-settings-statement-selectors';
import Component from './widget-settings-statement-component';

const mapStateToProps = (state, ownProps) => ({
  statement: getStatement(ownProps)
});

export default connect(mapStateToProps)(Component);
