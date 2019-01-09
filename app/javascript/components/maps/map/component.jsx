import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Map from 'wri-api-components/dist/map';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';

import iconCrosshair from 'assets/icons/crosshair.svg';
import LayerSpecProvider from 'providers/layerspec-provider';

import Popup from './components/popup';
import MapDraw from './components/draw';
import MapAttributions from './components/map-attributions';
import LayerManagerComponent from './components/layer-manager';

import './styles.scss';

class MapComponent extends PureComponent {
  componentDidMount() {
    requestAnimationFrame(() => {
      this.map.invalidateSize();
      L.control.scale({ maxWidth: 80 }).addTo(this.map); // eslint-disable-line
    });
  }

  render() {
    const {
      className,
      loading,
      mapOptions,
      basemap,
      label,
      bbox,
      draw,
      handleMapMove,
      handleMapInteraction,
      customLayers
    } = this.props;

    return (
      <div
        className={cx('c-map', className)}
        style={{ backgroundColor: basemap.color }}
      >
        <Map
          customClass="map-wrapper"
          onReady={map => {
            this.map = map;
          }}
          mapOptions={mapOptions}
          basemap={basemap}
          label={label}
          bounds={
            bbox
              ? {
                bbox,
                options: {
                  padding: [50, 50]
                }
              }
              : {}
          }
          events={{
            moveend: handleMapMove
          }}
        >
          {map => (
            <Fragment>
              <LayerManagerComponent
                map={map}
                customLayers={customLayers}
                handleMapInteraction={handleMapInteraction}
              />
              <Popup map={map} />
              {draw && <MapDraw map={map} />}
            </Fragment>
          )}
        </Map>
        <Icon className="map-icon-crosshair" icon={iconCrosshair} />
        <MapAttributions className="map-attributions" />
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
        <LayerSpecProvider />
      </div>
    );
  }
}

MapComponent.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  mapOptions: PropTypes.object,
  basemap: PropTypes.object,
  label: PropTypes.object,
  handleMapMove: PropTypes.func,
  bbox: PropTypes.array,
  handleMapInteraction: PropTypes.func,
  customLayers: PropTypes.array,
  draw: PropTypes.bool
};

export default MapComponent;
