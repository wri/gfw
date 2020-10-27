import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { cancelToken } from 'utils/request';
import { registerReducer } from 'redux/store';

import { setAreaOfInterestModalSettings } from 'components/modals/area-of-interest/actions';
import { setShareModal } from 'components/modals/share/actions';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getAnalysisProps } from './selectors';
import AnalysisComponent from './component';

const AnalysisContainer = (props) => {
  const {
    location,
    endpoints,
    analysisLocation,
    getAnalysis,
    clearAnalysis,
  } = props;
  registerReducer({
    key: 'analysis',
    reducers,
    initialState,
  });

  let analysisFetch = null;

  useEffect(() => {
    const hasLocationChanged = !isEqual(
      { ...location, endpoints },
      analysisLocation
    );
    if (
      hasLocationChanged &&
      location.type &&
      location.adm0 &&
      endpoints &&
      endpoints.length
    ) {
      if (analysisFetch) {
        analysisFetch.cancel();
        clearAnalysis();
      }
      analysisFetch = cancelToken();

      getAnalysis({
        endpoints,
        ...location,
        token: analysisFetch.token,
      });
    }

    return () => {
      if (analysisFetch) {
        analysisFetch.cancel('Analysis unmounted');
      }
      clearAnalysis();
    };
  }, [endpoints, location]);

  return <AnalysisComponent {...props} />;
};

AnalysisContainer.propTypes = {
  location: PropTypes.object,
  getAnalysis: PropTypes.func,
  endpoints: PropTypes.array,
  clearAnalysis: PropTypes.func,
  setAnalysisLoading: PropTypes.func,
  analysisLocation: PropTypes.object,
};

export default connect(getAnalysisProps, {
  ...actions,
  setAreaOfInterestModalSettings,
  setShareModal,
})(AnalysisContainer);
