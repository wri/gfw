import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import mapIcon from 'assets/icons/map-button.svg?sprite';

import './styles.scss';

class WidgetMapButton extends PureComponent {
  static propTypes = {
    active: PropTypes.bool,
    handleShowMap: PropTypes.func.isRequired,
  };

  render() {
    const { active, handleShowMap } = this.props;

    return (
      <Button
        className={cx('c-widget-map-button', { '-active': active })}
        theme={cx('theme-button-small small square')}
        tooltip={{ text: active ? 'Currently displayed' : 'Show on map' }}
        onClick={handleShowMap}
      >
        <Icon icon={mapIcon} className="map-icon" />
      </Button>
    );
  }
}

export default WidgetMapButton;
