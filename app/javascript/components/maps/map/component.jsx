import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactMapGL from 'react-map-gl';

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
  state = {
    mapReady: false
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
      zoom,
      lat,
      lng
    } = this.props;
    const { mapReady } = this.state;

    return (
      <div
        className={cx('c-map', { 'no-pointer-events': draw }, className)}
        style={{ backgroundColor: basemap.color }}
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
          onViewportChange={handleMapMove}
          onClick={handleMapInteraction}
          onLoad={() => this.setState({ mapReady: true })}
        >
          {this.map && mapReady && <LayerManagerComponent map={this.map} />}
          {this.map && draw && mapReady && <MapDraw map={this.map} />}
          {this.map && mapReady && <Popup />}
        </ReactMapGL>
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
  setInteraction: PropTypes.func,
  draw: PropTypes.bool
};

export default MapComponent;
