import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './latest-provider-actions';
import { getLatestProps } from './latest-provider-selectors';
import reducers, { initialState } from './latest-provider-reducers';

class LatestProvider extends PureComponent {
  componentDidUpdate(prevProps) {
    const { getLatest, latestEndpoints } = this.props;
    if (
      latestEndpoints &&
      latestEndpoints.length !== prevProps.latestEndpoints.length
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
  latestEndpoints: PropTypes.array
};

export const reduxModule = { actions, reducers, initialState };
export default connect(getLatestProps, actions)(LatestProvider);
