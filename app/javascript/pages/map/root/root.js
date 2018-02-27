import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';

import actions from './root-actions';
import reducers, { initialState } from './root-reducers';
import RootComponent from './root-component';

const mapStateToProps = () => ({});

class RootContainer extends PureComponent {
  render() {
    return createElement(RootComponent, {
      ...this.props
    });
  }
}

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(RootContainer);
