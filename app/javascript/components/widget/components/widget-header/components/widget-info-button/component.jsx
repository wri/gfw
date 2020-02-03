import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg';

class WidgetInfoButton extends PureComponent {
  static propTypes = {
    square: PropTypes.bool,
    handleOpenInfo: PropTypes.func.isRequired
  };

  render() {
    const { handleOpenInfo, square } = this.props;
    return (
      <Button
        className="c-widget-info-button"
        theme={cx('theme-button-small square', {
          'theme-button-grey-filled theme-button-xsmall': square
        })}
        onClick={handleOpenInfo}
        tooltip={{ text: 'Learn more about the data' }}
      >
        <Icon icon={infoIcon} />
      </Button>
    );
  }
}

export default WidgetInfoButton;
