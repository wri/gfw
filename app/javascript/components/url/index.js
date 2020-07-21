import useDeepCompareEffect from 'use-deep-compare-effect';
import { useRouter } from 'next/router';

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
  useDeepCompareEffect(() => {
    if (query.pushed) {
      delete query.pushed;
    }

    const queryParamsSerialized = encodeStateForUrl(
      { ...query, ...queryParams },
      options
    );
    const fullPathname = asPath?.split('?')?.[0];

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
