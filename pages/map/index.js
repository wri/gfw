import { useEffect } from 'react';
import useRouter from 'app/router';

export const getServerSideProps = ({ res }) => {
  res.setHeader('Location', '/map/global');
  return { props: {} };
};

const MapLocationPage = () => {
  useEffect(() => {
    const { push } = useRouter();
    push('/map/[...location]', '/map/global');
  });

  return 'Redirecting...';
};

export default MapLocationPage;
