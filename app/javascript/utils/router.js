import Router from 'next/router';
import qs from 'query-string';
import compact from 'lodash/compact';

import { decodeParamsForState, encodeStateForUrl } from './stateToUrl';

export default () => {
  const router = Router.router || {};

  if (router) {
    if (router?.asPath?.includes('?')) {
      router.query = {
        ...router.query,
        ...qs.parse(router.asPath.split('?')[1]),
      };
    }

    router.query = router.query ? decodeParamsForState(router.query) : {};
  }

  router.pushQuery = ({ pathname, query, hash, options }) => {
    let asPath = pathname;
    if (query) {
      Object.keys(query).forEach((key) => {
        if (asPath?.includes(`[${key}]`)) {
          asPath = asPath.replace(`[${key}]`, query[key]);
          delete query[key];
        } else if (asPath?.includes(`[...${key}]`)) {
          asPath = asPath.replace(`[...${key}]`, compact(query[key]).join('/'));
          delete query[key];
        }
      });
    }

    const queryString = encodeStateForUrl(query, {
      skipNull: true,
      skipEmptyString: true,
      arrayFormat: 'comma',
    });

    router.push(
      `${pathname}${queryString ? `?${queryString}` : ''}${hash || ''}`,
      `${asPath}${queryString ? `?${queryString}` : ''}${hash || ''}`,
      options
    );
  };

  return { ...Router, ...router };
};
