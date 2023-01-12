import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Markdown from 'marked-react';

import Icon from 'components/ui/icon';
import warningIcon from 'assets/icons/warning-nofill.svg?sprite';

import './styles.scss';

class WidgetCaution extends PureComponent {
  static propTypes = {
    caution: PropTypes.object,
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
    const {
      caution: { text, link, linkText, isCaution, color = '#97be32' },
    } = this.props;
    // TODO: To be removed when all old cautions are removed
    if (this.isVisible() && linkText && isCaution) {
      const htmlTextArray = text && linkText && text.split(`{${linkText}}`);
      return (
        <div className="c-widget-caution">
          {htmlTextArray[0]}
          <a
            className="caution-link"
            rel="noopener noreferrer"
            href={link}
            target="_blank"
          >
            {linkText}
          </a>
          {htmlTextArray[1]}
        </div>
      );
    }
    // TODO: To be removed when all old cautions are removed
    if (this.isVisible() && isCaution) {
      return (
        <div
          className="c-widget-caution"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
    }
    if (this.isVisible()) {
      return (
        <div className="c-widget-alert" style={{ borderColor: color }}>
          <div className="icon" style={{ fill: color }}>
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

export default WidgetCaution;
