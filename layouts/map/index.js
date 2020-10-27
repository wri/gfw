import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import flatMap from 'lodash/flatMap';
import { trackEvent } from 'utils/analytics';
import { registerReducer } from 'redux/store';

import reducers, { initialState } from './reducers';
import * as actions from './actions';
import { getMapProps } from './selectors';
import MapComponent from './component';

const MainMapContainer = (props) => {
  registerReducer({
    key: 'mainMap',
    reducers,
    initialState,
  });

  const {
    activeDatasets,
    basemap,
    analysisActive,
    geostoreId,
    location,
    setMenuSettings,
    setMainMapSettings,
  } = props;

  useEffect(() => {
    const layerIds = flatMap(activeDatasets?.map((d) => d.layers));
    trackEvent({
      category: 'Map data',
      action: 'Initial layers loaded',
      label: layerIds && layerIds.join(', '),
    });
    trackEvent({
      category: 'Map data',
      action: 'initial basemap loaded',
      label: basemap?.value,
    });
  }, []);

  useEffect(() => {
    if (!analysisActive && geostoreId) {
      setMainMapSettings({ showAnalysis: true });
    }
  }, [geostoreId]);

  useEffect(() => {
    if (location?.type === 'aoi') {
      setMenuSettings({ menuSection: 'my-gfw' });
    }
  }, [location]);

  return <MapComponent {...props} />;
};

MainMapContainer.propTypes = {
  setMenuSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
  activeDatasets: PropTypes.array,
  menuSection: PropTypes.string,
  analysisActive: PropTypes.bool,
  location: PropTypes.object,
  geostoreId: PropTypes.string,
  basemap: PropTypes.object,
};

export default connect(getMapProps, actions)(MainMapContainer);
