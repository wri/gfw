import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { track } from 'app/analytics';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import mapIcon from 'assets/icons/map-button.svg';

import './styles.scss';

class WidgetMapButton extends PureComponent {
  static propTypes = {
    widget: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired
  };

  render() {
    const {
      widget,
      active,
      config,
      locationName,
      isDeviceTouch,
      setActiveWidget
    } = this.props;
    const isSmall = !config.large;

    return (
      <Button
        className={cx('map-button', { '-active': active })}
        theme={cx(
          'theme-button-small',
          { small: isSmall },
          { square: isDeviceTouch || isSmall }
        )}
        tooltip={{ text: active ? 'Currently displayed' : 'Show on map' }}
        onClick={() => {
          setActiveWidget(widget);
          track('viewWidgetOnMap', {
            label: `${widget} in ${locationName || ''}`
          });
        }}
      >
        {isSmall || isDeviceTouch ? (
          <Icon icon={mapIcon} className="map-icon" />
        ) : (
          'SHOW ON MAP'
        )}
      </Button>
    );
  }
}

export default WidgetMapButton;
