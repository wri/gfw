import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { bindActionCreators } from 'redux';
import { MAP } from 'router';
import { CancelToken } from 'axios';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

import Component from './component';
import { getAnalysisProps } from './selectors';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearAnalysis: query => ({
        type: MAP,
        query
      }),
      ...actions
    },
    dispatch
  );

class DataAnalysisMenuContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    getAnalysis: PropTypes.func
  };

  componentDidMount() {
    const { location, getAnalysis } = this.props;

    if (location.type && location.country) {
      this.analysisFetch = CancelToken.source();
      getAnalysis({ ...location, token: this.analysisFetch.token });
    }
  }

  componentDidUpdate(prevProps) {
    const { location, getAnalysis } = this.props;

    if (
      location.type &&
      location.country &&
      !isEqual(location, prevProps.location)
    ) {
      this.analysisFetch = CancelToken.source();
      getAnalysis({ ...location, token: this.analysisFetch.token });
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
