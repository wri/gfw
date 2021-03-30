import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class WidgetCaution extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    caution: PropTypes.string,
    locationType: PropTypes.string,
  };

  isVisible() {
    const {
      caution: { visible },
      locationType,
    } = this.props;
    console.log('locationType', locationType);
    return; // locationType = 'aoi' etc
    if (visible?.length === 2) return true;
    if (analysis && visible && !visible.includes('analysis')) return false;
    if (!analysis && visible && !visible.includes('dashboard')) return false;
    return true;
  }

  isValidCaution() {
    const { caution, type } = this.props;
    return (
      this.isVisible() &&
      type &&
      caution?.applyFor &&
      caution?.applyFor.indexOf(type) > -1
    );
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
