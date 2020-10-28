import { createThunkAction } from 'redux/actions';
import useRouter from 'utils/router';

export const setAreaOfInterestModalSettings = createThunkAction(
  'setAreaOfInterestModalSettings',
  (id) => () => {
    const { query, asPath, pushQuery } = useRouter();

    pushQuery({
      pathname: asPath?.split('?')?.[0],
      query: {
        ...query,
        areaId: id || null,
      },
    });
  }
);
