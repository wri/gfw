import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './cache-provider-actions';
import reducers, { initialState } from './cache-provider-reducers';

class CacheProvider extends PureComponent {
  componentWillMount() {
    const { getCacheList } = this.props;
    getCacheList();
  }

  render() {
    return null;
  }
}

CacheProvider.propTypes = {
  getCacheList: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(null, actions)(CacheProvider);
