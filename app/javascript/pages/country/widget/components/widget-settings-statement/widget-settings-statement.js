import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import { getStatement } from './widget-settings-statement-selectors';
import WidgetSettingsStatementComponent from './widget-settings-statement-component';

const mapStateToProps = (state, ownProps) => {
  const { settings } = ownProps;
  const selectorData = { settings };
  return {
    statement: getStatement(selectorData)
  };
};

class WidgetSettingsStatementContainer extends PureComponent {
  render() {
    return createElement(WidgetSettingsStatementComponent, {
      ...this.props
    });
  }
}

export default connect(mapStateToProps)(WidgetSettingsStatementContainer);
