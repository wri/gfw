import Layout from 'app/layouts/root';
import Map from 'pages/map';

import { getLocationData } from 'services/location';

export const getServerSideProps = async (ctx) => {
  let locationData = {};
  try {
    locationData = await getLocationData(ctx?.params?.location);
  } catch (err) {
    locationData = {};
  }

  const { locationName } = locationData || {};

  return {
    props: {
      title: `${
        locationName ? `${locationName} ` : ''
      }Interactive World Forest Map & Tree Cover Change Data | GFW`,
      description: `Explore the state of forests ${
        locationName ? `in ${locationName}` : 'worldwide'
      } by analyzing tree cover change on GFW’s interactive global forest map using satellite data. Learn about deforestation rates and other land use practices, forest fires, forest communities, biodiversity and much more.`,
      keywords: `${locationName}, Interactive world forest map, tree cover map, tree cover change, data, global forest cover change, satellite monitoring, deforestation, land use, forest communities, biodiversity`,
    },
  };
};

const MapPage = (props) => (
  <Layout {...props} fullScreen showFooter={false}>
    <Map />
  </Layout>
);

export default MapPage;
