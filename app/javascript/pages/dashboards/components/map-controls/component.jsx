import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { track } from 'app/analytics';
import Sticky from 'react-stickynode';
import { SCREEN_MOBILE } from 'utils/constants';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import './styles.scss';

class MapControlsButtons extends PureComponent {
  renderZoomButtons = () => {
    const { viewport: { zoom }, setMapSettings, maxZoom, minZoom } = this.props;

    return (
      <Fragment>
        <Button
          theme="theme-button-map-control"
          onClick={() => {
            setMapSettings({ zoom: zoom + 1 > maxZoom ? maxZoom : zoom + 1 });
            track('zoomIn');
          }}
          tooltip={{ text: 'Zoom in' }}
          disabled={zoom >= maxZoom}
        >
          <Icon icon={plusIcon} className="plus-icon" />
        </Button>
        <Button
          theme="theme-button-map-control"
          onClick={() => {
            setMapSettings({ zoom: zoom - 1 < minZoom ? minZoom : zoom - 1 });
            track('zoomOut');
          }}
          tooltip={{ text: 'Zoom out' }}
          disabled={zoom <= minZoom}
        >
          <Icon icon={minusIcon} className="minus-icon" />
        </Button>
      </Fragment>
    );
  };

  render() {
    const { className } = this.props;

    return (
      <div className={`c-dashboard-map-controls ${className || ''}`}>
        <Sticky top={window.innerWidth >= SCREEN_MOBILE ? 15 : 73}>
          {this.renderZoomButtons()}
        </Sticky>
      </div>
    );
  }
}

MapControlsButtons.propTypes = {
  className: PropTypes.string,
  setMapSettings: PropTypes.func,
  viewport: PropTypes.object,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number
};

export default connect()(MapControlsButtons);
