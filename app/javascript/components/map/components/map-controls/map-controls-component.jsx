import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';

import Button from 'components/button';
import Icon from 'components/icon';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import './map-controls-styles.scss';

class MapControls extends PureComponent {
  render() {
    const { handleZoomIn, handleZoomOut } = this.props;
    return (
      <div className="c-map-controls">
        <Button theme="theme-button-map-control" onClick={handleZoomIn}>
          <Icon icon={plusIcon} className="plus-icon" />
        </Button>
        <Button theme="theme-button-map-control" onClick={handleZoomOut}>
          <Icon icon={minusIcon} className="minus-icon" />
        </Button>
      </div>
    );
  }
}

MapControls.propTypes = {
  handleZoomIn: Proptypes.func,
  handleZoomOut: Proptypes.func
};

export default MapControls;
