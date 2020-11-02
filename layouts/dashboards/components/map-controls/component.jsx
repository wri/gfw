import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { trackEvent } from 'utils/analytics';
import Sticky from 'react-stickynode';

import plusIcon from 'assets/icons/plus.svg?sprite';
import minusIcon from 'assets/icons/minus.svg?sprite';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import './styles.scss';

class MapControlsButtons extends PureComponent {
  renderZoomButtons = () => {
    const {
      viewport: { zoom },
      setMapSettings,
      maxZoom,
      minZoom,
    } = this.props;

    return (
      <Fragment>
        <Button
          theme="theme-button-map-control"
          onClick={() => {
            setMapSettings({ zoom: zoom + 1 > maxZoom ? maxZoom : zoom + 1 });
            trackEvent({
              category: 'Map settings',
              action: 'Other buttons',
              label: 'Zoom in',
            });
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
            trackEvent({
              category: 'Map settings',
              action: 'Other buttons',
              label: 'Zoom out',
            });
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
        <Sticky top={15}>{this.renderZoomButtons()}</Sticky>
      </div>
    );
  }
}

MapControlsButtons.propTypes = {
  className: PropTypes.string,
  setMapSettings: PropTypes.func,
  viewport: PropTypes.object,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
};

export default connect()(MapControlsButtons);
