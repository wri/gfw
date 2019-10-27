import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import { track } from 'app/analytics';

import { getGeostoreId } from 'providers/geostore-provider/actions';
import { setMapPromptsSettings } from 'components/prompts/map-prompts/actions';
import { setRecentImagerySettings } from 'components/recent-imagery/actions';
import { setMenuSettings } from 'components/map-menu/actions';

import * as ownActions from './actions';
import { getMapProps } from './selectors';
import MapComponent from './component';

const actions = {
  setRecentImagerySettings,
  setMenuSettings,
  setMapPromptsSettings,
  getGeostoreId,
  ...ownActions
};

class MainMapContainer extends PureComponent {
  state = {
    showTooltip: false,
    tooltipData: {}
  };

  componentDidMount() {
    const { activeDatasets } = this.props;
    const layerIds = flatMap(activeDatasets.map(d => d.layers));
    track('mapInitialLayers', {
      label: layerIds && layerIds.join(', ')
    });
  }

  componentDidUpdate(prevProps) {
    const {
      selectedInteraction,
      setMainMapAnalysisView,
      setMainMapSettings,
      oneClickAnalysis,
      analysisActive,
      geostoreId,
      location
    } = this.props;

    // set analysis view if interaction changes
    if (
      oneClickAnalysis &&
      selectedInteraction &&
      !isEmpty(selectedInteraction.data) &&
      !isEqual(selectedInteraction, prevProps.selectedInteraction)
    ) {
      setMainMapAnalysisView(selectedInteraction);
    }

    if (!analysisActive && geostoreId && geostoreId !== prevProps.geostoreId) {
      setMainMapSettings({ showAnalysis: true });
    }

    if (location.type === 'aoi' && location.type !== prevProps.location.type) {
      this.props.setMenuSettings({ menuSection: 'my-gfw' });
    }
  }

  handleShowTooltip = (show, data) => {
    this.setState({ showTooltip: show, tooltipData: data });
  };

  handleClickMap = () => {
    if (this.props.menuSection) {
      this.props.setMenuSettings({ menuSection: '' });
    }
    if (this.props.location.type) {
      this.props.setMapPromptsSettings({
        open: true,
        stepsKey: 'subscribeToArea',
        stepIndex: 0
      });
    }
  };

  handleClickAnalysis = selected => {
    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    const { setMainMapAnalysisView } = this.props;
    if (isAdmin || isWdpa || isUse) {
      setMainMapAnalysisView(selected);
    } else {
      this.onDrawComplete(geometry);
    }
  };

  onDrawComplete = geojson => {
    const { setDrawnGeostore } = this.props;
    this.props.getGeostoreId({ geojson, callback: setDrawnGeostore });
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      ...this.state,
      handleShowTooltip: this.handleShowTooltip,
      handleClickAnalysis: this.handleClickAnalysis,
      handleClickMap: this.handleClickMap,
      onDrawComplete: this.onDrawComplete
    });
  }
}

MainMapContainer.propTypes = {
  oneClickAnalysis: PropTypes.bool,
  setMainMapAnalysisView: PropTypes.func,
  getGeostoreId: PropTypes.func,
  selectedInteraction: PropTypes.object,
  setMenuSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
  setMapPromptsSettings: PropTypes.func,
  setDrawnGeostore: PropTypes.func,
  activeDatasets: PropTypes.array,
  menuSection: PropTypes.string,
  analysisActive: PropTypes.bool,
  location: PropTypes.object,
  geostoreId: PropTypes.string
};

export default connect(getMapProps, actions)(MainMapContainer);
