import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactMapGL from 'react-map-gl';

import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';

import iconCrosshair from 'assets/icons/crosshair.svg';

import Popup from './components/popup';
import MapDraw from './components/draw';
import MapAttributions from './components/map-attributions';
import LayerManagerComponent from './components/layer-manager';

import 'mapbox-gl/dist/mapbox-gl.css';
import './styles.scss';

class MapComponent extends PureComponent {
  state = {
    mapReady: false
  };

  getCursor = ({ isHovering, isDragging }) => {
    if (isHovering) return 'pointer';
    if (isDragging) return 'grabbing';
    return 'grab';
  };

  render() {
    const {
      className,
      loading,
      mapOptions,
      basemap,
      draw,
      handleMapMove,
      handleMapInteraction,
      zoom,
      lat,
      lng,
      setMapRect,
      interactiveLayers
    } = this.props;
    const { mapReady } = this.state;

    return (
      <div
        className={cx('c-map', { 'no-pointer-events': draw }, className)}
        style={{ backgroundColor: basemap.color }}
        ref={el => {
          setMapRect(el);
        }}
      >
        <ReactMapGL
          ref={map => {
            this.map = map && map.getMap();
          }}
          width="100%"
          height="100%"
          latitude={lat}
          longitude={lng}
          zoom={zoom}
          mapStyle={basemap.url}
          mapOptions={mapOptions}
          onViewportChange={handleMapMove}
          onClick={handleMapInteraction}
          onLoad={() => this.setState({ mapReady: true })}
          getCursor={this.getCursor}
          interactiveLayerIds={interactiveLayers}
        >
          {mapReady && (
            <Fragment>
              <LayerManagerComponent map={this.map} />
              <Popup />
              {draw && <MapDraw map={this.map} />}
            </Fragment>
          )}
        </ReactMapGL>
        <Icon className="map-icon-crosshair" icon={iconCrosshair} />
        <MapAttributions className="map-attributions" />
        {loading && (
          <Loader className="map-loader" theme="theme-loader-light" />
        )}
      </div>
    );
  }
}

MapComponent.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  mapOptions: PropTypes.object,
  basemap: PropTypes.object,
  setMapRect: PropTypes.func,
  handleMapMove: PropTypes.func,
  handleMapInteraction: PropTypes.func,
  interactiveLayers: PropTypes.array,
  draw: PropTypes.bool,
  lat: PropTypes.number,
  lng: PropTypes.number,
  zoom: PropTypes.number
};

export default MapComponent;
