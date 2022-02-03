import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'redux/registry';

import * as actions from './actions';
import { getLatestProps } from './selectors';
import reducers, { initialState } from './reducers';

class LatestProvider extends PureComponent {
  componentDidUpdate() {
    const { getLatest, latestEndpoints } = this.props;
    if (
      latestEndpoints
      // TODO: Figure out how to look for updates, length will be the same!
    ) {
      getLatest(latestEndpoints);
    }
  }

  render() {
    return null;
  }
}

LatestProvider.propTypes = {
  getLatest: PropTypes.func.isRequired,
  latestEndpoints: PropTypes.array,
};

reducerRegistry.registerModule('latest', {
  actions,
  reducers,
  initialState,
});

export default connect(getLatestProps, actions)(LatestProvider);
