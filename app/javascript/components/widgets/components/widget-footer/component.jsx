import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Statement from 'components/statement';

import './styles.scss';

class WidgetFooter extends PureComponent {
  render() {
    const { statement, onHover, widget, config } = this.props;
    return statement ? (
      <div className="c-widget-footer">
        {statement}
        {config.statementConfig && <p className="driver-separator">|</p>}
        {config.statementConfig && (
          <Statement
            className="loss-driver-statement"
            {...config.statementConfig}
            handleMouseOver={() => onHover(true, widget)}
            handleMouseOut={() => onHover(false, widget)}
          />
        )}
      </div>
    ) : null;
  }
}

WidgetFooter.propTypes = {
  statement: PropTypes.string,
  onHover: PropTypes.func,
  widget: PropTypes.string,
  config: PropTypes.object
};

export default WidgetFooter;
