import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'redux/registry';

import * as actions from './actions';
import { getLatestProps } from './selectors';
import reducers, { initialState } from './reducers';

class MetaProvider extends PureComponent {
  componentDidMount() {
    const { fetchGfwMeta } = this.props;
    fetchGfwMeta();
  }

  render() {
    return null;
  }
}

MetaProvider.propTypes = {
  fetchGfwMeta: PropTypes.func.isRequired,
};

reducerRegistry.registerModule('meta', {
  actions,
  reducers,
  initialState,
});

export default connect(getLatestProps, actions)(MetaProvider);
