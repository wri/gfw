import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withRouter from 'utils/withRouter';

import { setUserToken } from 'services/user';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import getMyGfwProps from './selectors';

class MyGFWProvider extends PureComponent {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { router } = this.props;

    // if user arriving from social login, clear token from url and save it to storage
    const { query, pathname } = router;
    if (query && query.token) {
      setUserToken(query.token);
      delete query.token;
      router.replace({ pathname, query });
    }

    const { getUserProfile } = this.props;
    getUserProfile(query.token);
  }

  render() {
    return null;
  }
}

MyGFWProvider.propTypes = {
  getUserProfile: PropTypes.func.isRequired,
};

export const reduxModule = {
  actions,
  reducers,
  initialState,
};

export default withRouter(connect(getMyGfwProps, actions)(MyGFWProvider));
