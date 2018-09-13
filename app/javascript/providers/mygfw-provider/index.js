import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

class MyGFWProvider extends PureComponent {
  componentWillMount() {
    const { getMyGFW } = this.props;
    getMyGFW();
  }

  render() {
    return null;
  }
}

MyGFWProvider.propTypes = {
  getMyGFW: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(MyGFWProvider);
