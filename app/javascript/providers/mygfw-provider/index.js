import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import { getMyGfwProps } from './selectors';

class MyGFWProvider extends PureComponent {
  componentWillMount() {
    const { urlToken, localToken, checkLogged, setToken } = this.props;

    if (urlToken) {
      setToken(urlToken);
    }

    if (urlToken || localToken) {
      checkLogged(urlToken || localToken);
    }
  }

  render() {
    return null;
  }
}

MyGFWProvider.propTypes = {
  checkLogged: PropTypes.func.isRequired,
  setToken: PropTypes.func.isRequired,
  urlToken: PropTypes.string,
  localToken: PropTypes.string
};

export const reduxModule = { actions, reducers, initialState };
export default connect(getMyGfwProps, actions)(MyGFWProvider);
