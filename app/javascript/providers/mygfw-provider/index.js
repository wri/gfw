import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMyGfwProps } from './selectors';

class MyGFWProvider extends PureComponent {
  componentDidMount() {
    const { checkLogged } = this.props;
    checkLogged();
  }

  render() {
    return null;
  }
}

MyGFWProvider.propTypes = {
  checkLogged: PropTypes.func.isRequired
};

export const reduxModule = {
  actions,
  reducers,
  initialState
};

export default connect(getMyGfwProps, actions)(MyGFWProvider);
