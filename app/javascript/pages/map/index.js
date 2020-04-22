import { createElement, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import isEqual from 'lodash/isEqual';
// import isEmpty from 'lodash/isEmpty';
// import flatMap from 'lodash/flatMap';
// import { logEvent } from 'app/analytics';
import withRouter from 'utils/withRouter';
import { getLocationFromData } from 'utils/format';
import reducerRegistry from 'app/registry';

// import { getGeostoreId } from 'providers/geostore-provider/actions';
// import { setMapPromptsSettings } from 'components/prompts/map-prompts/actions';
// import { setRecentImagerySettings } from 'components/recent-imagery/actions';
// import { setMenuSettings } from 'components/map-menu/actions';

import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import getMapProps from './selectors';
import MapComponent from './component';

const actions = {
  // setRecentImagerySettings,
  // setMenuSettings,
  // setMapPromptsSettings,
  // getGeostoreId,
  ...ownActions
};

class MainMapContainer extends PureComponent {
  static propTypes = {
    router: PropTypes.object.isRequired,
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
  }

  state = {
    showTooltip: false,
    tooltipData: {}
  };

  setMainMapAnalysisView = ({ data, layer } = {}) => {
    const { cartodb_id: cartodbId, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};
    const { query, pushDynamic } = this.props.router || {};
    const { map, mainMap } = query || {};

    // get location payload based on layer type
    let payload = {};
    if (data) {
      if (analysisEndpoint === 'admin') {
        payload = {
          type: 'country',
          ...getLocationFromData(data)
        };
      } else if (analysisEndpoint === 'wdpa' && (cartodbId || wdpaid)) {
        payload = {
          type: analysisEndpoint,
          adm0: wdpaid || cartodbId
        };
      } else if (cartodbId && tableName) {
        payload = {
          type: 'use',
          adm0: tableName,
          adm1: cartodbId
        };
      }
    }

    if (payload && payload.adm0) {
      pushDynamic({
        pathname: '/map/[...location]',
        query: {
          ...query,
          location: Object.values(payload).filter(o => o).join('/'),
          map: {
            ...map,
            canBound: true
          },
          mainMap: {
            ...mainMap,
            showAnalysis: true
          }
        }
      })
    }
  }

  setDrawnGeostore = geostoreId => {
    const { query, pushDynamic } = this.props.router;
    const { map, mainMap } = query || {};
    pushDynamic({
      pathname: '/map/[...location]',
      query: {
        ...query,
        location: `geostore/${geostoreId}`,
        map: {
          ...map,
          canBound: true,
          drawing: false
        },
        mainMap: {
          ...mainMap,
          showAnalysis: true
        }
      }
    })
  }

  // componentDidMount() {
  //   const { activeDatasets } = this.props;
  //   const layerIds = flatMap(activeDatasets.map(d => d.layers));
  //   logEvent('mapInitialLayers', {
  //     label: layerIds && layerIds.join(', ')
  //   });
  // }

  // componentDidUpdate(prevProps) {
  //   const {
  //     selectedInteraction,
  //     setMainMapAnalysisView,
  //     setMainMapSettings,
  //     oneClickAnalysis,
  //     analysisActive,
  //     geostoreId,
  //     location
  //   } = this.props;

  //   // set analysis view if interaction changes
  //   if (
  //     oneClickAnalysis &&
  //     selectedInteraction &&
  //     !isEmpty(selectedInteraction.data) &&
  //     !isEqual(selectedInteraction, prevProps.selectedInteraction)
  //   ) {
  //     setMainMapAnalysisView(selectedInteraction);
  //   }

  //   if (!analysisActive && geostoreId && geostoreId !== prevProps.geostoreId) {
  //     setMainMapSettings({ showAnalysis: true });
  //   }

  //   if (location.type === 'aoi' && location.type !== prevProps.location.type) {
  //     this.props.setMenuSettings({ menuSection: 'my-gfw' });
  //   }
  // }

  handleShowTooltip = (show, data) => {
    this.setState({ showTooltip: show, tooltipData: data });
  };

  handleClickMap = () => {
    // if (this.props.menuSection) {
    //   this.props.setMenuSettings({ menuSection: '' });
    // }
    // if (this.props?.location?.type) {
    //   this.props.setMapPromptsSettings({
    //     open: true,
    //     stepsKey: 'subscribeToArea',
    //     stepIndex: 0
    //   });
    // }
  };

  handleClickAnalysis = selected => {
    const { data, layer, geometry } = selected;
    const { cartodb_id: cartdbId, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartdbId || wdpaid);
    const isUse = cartdbId && tableName;

    if (isAdmin || isWdpa || isUse) {
      this.setMainMapAnalysisView(selected);
    } else {
      this.onDrawComplete(geometry);
    }
  };

  onDrawComplete = geojson => {
    this.props.getGeostoreId({ geojson, callback: this.setDrawnGeostore });
  };

  render() {
    return createElement(MapComponent, {
      ...this.props,
      ...this.state,
      setMainMapAnalysisView: this.setMainMapAnalysisView,
      setDrawnGeostore: this.setDrawnGeostore,
      handleShowTooltip: this.handleShowTooltip,
      handleClickAnalysis: this.handleClickAnalysis,
      handleClickMap: this.handleClickMap,
      onDrawComplete: this.onDrawComplete
    });
  }
}

reducerRegistry.registerModule('mainMap', {
  actions: ownActions,
  reducers,
  initialState
});


export default withRouter(connect(getMapProps, actions)(MainMapContainer));
