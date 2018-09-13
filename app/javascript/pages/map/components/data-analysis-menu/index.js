import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

import Component from './component';
import { getAnalysisProps } from './selectors';

class DataAnalysisMenuContainer extends PureComponent {
  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

export const reduxModule = { actions, reducers, initialState };
export default connect(getAnalysisProps, actions)(DataAnalysisMenuContainer);
