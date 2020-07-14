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
  const { pathname, asPath, replace } = useRouter();

  useDeepCompareEffect(() => {
    const queryParamsSerialized = encodeStateForUrl(queryParams, options);
    const fullPathname = asPath?.split('?')?.[0];

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
