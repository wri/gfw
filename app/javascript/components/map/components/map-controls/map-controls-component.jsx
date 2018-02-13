import React, { PureComponent } from 'react';

import Button from 'components/button';
import Icon from 'components/icon';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import './map-controls-styles.scss';

class MapControls extends PureComponent {
  render() {
    return (
      <div className="c-map-controls">
        <div className="c-map-controls__zoom">
          <Button theme="theme-button-map-control">
            <Icon icon={plusIcon} className="plus-icon" />
          </Button>
          <Button theme="theme-button-map-control">
            <Icon icon={minusIcon} className="minus-icon" />
          </Button>
        </div>
      </div>
    );
  }
}

export default MapControls;
