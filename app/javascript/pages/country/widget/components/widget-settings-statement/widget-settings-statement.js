import { connect } from 'react-redux';

import { getStatement } from './widget-settings-statement-selectors';
import Component from './widget-settings-statement-component';

const mapStateToProps = (state, ownProps) => {
  const { settings } = ownProps;
  const selectorData = { settings };
  return {
    statement: getStatement(selectorData)
  };
};

export default connect(mapStateToProps)(Component);
