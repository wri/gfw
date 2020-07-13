import { createThunkAction } from 'utils/redux';
import useRouter from 'utils/router';

export const setMainMapView = createThunkAction(
  'setMainMapView',
  (datasets) => () => {
    const { query, pushQuery } = useRouter();
    const { map, mainMap } = query || {};

    pushQuery({
      pathname: '/map/[...location]',
      query: {
        ...query,
        map: {
          ...map,
          datasets,
          canBound: true,
        },
        mainMap: {
          ...mainMap,
          showAnalysis: true,
        },
      },
    });
  }
);
