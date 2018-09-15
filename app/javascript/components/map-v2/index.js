import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import { format } from 'd3-format';
import startCase from 'lodash/startCase';
import { bindActionCreators } from 'redux';
import { MAP } from 'router';
import { getLocationFromData } from 'utils/format';

import MapComponent from './component';
import { getMapProps } from './selectors';

import * as popupActions from './components/popup/actions';
import { setRecentImagerySettings } from './components/recent-imagery/recent-imagery-actions';
import * as ownActions from './actions';

const actions = {
  setRecentImagerySettings,
  ...popupActions,
  ...ownActions
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      oneClickAnalysis: payload => (_, getState) => {
        const query = getState().location.query || {};
        dispatch({
          type: MAP,
          payload,
          query: {
            ...query,
            map: {
              ...(query && query.map && query.map),
              canBound: true
            }
          }
        });
      },
      ...actions
    },
    dispatch
  );

class MapContainer extends PureComponent {
  static propTypes = {
    basemap: PropTypes.object,
    mapOptions: PropTypes.object,
    setLandsatBasemap: PropTypes.func
  };

  state = {
    showTooltip: false,
    tooltipData: {},
    bbox: null
  };

  componentDidUpdate(prevProps) {
    const {
      basemap,
      mapOptions: { zoom },
      canBound,
      bbox,
      geostoreBbox,
      setMapSettings,
      layerBbox
    } = this.props;

    // update landsat basemap when changing zoom
    if (basemap.id === 'landsat' && zoom !== prevProps.zoom) {
      this.props.setLandsatBasemap({
        year: basemap.year,
        defaultUrl: basemap.defaultUrl
      });
    }

    // only set bounding box if action allows it
    if (canBound && bbox !== prevProps.bbox) {
      this.setBbox(bbox);
    }

    // if a new layer contains a bbox
    if (layerBbox && layerBbox !== prevProps.layerBbox) {
      setMapSettings({ bbox: layerBbox });
    }

    // if geostore changes
    if (geostoreBbox && geostoreBbox !== prevProps.geostoreBbox) {
      setMapSettings({ bbox: geostoreBbox });
    }
  }

  handleShowTooltip = (show, data) => {
    this.setState({ showTooltip: show, tooltipData: data });
  };

  setBbox = bbox => {
    this.setState({ bbox });
  };

  handleMapMove = (e, map) => {
    const { setMapSettings } = this.props;
    setMapSettings({
      zoom: map.getZoom(),
      center: map.getCenter(),
      canBound: false,
      bbox: null
    });
    this.setBbox(null);
  };

  handleRecentImageryTooltip = e => {
    const data = e.layer.feature.properties;
    const { cloudScore, instrument, dateTime } = data;
    this.handleShowTooltip(true, {
      instrument: startCase(instrument),
      date: moment(dateTime)
        .format('DD MMM YYYY, HH:mm')
        .toUpperCase(),
      cloudCoverage: `${format('.0f')(cloudScore)}%`
    });
  };

  handleClickMap = ({ e, article, output, layer }) => {
    const {
      analysisActive,
      oneClickAnalysis,
      setInteraction,
      draw
    } = this.props;
    const { showTooltip } = this.state;
    const { data = {} } = e;
    const newLocation = data && getLocationFromData(data);
    if (!showTooltip) {
      setInteraction({
        ...e,
        label: layer.name,
        article,
        isBoundary: layer.isBoundary,
        id: layer.id,
        value: layer.id,
        config: output
      });
    }
    if (!draw && analysisActive && newLocation && newLocation.country) {
      oneClickAnalysis({
        type: 'country',
        ...newLocation
      });
    }
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      ...this.state,
      handleShowTooltip: this.handleShowTooltip,
      handleRecentImageryTooltip: this.handleRecentImageryTooltip,
      handleMapMove: this.handleMapMove,
      handleClickMap: this.handleClickMap,
      setBbox: this.setBbox
    });
  }
}

MapContainer.propTypes = {
  canBound: PropTypes.bool,
  bbox: PropTypes.array,
  geostoreBbox: PropTypes.array,
  setMapSettings: PropTypes.func,
  layerBbox: PropTypes.array,
  analysisActive: PropTypes.bool,
  oneClickAnalysis: PropTypes.func,
  setInteraction: PropTypes.func,
  draw: PropTypes.bool
};

export default connect(getMapProps, mapDispatchToProps)(MapContainer);
