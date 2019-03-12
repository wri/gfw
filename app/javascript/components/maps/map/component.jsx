import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ReactMapGL from 'react-map-gl';

import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';

import iconCrosshair from 'assets/icons/crosshair.svg';
import 'mapbox-gl/dist/mapbox-gl.css';

import Popup from './components/popup';
import MapDraw from './components/draw';
import MapAttributions from './components/map-attributions';
import LayerManagerComponent from './components/layer-manager';

import './styles.scss';

class MapComponent extends PureComponent {
  state = {
    mapReady: false
  };

  componentDidUpdate(prevProps) {
    const { label, basemap } = this.props;
    const { mapReady } = this.state;

    if (mapReady && label.value !== prevProps.label.value) {
      this.setLabelStyles();
    }

    if (mapReady && basemap.value !== prevProps.basemap.value) {
      this.setBasemapStyles();
    }
  }

  getCursor = ({ isHovering, isDragging }) => {
    if (isHovering) return 'pointer';
    if (isDragging) return 'grabbing';
    return 'grab';
  };

  setBasemapStyles = () => {
    const { basemap } = this.props;
    if (this.map && basemap) {
      const { layerStyles } = basemap;
      if (layerStyles) {
        layerStyles.forEach(l => {
          const { id, ...styles } = l;
          const styleOptions = Object.entries(styles);
          if (styleOptions) {
            styleOptions.forEach(ly => {
              this.map.setPaintProperty(id, ly[0], ly[1]);
            });
          }
        });
      }
    }
  };

  setLabelStyles = () => {
    const { label } = this.props;
    if (this.map && label) {
      const { paint, layout } = label || {};
      const allLayers = this.map.getStyle().layers;
      const labelLayers = allLayers.filter(
        l =>
          (l.id.includes('label') ||
            l.id.includes('place') ||
            l.id.includes('poi')) &&
          l.type === 'symbol'
      );
      const paintOptions = paint && Object.entries(paint);
      const layoutOptions = layout && Object.entries(layout);
      labelLayers.forEach(l => {
        if (paintOptions) {
          paintOptions.forEach(p => {
            this.map.setPaintProperty(l.id, p[0], p[1]);
          });
        }
        if (layoutOptions) {
          layoutOptions.forEach(ly => {
            this.map.setLayoutProperty(l.id, ly[0], ly[1]);
          });
        }
      });
    }
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
      setMap,
      interactiveLayers,
      loadingMessage
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
            setMap(map && map.getMap());
          }}
          width="100%"
          height="100%"
          latitude={lat}
          longitude={lng}
          zoom={zoom}
          mapStyle="mapbox://styles/resourcewatch/cjt46ozf40a5j1fswk8fqxgyc"
          mapOptions={mapOptions}
          onViewportChange={handleMapMove}
          onClick={handleMapInteraction}
          onLoad={() => {
            this.setState({ mapReady: true });
            this.setLabelStyles();
            this.setBasemapStyles();
          }}
          getCursor={this.getCursor}
          interactiveLayerIds={interactiveLayers}
        >
          {mapReady && (
            <Fragment>
              <LayerManagerComponent map={this.map} />
              <Popup map={this.map} />
              <MapDraw map={this.map} drawing={draw} />
            </Fragment>
          )}
        </ReactMapGL>
        <Icon className="map-icon-crosshair" icon={iconCrosshair} />
        <MapAttributions className="map-attributions" />
        {loading && (
          <Loader
            className="map-loader"
            theme="theme-loader-light"
            message={loadingMessage}
          />
        )}
      </div>
    );
  }
}

MapComponent.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
  loadingMessage: PropTypes.string,
  mapOptions: PropTypes.object,
  basemap: PropTypes.object,
  label: PropTypes.object,
  setMapRect: PropTypes.func,
  setMap: PropTypes.func,
  handleMapMove: PropTypes.func,
  handleMapInteraction: PropTypes.func,
  interactiveLayers: PropTypes.array,
  draw: PropTypes.bool,
  lat: PropTypes.number,
  lng: PropTypes.number,
  zoom: PropTypes.number
};

export default MapComponent;
