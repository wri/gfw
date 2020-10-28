import { createThunkAction } from 'redux/actions';
import useRouter from 'utils/router';

export const setModalContactUsOpen = createThunkAction(
  'setModalContactUsOpen',
  (open) => () => {
    const { query, asPath, pushQuery } = useRouter();

    pushQuery({
      pathname: asPath?.split('?')?.[0],
      query: {
        ...query,
        contactUs: open || null,
      },
    });
  }
);
