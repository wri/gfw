import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

import Component from './component';
import { getAnalysisProps } from './selectors';

class DataAnalysisMenuContainer extends PureComponent {
  static propTypes = {
    location: PropTypes.object,
    getAnalysis: PropTypes.func
  };

  componentDidMount() {
    const { location, getAnalysis } = this.props;
    if (location.type && location.country) {
      getAnalysis({ geostoreId: location.country });
    }
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export const reduxModule = { actions, reducers, initialState };
export default connect(getAnalysisProps, actions)(DataAnalysisMenuContainer);
