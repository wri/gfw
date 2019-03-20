import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Sticky from 'react-stickynode';

import Button from 'components/ui/button';
import Icon from 'components/ui/icon';

import plusIcon from 'assets/icons/plus.svg';
import minusIcon from 'assets/icons/minus.svg';
import './styles.scss';

class DashboardsMapControls extends PureComponent {
  render() {
    const {
      mapSettings,
      setMapSettings,
      className,
      stickyOptions
    } = this.props;
    const { zoom, minZoom, maxZoom } = mapSettings || {};

    return (
      <div className={cx('c-dashboards-map-controls', className)}>
        <Sticky enabled={false} {...stickyOptions}>
          <Button
            theme="theme-button-map-control"
            onClick={() => setMapSettings({ zoom: zoom + 1 })}
            tooltip={{ text: 'Zoom in' }}
            disabled={zoom === maxZoom}
          >
            <Icon icon={plusIcon} className="plus-icon" />
          </Button>
          <Button
            theme="theme-button-map-control"
            onClick={() => setMapSettings({ zoom: zoom - 1 })}
            tooltip={{ text: 'Zoom out' }}
            disabled={zoom === minZoom}
          >
            <Icon icon={minusIcon} className="minus-icon" />
          </Button>
        </Sticky>
      </div>
    );
  }
}

DashboardsMapControls.propTypes = {
  mapSettings: PropTypes.object,
  setMapSettings: PropTypes.func,
  className: PropTypes.string,
  stickyOptions: PropTypes.object
};

export default DashboardsMapControls;
