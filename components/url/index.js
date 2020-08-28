import useDeepCompareEffect from 'use-deep-compare-effect';
import useRouter from 'utils/router';

import { encodeStateForUrl } from 'utils/stateToUrl';

const URL = ({
  queryParams = {},
  options = {
    skipNull: true,
    skipEmptyString: true,
    arrayFormat: 'comma',
  },
}) => {
  const { pathname, asPath, replace, query } = useRouter();

  let fullPathname = asPath?.split('?')?.[0];
  // If path is map and we have no location, we need to default to global
  if (pathname === '/map/[...location]' && fullPathname === '/map/') {
    fullPathname = '/map/global/';
  }

  useDeepCompareEffect(() => {
    if (query.location) {
      delete query.location;
    }

    if (query.token) {
      delete query.token;
    }

    const queryParamsSerialized = encodeStateForUrl(
      { ...query, ...queryParams },
      options
    );

    replace(
      `${pathname}${queryParamsSerialized ? `?${queryParamsSerialized}` : ''}`,
      `${fullPathname}${
        queryParamsSerialized ? `?${queryParamsSerialized}` : ''
      }`,
      {
        shallow: true,
      }
    );
  }, [queryParams]);

  return null;
};

export default URL;
