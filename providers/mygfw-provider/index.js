import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';
import { withRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import reducerRegistry from 'store/registry';

import { setUserToken } from 'services/user';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

class MyGFWProvider extends PureComponent {
  static propTypes = {
    getUserProfile: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { getUserProfile, router } = this.props;
    const { push, pathname, asPath } = router;
    const query = parse(asPath.split('?')[1]);
    const urlToken = query?.token;

    if (urlToken) {
      setUserToken(urlToken);
      delete query.token;
      push(
        pathname,
        `${pathname}${!isEmpty(query) ? `?${stringify(query)}` : ''}`
      );
    }

    getUserProfile(urlToken);
  }

  render() {
    return null;
  }
}

export const reduxModule = {
  actions,
  reducers,
  initialState,
};

reducerRegistry.registerModule('myGfw', {
  actions,
  reducers,
  initialState,
});

export default withRouter(connect(null, actions)(MyGFWProvider));
