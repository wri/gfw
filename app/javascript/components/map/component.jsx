import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';
import cx from 'classnames';

import { handleMapLatLonTrack, track } from 'app/analytics';

import { Tooltip } from 'react-tippy';
import Tip from 'components/ui/tip';
import Loader from 'components/ui/loader';
import Icon from 'components/ui/icon';
import Map from 'components/ui/map';

import iconCrosshair from 'assets/icons/crosshair.svg';

import Scale from './components/scale';
import Popup from './components/popup';
import Draw from './components/draw';
import Attributions from './components/attributions';

// Components
import LayerManager from './components/layer-manager';

// Styles
import './styles.scss';

class MapComponent extends Component {
  static propTypes = {
    className: PropTypes.string,
    viewport: PropTypes.shape().isRequired,
    bounds: PropTypes.shape(),
    mapStyle: PropTypes.string.isRequired,
    setMapSettings: PropTypes.func.isRequired,
    setMapInteractions: PropTypes.func.isRequired,
    clearMapInteractions: PropTypes.func.isRequired,
    mapLabels: PropTypes.bool,
    mapRoads: PropTypes.bool,
    location: PropTypes.object,
    interactiveLayerIds: PropTypes.array,
    canBound: PropTypes.bool,
    stateBbox: PropTypes.array,
    geostoreBbox: PropTypes.array,
    interaction: PropTypes.object,
    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
    drawing: PropTypes.bool,
    loading: PropTypes.bool,
    loadingMessage: PropTypes.string,
    basemap: PropTypes.object,
    popupActions: PropTypes.array,
    onSelectBoundary: PropTypes.func,
    onDrawComplete: PropTypes.func,
    lang: PropTypes.string
  };

  static defaultProps = {
    bounds: {}
  };

  state = {
    bounds: {},
    drawClicks: 0
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      mapLabels,
      mapRoads,
      setMapSettings,
      canBound,
      stateBbox,
      geostoreBbox,
      interaction,
      viewport,
      lang,
      drawing,
      clearMapInteractions
    } = this.props;
    const {
      mapLabels: prevMapLabels,
      mapRoads: prevMapRoads,
      stateBbox: prevStateBbox,
      geostoreBbox: prevGeostoreBbox,
      interaction: prevInteraction,
      lang: prevLang,
      drawing: prevDrawing
    } = prevProps;

    if (!drawing && prevDrawing) {
      this.resetClicks();
    }

    if (drawing && !prevDrawing) {
      clearMapInteractions();
    }

    if (mapLabels !== prevMapLabels || lang !== prevLang) {
      this.setLabels();
    }

    if (mapRoads !== prevMapRoads) {
      this.setRoads();
    }

    // if bbox is change by action fit bounds
    if (canBound && stateBbox !== prevStateBbox) {
      // eslint-disable-next-line
      this.setState({ bounds: { bbox: stateBbox, options: { padding: 50 } } });
    }

    // if geostore changes
    if (canBound && geostoreBbox && geostoreBbox !== prevGeostoreBbox) {
      // eslint-disable-next-line
      this.setState({
        bounds: { bbox: geostoreBbox, options: { padding: 50 } }
      });
    }

    // reset canBound after fitting bounds
    if (
      canBound &&
      this.state.bounds &&
      !isEqual(this.state.bounds, prevState.bounds)
    ) {
      setMapSettings({ canBound: false, bbox: [] });
      // eslint-disable-next-line
      this.setState({ bounds: {} });
    }

    // fit bounds on cluster if clicked
    if (interaction && !isEqual(interaction, prevInteraction)) {
      track('mapInteraction', {
        label: interaction.label
      });

      if (interaction.data.cluster) {
        const { data, layer, geometry } = interaction;
        this.map
          .getSource(layer.id)
          .getClusterExpansionZoom(data.cluster_id, (err, newZoom) => {
            if (err) return;
            const { coordinates } = geometry;
            const difference = Math.abs(viewport.zoom - newZoom);
            setMapSettings({
              center: {
                lat: coordinates[1],
                lng: coordinates[0]
              },
              zoom: newZoom,
              transitionDuration: 400 + difference * 100
            });
          });
      }
    }
  }

  onViewportChange = debounce(viewport => {
    const { setMapSettings, location } = this.props;
    const { latitude, longitude, bearing, pitch, zoom } = viewport;
    setMapSettings({
      center: {
        lat: latitude,
        lng: longitude
      },
      bearing,
      pitch,
      zoom
    });
    handleMapLatLonTrack(location);
  }, 250);

  onStyleLoad = () => {
    this.setLabels();
    this.setRoads();
  };

  onLoad = ({ map }) => {
    this.map = map;

    // Labels
    this.setLabels();
    this.setRoads();

    // Listeners
    this.map.on('style.load', this.onStyleLoad);
  };

  onClick = e => {
    const { drawing, clearMapInteractions } = this.props;
    if (!drawing && e.features && e.features.length) {
      const { features, lngLat } = e;
      const { setMapInteractions } = this.props;
      setMapInteractions({ features, lngLat });
    } else if (drawing) {
      this.setState({ drawClicks: this.state.drawClicks + 1 });
    } else {
      clearMapInteractions();
    }
  };

  setLabels = () => {
    const { lang } = this.props;
    const LABELS_GROUP = ['labels'];
    if (this.map) {
      const { mapLabels } = this.props;
      const { layers, metadata } = this.map.getStyle();

      const groups = Object.keys(metadata['mapbox:groups']).filter(k => {
        const { name } = metadata['mapbox:groups'][k];
        const roadGroups = LABELS_GROUP.map(rgr =>
          name.toLowerCase().includes(rgr)
        );

        return roadGroups.some(bool => bool);
      });

      const labelLayers = layers.filter(l => {
        const labelMetadata = l.metadata;
        if (!labelMetadata) return false;

        const gr = labelMetadata['mapbox:group'];
        return groups.includes(gr);
      });

      labelLayers.forEach(l => {
        const visibility = mapLabels ? 'visible' : 'none';
        this.map.setLayoutProperty(l.id, 'visibility', visibility);
        this.map.setLayoutProperty(l.id, 'text-field', ['get', `name_${lang}`]);
      });
    }
  };

  setRoads = () => {
    const ROADS_GROUP = ['roads', 'bridges', 'tunnels'];
    if (this.map) {
      const { mapRoads } = this.props;
      const { layers, metadata } = this.map.getStyle();

      const groups = Object.keys(metadata['mapbox:groups']).filter(k => {
        const { name } = metadata['mapbox:groups'][k];
        const roadGroups = ROADS_GROUP.map(rgr =>
          name.toLowerCase().includes(rgr)
        );

        return roadGroups.some(bool => bool);
      });

      const roadLayers = layers.filter(l => {
        const roadMetadata = l.metadata;
        if (!roadMetadata) return false;

        const gr = roadMetadata['mapbox:group'];
        return groups.includes(gr);
      });

      roadLayers.forEach(l => {
        const visibility = mapRoads ? 'visible' : 'none';
        this.map.setLayoutProperty(l.id, 'visibility', visibility);
      });
    }
  };

  resetClicks() {
    this.setState({ drawClicks: 0 });
  }

  render() {
    const {
      className,
      mapStyle,
      viewport,
      minZoom,
      maxZoom,
      interactiveLayerIds,
      drawing,
      loading,
      loadingMessage,
      basemap,
      popupActions,
      onSelectBoundary,
      onDrawComplete
    } = this.props;

    let tipText;
    if (this.state.drawClicks <= 0) {
      tipText = 'Click an origin point to start drawing.';
    } else if (this.state.drawClicks < 3) {
      tipText = 'Click to add another point.';
    } else {
      tipText = 'Click to add a point or close shape.';
    }

    return (
      <div
        className={cx('c-map', { 'no-pointer-events': drawing }, className)}
        style={{ backgroundColor: basemap && basemap.color }}
      >
        <Tooltip
          theme="tip"
          title="GFW Interactive Map"
          hideOnClick={false}
          html={<Tip text={tipText} className="tooltip-dark" />}
          position="top"
          followCursor
          animateFill={false}
          disabled={!drawing}
        >
          <Map
            mapStyle={mapStyle}
            viewport={viewport}
            bounds={this.state.bounds}
            onViewportChange={this.onViewportChange}
            onClick={this.onClick}
            onLoad={this.onLoad}
            interactiveLayerIds={interactiveLayerIds}
            attributionControl={false}
            minZoom={minZoom}
            maxZoom={maxZoom}
            getCursor={({ isHovering, isDragging }) => {
              if (drawing) return 'crosshair';
              else if (isDragging) return 'grabbing';
              else if (isHovering) return 'pointer';
              return 'grab';
            }}
          >
            {map => (
              <Fragment>
                {/* POPUP */}
                <Popup
                  map={this.map}
                  buttons={popupActions}
                  onSelectBoundary={onSelectBoundary}
                />
                {/* LAYER MANAGER */}
                <LayerManager map={map} />
                {/* DRAWING */}
                <Draw
                  map={map}
                  drawing={drawing}
                  onDrawComplete={onDrawComplete}
                />
                {/* SCALE */}
                <Scale className="map-scale" map={map} viewport={viewport} />
                {/* ATTRIBUTIONS */}
                <Attributions
                  className="map-attributions"
                  map={map}
                  viewport={viewport}
                />
              </Fragment>
            )}
          </Map>
        </Tooltip>
        <Icon className="map-icon-crosshair" icon={iconCrosshair} />
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

export default MapComponent;
