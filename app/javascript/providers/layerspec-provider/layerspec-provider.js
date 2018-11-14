import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location }) => ({
  location: location.payload
});

class LayerSpecProvider extends PureComponent {
  componentDidMount() {
    const { getLayerSpec } = this.props;
    getLayerSpec();
  }

  render() {
    return null;
  }
}

LayerSpecProvider.propTypes = {
  getLayerSpec: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(LayerSpecProvider);
