import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import infoIcon from 'assets/icons/info.svg?sprite';

class WidgetInfoButton extends PureComponent {
  static propTypes = {
    square: PropTypes.bool,
    handleOpenInfo: PropTypes.func.isRequired,
    widget: PropTypes.string,
  };

  render() {
    const { handleOpenInfo, square, widget } = this.props;
    return (
      <Button
        id={`widget-info-button-${widget}`}
        className="c-widget-info-button widget-info-button"
        theme={cx('theme-button-small square', {
          'theme-button-grey-filled theme-button-xsmall': square,
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
