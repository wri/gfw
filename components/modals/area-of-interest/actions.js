import { createThunkAction } from 'redux/actions';
import useRouter from 'utils/router';

export const setAreaOfInterestModalSettings = createThunkAction(
  'setAreaOfInterestModalSettings',
  (id) => () => {
    const { query, pathname, pushQuery } = useRouter();

    pushQuery({
      pathname,
      query: {
        ...query,
        areaId: id || null,
      },
    });
  }
);
