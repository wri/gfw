import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class WidgetCaution extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    caution: PropTypes.string,
  };

  isValidCaution() {
    const { caution, type } = this.props;
    return type && caution?.applyFor && caution?.applyFor.indexOf(type) > -1;
  }

  render() {
    const { caution } = this.props;
    if (this.isValidCaution()) {
      return <div className="c-widget-caution">{caution.text}</div>;
    }

    return null;
  }
}

export default WidgetCaution;
