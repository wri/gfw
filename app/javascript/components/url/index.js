import useDeepCompareEffect from 'use-deep-compare-effect';
import { useRouter } from 'next/router';

import { encodeStateForUrl } from 'utils/stateToUrl';

const URL = ({
  queryParams,
  options = {
    skipNull: true,
    skipEmptyString: true,
    arrayFormat: 'comma',
  },
}) => {
  const { pathname, replace, query } = useRouter();

  useDeepCompareEffect(() => {
    const queryParamsSerialized = encodeStateForUrl(
      { ...queryParams, location: '' },
      options
    );

    const fullPathname = pathname.replace(
      '[...location]',
      query?.location?.join('/')
    );

    replace(
      `${pathname}`,
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
