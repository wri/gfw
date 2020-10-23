import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import flatMap from 'lodash/flatMap';

import { track } from 'analytics';
import reducerRegistry from 'redux/registry';

import { getGeostoreId } from 'providers/geostore-provider/actions';
import { setMapPromptsSettings } from 'components/prompts/map-prompts/actions';
import { setRecentImagerySettings } from 'components/recent-imagery/actions';
import { setMenuSettings } from 'components/map-menu/actions';

import reducers, { initialState } from './reducers';
import * as ownActions from './actions';
import { getMapProps } from './selectors';
import MapComponent from './component';

const MapPageContainer = (props) => {
  const {
    activeDatasets,
    basemap,
    setMainMapSettings,
    analysisActive,
    menuSection,
    geostoreId,
    location,
    setDrawnGeostore,
    setMainMapAnalysisView,
  } = props;

  // on load track which layers were active
  useEffect(() => {
    const layerIds = flatMap(activeDatasets?.map((d) => d.layers));
    track('mapInitialLayers', {
      label: layerIds && layerIds.join(', '),
    });
    track('basemapsInitial', { label: basemap?.value });
  }, []);

  // show analysis view after routing to a drawn geostore
  useEffect(() => {
    if (!analysisActive && geostoreId) {
      setMainMapSettings({ showAnalysis: true });
    }
  }, [analysisActive, geostoreId]);

  // if the location changes to aoi show menu
  useEffect(() => {
    if (location?.type === 'aoi') {
      setMenuSettings({ menuSection: 'my-gfw' });
    }
  }, [location?.type]);

  const onDrawComplete = (geojson) => {
    getGeostoreId({ geojson, callback: setDrawnGeostore });
  };

  const handleClickMap = () => {
    if (menuSection) {
      setMenuSettings({ menuSection: '' });
    }
    if (location?.type) {
      setMapPromptsSettings({
        open: true,
        stepsKey: 'subscribeToArea',
        stepIndex: 0,
      });
    }
  };

  const handleClickAnalysis = (selected) => {
    const { data, layer, geometry } = selected;
    const { cartodb_id, wdpaid } = data || {};
    const { analysisEndpoint, tableName } = layer || {};

    const isAdmin = analysisEndpoint === 'admin';
    const isWdpa = analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid);
    const isUse = cartodb_id && tableName;

    if (isAdmin || isWdpa || isUse) {
      setMainMapAnalysisView(selected);
    } else {
      onDrawComplete(geometry);
    }
  };

  return (
    <MapComponent
      {...props}
      handleClickAnalysis={handleClickAnalysis}
      handleClickMap={handleClickMap}
      onDrawComplete={onDrawComplete}
    />
  );
};

MapPageContainer.propTypes = {
  setMainMapAnalysisView: PropTypes.func,
  getGeostoreId: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
  setMapPromptsSettings: PropTypes.func,
  setDrawnGeostore: PropTypes.func,
  activeDatasets: PropTypes.array,
  menuSection: PropTypes.string,
  analysisActive: PropTypes.bool,
  location: PropTypes.object,
  geostoreId: PropTypes.string,
  basemap: PropTypes.object,
};

reducerRegistry.registerModule('mainMap', {
  actions: ownActions,
  reducers,
  initialState,
});

export default connect(getMapProps, {
  setRecentImagerySettings,
  setMenuSettings,
  setMapPromptsSettings,
  getGeostoreId,
  ...ownActions,
})(MapPageContainer);
