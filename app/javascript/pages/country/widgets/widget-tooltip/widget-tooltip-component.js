import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './widget-tooltip-styles.scss';

class WidgetTooltip extends PureComponent {
  render() {
    const { children, payload } = this.props;

    const childrenWithProps = React.Children.map(children, child =>
      React.cloneElement(child, { data: payload })
    );

    return <div className="c-widget-tooltip">{childrenWithProps}</div>;
  }
}

WidgetTooltip.propTypes = {
  children: PropTypes.object,
  payload: PropTypes.array
};

export default WidgetTooltip;
