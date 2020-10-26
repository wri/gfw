import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import useRouter from 'utils/router';

import { registerModule } from 'redux/store';

import { decodeParamsForState, encodeStateForUrl } from 'utils/stateToUrl';

import * as actions from './actions';
import reducers, { initialState } from './reducers';

const getLocationFromParams = (url, params, asPath) => {
  if (url?.includes('[[...location]]')) {
    const type =
      asPath === '/map' || asPath === '/map/' || asPath?.includes('/map/?')
        ? 'global'
        : params?.location?.[0];
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

const buildNewLocation = () => {
  const { query, pathname, asPath } = useRouter();
  const search = encodeStateForUrl(query);
  const decodedQuery = query && decodeParamsForState(query);
  const location =
    decodedQuery && getLocationFromParams(pathname, decodedQuery, asPath);

  return {
    pathname,
    payload: location,
    search,
    ...(!isEmpty(decodedQuery) && { query: decodedQuery }),
  };
};

const LocationProvider = ({ setLocation }) => {
  registerModule({
    key: 'location',
    reducers,
    initialState,
  });

  const { events } = useRouter();

  const handleRouteChange = () => {
    const newLocation = buildNewLocation();
    setLocation(newLocation);
  };

  useEffect(() => {
    handleRouteChange();

    if (events) {
      events.on('routeChangeComplete', () => handleRouteChange());

      return () => {
        events.off('routeChangeComplete');
      };
    }

    return null;
  }, []);

  return null;
};

LocationProvider.propTypes = {
  setLocation: PropTypes.func,
  setMapSettings: PropTypes.func,
  setMainMapSettings: PropTypes.func,
  setMenuSettings: PropTypes.func,
  setAnalysisSettings: PropTypes.func,
  urlParams: PropTypes.object,
};

export default connect(null, actions)(LocationProvider);
