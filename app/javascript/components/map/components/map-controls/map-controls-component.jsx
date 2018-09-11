import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import Sticky from 'react-stickynode';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import './map-controls-styles.scss';

class MapControls extends PureComponent {
  render() {
    const {
      handleZoomIn,
      handleZoomOut,
      className,
      stickyOptions
    } = this.props;
    return (
      <div className={`c-map-controls-old ${className || ''}`}>
        <Sticky enabled={false} {...stickyOptions}>
          <Button theme="theme-button-map-control" onClick={handleZoomIn}>
            <Icon icon={plusIcon} className="plus-icon" />
          </Button>
          <Button theme="theme-button-map-control" onClick={handleZoomOut}>
            <Icon icon={minusIcon} className="minus-icon" />
          </Button>
        </Sticky>
      </div>
    );
  }
}

MapControls.propTypes = {
  className: Proptypes.string,
  handleZoomIn: Proptypes.func,
  handleZoomOut: Proptypes.func,
  stickyOptions: Proptypes.object
};

export default MapControls;
