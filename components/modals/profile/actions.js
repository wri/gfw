import { createThunkAction } from 'redux/actions';
import useRouter from 'utils/router';

export const setProfileModalOpen = createThunkAction(
  'setProfileModalOpen',
  (open) => () => {
    const { query, pathname, pushQuery } = useRouter();

    pushQuery({
      pathname,
      query: {
        ...query,
        profile: open || null,
      },
    });
  }
);
