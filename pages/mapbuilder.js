const MapBuilderPage = () => null;

export async function getStaticProps() {
  return {
    redirect: {
      destination: 'https://mapbuilder.wri.org',
      permanent: false,
    },
  };
}

export default MapBuilderPage;
