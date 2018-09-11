import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class WidgetFooter extends PureComponent {
  render() {
    const { statement } = this.props;

    return statement ? (
      <div className="c-widget-footer">{statement}</div>
    ) : null;
  }
}

WidgetFooter.propTypes = {
  statement: PropTypes.string
};

export default WidgetFooter;
