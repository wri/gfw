import useDeepCompareEffect from 'use-deep-compare-effect';
import useRouter from 'utils/router';

import { encodeQueryParams } from 'utils/url';

const URL = ({
  queryParams = {},
  options = {
    skipNull: true,
    skipEmptyString: true,
    arrayFormat: 'comma',
  },
}) => {
  const { pathname, asPath, replace, query } = useRouter();

  const fullPathname = asPath?.split('?')?.[0];

  useDeepCompareEffect(() => {
    if (query.location) {
      delete query.location;
    }

    if (query.token) {
      delete query.token;
    }

    const queryParamsSerialized = encodeQueryParams(
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
