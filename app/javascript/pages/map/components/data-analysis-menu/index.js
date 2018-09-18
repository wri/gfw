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
    query: PropTypes.object
  };

  componentDidMount() {
    const { location, getAnalysis } = this.props;

    if (location.type && location.country) {
      this.analysisFetch = CancelToken.source();
      getAnalysis({ ...location, token: this.analysisFetch.token });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      location,
      getAnalysis,
      drawnGeostoreId,
      setDrawnAnalysis,
      query
    } = this.props;

    // get analysis if location changes
    if (
      location.type &&
      location.country &&
      !isEqual(location, prevProps.location)
    ) {
      if (this.analysisFetch) {
        this.analysisFetch.cancel();
      }
      this.analysisFetch = CancelToken.source();
      getAnalysis({ ...location, token: this.analysisFetch.token });
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

  render() {
    return createElement(Component, {
      ...this.props,
      analysisFetch: this.analysisFetch
    });
  }
}

export const reduxModule = { actions, reducers, initialState };
export default connect(getAnalysisProps, mapDispatchToProps)(
  DataAnalysisMenuContainer
);
