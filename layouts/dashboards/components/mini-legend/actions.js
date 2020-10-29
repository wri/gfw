import { createThunkAction } from 'redux/actions';
import useRouter from 'utils/router';

export const setMainMapView = createThunkAction(
  'setMainMapView',
  (datasets) => () => {
    const { query, pushQuery } = useRouter();
    const { map, mainMap } = query || {};

    pushQuery({
      pathname: `/map/${query?.location?.join('/')}/`,
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
