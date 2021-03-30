import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class WidgetCaution extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    caution: PropTypes.string,
    analysis: PropTypes.bool,
  };

  isVisible() {
    const {
      caution: { visible },
      analysis,
    } = this.props;
    if (visible?.length === 2) return true;
    if (analysis && visible && visible.indexOf('analysis') === -1) return false;
    if (!analysis && visible && visible.indexOf('dashboard') === -1)
      return false;
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
