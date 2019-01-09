import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'app/registry';

import * as actions from './datasets-provider-actions';
import reducers, { initialState } from './datasets-provider-reducers';

class DatasetsProvider extends PureComponent {
  componentDidMount() {
    const { getDatasets } = this.props;
    getDatasets();
  }

  render() {
    return null;
  }
}

DatasetsProvider.propTypes = {
  getDatasets: PropTypes.func.isRequired
};

reducerRegistry.registerModule('datasets', {
  actions,
  reducers,
  initialState
});
export default connect(null, actions)(DatasetsProvider);
