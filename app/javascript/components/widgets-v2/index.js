import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Component from './component';
import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getWidgetsProps } from './selectors';

class WidgetsContainer extends PureComponent {
  componentDidMount() {
    const { getWidgetsData } = this.props;
    getWidgetsData();
  }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

WidgetsContainer.propTypes = {
  getWidgetsData: PropTypes.func
};

export const reduxModule = { actions, reducers, initialState };

export default connect(getWidgetsProps, actions)(WidgetsContainer);
