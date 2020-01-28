import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { cancelToken } from 'utils/request';
import reducerRegistry from 'app/registry';

import { setSubscribeSettings } from 'components/modals/subscribe/actions';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getAnalysisProps } from './selectors';
import AnalysisComponent from './component';

class AnalysisContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    getAnalysis: PropTypes.func,
    endpoints: PropTypes.array,
    clearAnalysis: PropTypes.func,
    setAnalysisLoading: PropTypes.func,
    analysisLocation: PropTypes.object
  };

  componentDidMount() {
    const { endpoints, location, analysisLocation } = this.props;
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
      this.handleFetchAnalysis(location, endpoints);
    }
  }

  componentDidUpdate(prevProps) {
    const { location, endpoints } = this.props;
    // get analysis if location changes
    if (
      location.type &&
      location.adm0 &&
      endpoints &&
      endpoints.length &&
      (!isEqual(endpoints, prevProps.endpoints) ||
        !isEqual(location, prevProps.location))
    ) {
      this.handleFetchAnalysis(location, endpoints);
    }
  }

  componentWillUnmount() {
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }
  }

  handleFetchAnalysis = (location, endpoints) => {
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }
    this.analysisFetch = cancelToken();
    this.props.getAnalysis({
      endpoints,
      ...location,
      token: this.analysisFetch.token
    });
  };

  handleCancelAnalysis = () => {
    const { clearAnalysis, setAnalysisLoading } = this.props;
    clearAnalysis();
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }
    setAnalysisLoading({ loading: false, error: '', errorMessage: '' });
  };

  render() {
    return createElement(AnalysisComponent, {
      ...this.props,
      handleFetchAnalysis: this.handleFetchAnalysis,
      handleCancelAnalysis: this.handleCancelAnalysis
    });
  }
}

reducerRegistry.registerModule('analysis', {
  actions,
  reducers,
  initialState
});

export default connect(getAnalysisProps, { ...actions, setSubscribeSettings })(
  AnalysisContainer
);
