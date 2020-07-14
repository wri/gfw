import { useEffect } from 'react';
import { useRouter } from 'next/router';
import qs from 'query-string';

const URL = ({
  queryParams,
  options = {
    skipNull: true,
    skipEmptyString: true,
    arrayFormat: 'comma',
  },
}) => {
  const router = useRouter();
  const { pathname } = router;

  useEffect(() => {
    const queryParamsSerialized = qs.stringify(queryParams, options);

    router.replace(
      `${pathname}?${queryParamsSerialized}`,
      `${pathname}?${queryParamsSerialized}`,
      { shallow: true }
    );
  }, [queryParams]);

  return null;
};

export default URL;
