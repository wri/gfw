import { createThunkAction } from 'redux/actions';
import useRouter from 'utils/router';

export const setProfileModalOpen = createThunkAction(
  'setProfileModalOpen',
  (open) => () => {
    const { query, asPath, pushQuery } = useRouter();

    pushQuery({
      pathname: asPath?.split('?')?.[0],
      query: {
        ...query,
        profile: open || null,
      },
    });
  }
);
