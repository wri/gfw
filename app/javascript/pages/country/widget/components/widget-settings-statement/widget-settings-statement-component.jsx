import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './widget-settings-statement-styles.scss';

class WidgetSettingsStatement extends PureComponent {
  render() {
    const { statement } = this.props;

    return <div className="c-widget-settings-statement">{statement}</div>;
  }
}

WidgetSettingsStatement.propTypes = {
  statement: PropTypes.string
};

export default WidgetSettingsStatement;
