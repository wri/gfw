import { createElement, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import actions from './root-actions';
import reducers, { initialState } from './root-reducers';
import RootComponent from './root-component';

const mapStateToProps = ({ root }) => {
  const { loading } = root;
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

export { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(RootContainer);
