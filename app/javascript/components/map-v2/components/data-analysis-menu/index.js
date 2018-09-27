import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { CancelToken } from 'axios';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

import Component from './component';
import { getAnalysisProps } from './selectors';

class DataAnalysisMenuContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    getAnalysis: PropTypes.func,
    drawnGeostoreId: PropTypes.string,
    setDrawnAnalysis: PropTypes.func,
    query: PropTypes.object,
    endpoints: PropTypes.array,
    clearAnalysis: PropTypes.func,
    setAnalysisLoading: PropTypes.func
  };

  componentDidUpdate(prevProps) {
    const {
      location,
      drawnGeostoreId,
      setDrawnAnalysis,
      query,
      endpoints
    } = this.props;

    // get analysis if location changes
    if (
      location.type &&
      location.country &&
      endpoints &&
      (!isEqual(endpoints, prevProps.endpoints) ||
        !isEqual(location, prevProps.location))
    ) {
      this.handleFetchAnalysis(location, endpoints);
    }

    // if user draws shape get analysis
    if (
      drawnGeostoreId &&
      !isEqual(drawnGeostoreId, prevProps.drawnGeostoreId)
    ) {
      setDrawnAnalysis(drawnGeostoreId, query);
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
    return createElement(Component, {
      ...this.props,
      handleFetchAnalysis: this.handleFetchAnalysis,
      handleCancelAnalysis: this.handleCancelAnalysis
    });
  }
}

export const reduxModule = { actions, reducers, initialState };
export default connect(getAnalysisProps, actions)(DataAnalysisMenuContainer);
