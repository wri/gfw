import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

class WidgetCaution extends PureComponent {
  static propTypes = {
    caution: PropTypes.string,
    locationType: PropTypes.string,
  };

  isVisible() {
    const {
      caution: { visible },
      locationType,
    } = this.props;
    if (visible && locationType && visible.includes(locationType)) return true;
    return false;
  }

  render() {
    const { caution } = this.props;
    if (this.isVisible()) {
      return <div className="c-widget-caution">{caution.text}</div>;
    }

    return null;
  }
}

export default WidgetCaution;
