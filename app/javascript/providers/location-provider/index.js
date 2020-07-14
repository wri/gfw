import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import useRouter from 'utils/router';
import reducerRegistry from 'app/registry';

import { decodeParamsForState, encodeStateForUrl } from 'utils/stateToUrl';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const getLocationFromParams = (url, params) => {
  if (url?.includes('[...location]')) {
    const type = params?.location?.[0];
    const adm0 = params?.location?.[1];
    const adm1 = params?.location?.[2];
    const adm2 = params?.location?.[3];

    return {
      type,
      adm0: isNaN(adm0) ? adm0 : parseInt(adm0, 10),
      adm1: isNaN(adm1) ? adm1 : parseInt(adm1, 10),
      adm2: isNaN(adm2) ? adm2 : parseInt(adm2, 10),
    };
  }

  const location =
    params &&
    Object.keys(params).reduce((obj, key) => {
      if (url?.includes(`[${key}]`)) {
        return {
          ...obj,
          [key]: params[key],
        };
      }

      return obj;
    }, {});

  return location;
};

class LocationProvider extends PureComponent {
  static propTypes = {
    setLocation: PropTypes.func,
  };

  handleRouteChange = () => {
    const { router } = useRouter();
    const { query, pathname } = router;
    const search = encodeStateForUrl(query);
    const decodedQuery = query && decodeParamsForState(query);
    const location =
      decodedQuery && getLocationFromParams(pathname, decodedQuery);

    this.props.setLocation({
      pathname,
      payload: location,
      search,
      ...(!isEmpty(decodedQuery) && { query: decodedQuery }),
    });
  };

  componentDidMount() {
    const { router } = useRouter();

    this.handleRouteChange();

    router.events.on('routeChangeComplete', () => {
      this.handleRouteChange();
    });
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

reducerRegistry.registerModule('location', {
  actions,
  reducers,
  initialState,
});

export default connect(null, actions)(LocationProvider);
