import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'marked-react';

import Icon from 'components/ui/icon';
import warningIcon from 'assets/icons/warning-nofill.svg?sprite';

import './styles.scss';

class WidgetAlert extends PureComponent {
  static propTypes = {
    alert: PropTypes.object,
    locationType: PropTypes.string,
  };

  isVisible() {
    const {
      alert: { visible },
      locationType,
    } = this.props;
    if (visible && locationType && visible.includes(locationType)) return true;
    return false;
  }

  render() {
    const {
      alert: { text, color },
    } = this.props;

    const parsedColor = color && color.length ? color : '#97be32';

    if (this.isVisible()) {
      return (
        <div className="c-widget-alert" style={{ borderColor: parsedColor }}>
          <div className="icon" style={{ fill: parsedColor }}>
            <Icon icon={warningIcon} />
          </div>
          <div className="text">
            <Markdown openLinksInNewTab>{text}</Markdown>
          </div>
        </div>
      );
    }

    return null;
  }
}

export default WidgetAlert;
