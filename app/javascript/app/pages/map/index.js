import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import RootComponent from './component';

const mapStateToProps = ({ mapPage }) => {
  const { loading } = mapPage;
  return {
    loading
  };
};

class RootContainer extends PureComponent {
  componentDidMount() {
    window.addEventListener('mapLoaded', () => {
      const { setRootLoading } = this.props;
      setRootLoading(false);
    });
  }

  render() {
    return createElement(RootComponent, {
      ...this.props
    });
  }
}

RootContainer.propTypes = {
  setRootLoading: PropTypes.func
};

export const reduxModule = { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(RootContainer);
