import { createThunkAction } from 'redux/actions';
import { getLocationFromData } from 'utils/format';
import useRouter from 'utils/router';

import { track } from 'analytics';

import { setDashboardPromptsSettings } from 'components/prompts/dashboard-prompts/actions';

export const handleCategoryChange = createThunkAction(
  'handleCategoryChange',
  (category) => () => {
    const { query, asPath, pushQuery } = useRouter();

    pushQuery({
      pathname: asPath?.split('?')?.[0],
      query: {
        ...query,
        category,
        widget: undefined,
      },
    });
  }
);

export const handleLocationChange = createThunkAction(
  'handleLocationChange',
  (location) => (dispatch, getState) => {
    const { type, payload, query } = getState().location || {};
    const { pushQuery } = useRouter();

    const { data, layer } = location || {};
    const newQuery = {};

    if (query) {
      Object.keys(query).forEach((key) => {
        const queryObj = query[key] || {};
        if (typeof queryObj === 'object') {
          const { forestType, landCategory, page } = queryObj;
          newQuery[key] = {
            ...queryObj,
            ...(forestType && {
              forestType: '',
            }),
            ...(landCategory && {
              landCategory: '',
            }),
            ...(page && {
              page: 0,
            }),
          };
        } else {
          newQuery[key] = queryObj;
        }
      });
    }

    let newPayload = {};
    if (data) {
      const { cartodb_id, wdpaid } = data || {};
      const { analysisEndpoint, tableName } = layer || {};
      if (analysisEndpoint === 'admin') {
        newPayload = {
          type: payload.type === 'global' ? 'country' : payload.type,
          ...getLocationFromData(data),
        };
      } else if (analysisEndpoint === 'wdpa' && (cartodb_id || wdpaid)) {
        newPayload = {
          type: analysisEndpoint,
          adm0: wdpaid || cartodb_id,
        };
      } else if (cartodb_id && tableName) {
        newPayload = {
          type: 'use',
          adm0: tableName,
          adm1: cartodb_id,
        };
      }
    } else {
      const newAdminType = !location.adm0 ? 'global' : 'country';
      newPayload = {
        type:
          payload.type === 'global' || !location.adm0
            ? newAdminType
            : payload.type,
        ...location,
      };
    }

    pushQuery({
      pathname: `/dashboards/${Object.values(newPayload)?.join('/')}/`,
      query: {
        ...newQuery,
        widget: undefined,
        map: {
          ...(query && query.map),
          canBound: true,
        },
      },
    });

    track('changeDashboardLocation', {
      label: `${type === 'global' ? type : ''}${
        newPayload.adm0 ? ` ${newPayload.adm0}` : ''
      }${newPayload.adm1 ? `.${newPayload.adm1}` : ''}${
        newPayload.adm2 ? `.${newPayload.adm2}` : ''
      }`,
    });

    dispatch(
      setDashboardPromptsSettings({
        open: true,
        stepIndex: 0,
        stepsKey: 'dashboardAnalyses',
      })
    );
  }
);

export const clearScrollTo = createThunkAction('clearScrollTo', () => () => {
  const { query, asPath, pushQuery } = useRouter();
  pushQuery({
    pathname: asPath?.split('?')?.[0],
    query: {
      ...query,
      scrollTo: false,
    },
  });
});
