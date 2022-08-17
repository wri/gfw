import { useEffect } from 'react';
import { useRouter } from 'next/router';

const MapBuilderPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('https://mapbuilder.wri.org');
  });

  return null;
};

export default MapBuilderPage;
