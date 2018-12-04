import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { CancelToken } from 'axios';

import { setSubscribeSettings } from 'components/modals/subscribe/actions';
import * as actions from './actions';
import reducers, { initialState } from './reducers';

import AnalysisComponent from './component';
import { getAnalysisProps } from './selectors';

class AnalysisContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    getAnalysis: PropTypes.func,
    endpoints: PropTypes.array,
    clearAnalysis: PropTypes.func,
    setAnalysisLoading: PropTypes.func
  };

  componentDidMount() {
    const { endpoints, location } = this.props;
    if (location.type && location.adm0 && endpoints && endpoints.length) {
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
    this.analysisFetch = CancelToken.source();
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

export const reduxModule = { actions, reducers, initialState };
export default connect(getAnalysisProps, { ...actions, setSubscribeSettings })(
  AnalysisContainer
);
