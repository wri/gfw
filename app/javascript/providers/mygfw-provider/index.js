import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useRouter from 'app/router';

import { setUserToken } from 'services/user';

import * as actions from './actions';
import reducers, { initialState } from './reducers';
import getMyGfwProps from './selectors';

class MyGFWProvider extends PureComponent {
  componentDidMount() {
    // if user arriving from social login, clear token from url and save it to storage
    const { query, pathname, pushDynamic } = useRouter();

    if (query && query.token) {
      setUserToken(query.token);
      delete query.token;
      pushDynamic({
        pathname,
        query: { ...query, location: query.location.join('/') },
      });
    }

    const { getUserProfile } = this.props;
    getUserProfile(query?.token);
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

export default connect(getMyGfwProps, actions)(MyGFWProvider);
