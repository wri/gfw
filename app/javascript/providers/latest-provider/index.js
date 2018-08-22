import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

class LatestProvider extends PureComponent {
  componentDidMount() {
    const { getLatest } = this.props;
    getLatest();
  }

  render() {
    return null;
  }
}

LatestProvider.propTypes = {
  getLatest: PropTypes.func.isRequired
};

export { actions, reducers, initialState };
export default connect(null, actions)(LatestProvider);
