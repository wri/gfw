import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { parse, stringify } from 'query-string';
import { withRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import reducerRegistry from 'redux/registry';

import { setUserToken, setServerCookie } from 'services/user';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

class MyGFWProvider extends PureComponent {
  static propTypes = {
    getUserProfile: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { getUserProfile, router } = this.props;
    const { push, asPath } = router;
    const query = parse(asPath.split('?')[1]);

    // facebook now append these charachter onto the token. We need to remove them.
    let urlToken = query?.token;
    if (urlToken?.includes('#_=_')) {
      urlToken = urlToken.replace('#_=_', '');
    }

    if (urlToken) {
      setUserToken(urlToken);
      setServerCookie(urlToken);

      delete query.token;
      push(
        `${asPath?.split('?')?.[0]}${
          !isEmpty(query) ? `?${stringify(query)}` : ''
        }`
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
