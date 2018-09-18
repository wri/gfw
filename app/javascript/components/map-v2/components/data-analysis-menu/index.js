import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { bindActionCreators } from 'redux';
import { MAP, DASHBOARDS } from 'router';
import { CancelToken } from 'axios';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

import Component from './component';
import { getAnalysisProps } from './selectors';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearAnalysis: () => (_, getState) =>
        dispatch({
          type: MAP,
          ...(getState().location.query && {
            query: getState().location.query
          })
        }),
      goToDashboard: () => (_, getState) =>
        dispatch({
          type: DASHBOARDS,
          payload: getState().location.payload,
          ...(getState().location.query && {
            query: getState().location.query
          })
        }),
      setDrawnAnalysis: geostoreId => (_, getState) => {
        const query = getState().location.query || {};
        dispatch({
          type: MAP,
          payload: {
            type: 'geostore',
            country: geostoreId
          },
          query: {
            ...query,
            map: {
              ...(query && query.map && query.map),
              canBound: true,
              draw: false
            }
          }
        });
      },
      ...actions
    },
    dispatch
  );

class DataAnalysisMenuContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    getAnalysis: PropTypes.func,
    drawnGeostoreId: PropTypes.string,
    setDrawnAnalysis: PropTypes.func,
    query: PropTypes.object,
    clearAnalysis: PropTypes.func,
    setAnalysisLoading: PropTypes.func
  };

  componentDidMount() {
    const { location } = this.props;

    if (location.type && location.country) {
      this.handleFetchAnalysis(location);
    }
  }

  componentDidUpdate(prevProps) {
    const { location, drawnGeostoreId, setDrawnAnalysis, query } = this.props;

    // get analysis if location changes
    if (
      location.type &&
      location.country &&
      !isEqual(location, prevProps.location)
    ) {
      this.handleFetchAnalysis(location);
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

  handleFetchAnalysis = location => {
    if (this.analysisFetch) {
      this.analysisFetch.cancel();
    }
    this.analysisFetch = CancelToken.source();
    this.props.getAnalysis({ ...location, token: this.analysisFetch.token });
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
export default connect(getAnalysisProps, mapDispatchToProps)(
  DataAnalysisMenuContainer
);
