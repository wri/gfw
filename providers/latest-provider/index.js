import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import reducerRegistry from 'redux/registry';
import isEqual from 'lodash/isEqual';

import * as actions from './actions';
import { getLatestProps } from './selectors';
import reducers, { initialState } from './reducers';

class LatestProvider extends PureComponent {
  componentDidUpdate(prevProps) {
    const { getLatest, latestEndpoints } = this.props;
    const { latestEndpoints: prevLatestEndpoints } = prevProps;
    console.log('pimenta2:', latestEndpoints, prevLatestEndpoints);

    if (!isEqual(latestEndpoints, prevLatestEndpoints)) {
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
