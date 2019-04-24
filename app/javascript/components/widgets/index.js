import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';

import { setShowMapMobile } from 'components/map/actions';
import * as ownActions from './actions';
import reducers, { initialState } from './reducers';
import Component from './component';
import { getWidgetsProps } from './selectors';

const actions = {
  setShowMapMobile,
  ...ownActions
};

class WidgetsContainer extends PureComponent {
  // componentDidMount() {
  //   const { getWidgetsData } = this.props;
  //   getWidgetsData();
  // }

  render() {
    return createElement(Component, {
      ...this.props
    });
  }
}

// WidgetsContainer.propTypes = {
//   getWidgetsData: PropTypes.func
// };

reducerRegistry.registerModule('widgets', {
  actions: ownActions,
  reducers,
  initialState
});

export default connect(getWidgetsProps, actions)(WidgetsContainer);
