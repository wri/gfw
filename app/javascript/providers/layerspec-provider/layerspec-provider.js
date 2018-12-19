import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const mapStateToProps = ({ location }) => ({
  location: location && location.payload
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

reducerRegistry.registerModule('layerSpec', {
  actions,
  reducers,
  initialState
});

export default connect(mapStateToProps, actions)(LayerSpecProvider);
