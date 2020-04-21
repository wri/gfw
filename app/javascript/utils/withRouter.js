import Router, { withRouter } from 'next/router';
import qs from 'query-string';
import { decodeUrlForState, encodeStateForUrl } from 'utils/stateToUrl';

const buildRouter = router => {
  if (router) {
    if (router.asPath.includes('?')) {
      router.query = {
        ...router.query,
        ...qs.parse(router.asPath.split('?')[1]),
      };
    }

    router.query = decodeUrlForState(router.query);

    const { location } = router?.query || {};
    if (location) {
      router.location = {
        type: location?.[0],
        adm0: location?.[1],
        adm1: location?.[2],
        adm2: location?.[3]
      }
    }

    router.pushDynamic = ({ pathname, query, hash }) => {
      let asPath = pathname;
      if (query) {
        Object.keys(query).forEach((key) => {
          if (asPath.includes(`[${key}]`)) {
            asPath = asPath.replace(`[${key}]`, query[key]);
            delete query[key];
          } else if (asPath.includes(`[...${key}]`)) {
            asPath = asPath.replace(`[...${key}]`, query[key]);
            delete query[key];
          }
        });
      }
      const queryString = encodeStateForUrl(query);
      router.push(
        `${pathname}${queryString ? `?${queryString}` : ''}${hash || ''}`,
        `${asPath}${queryString ? `?${queryString}` : ''}${hash || ''}`
      );
    };
  }

  return router;
}

export const router = buildRouter(Router.router);

export default (Component) =>
  withRouter(({ router: oldRouter, ...props }) => {
    const newRouter = buildRouter(oldRouter);

    return <Component {...props} router={newRouter} />;
  });
