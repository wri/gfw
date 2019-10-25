import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import downloadIcon from 'assets/icons/download.svg';

import './styles.scss';

class WidgetDownloadButton extends PureComponent {
  static propTypes = {
    square: PropTypes.bool,
    downloadLink: PropTypes.func.isRequired
  };

  render() {
    const { downloadLink, square } = this.props;
    return (
      <Button
        className="c-widget-download-button"
        theme={cx('theme-button-small square', {
          'theme-button-grey-filled theme-button-xsmall': square
        })}
        extLink={downloadLink}
        tooltip={{ text: 'Download the data' }}
      >
        <Icon icon={downloadIcon} className="download-icon" />
      </Button>
    );
  }
}

export default WidgetDownloadButton;
