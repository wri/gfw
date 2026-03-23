import axios from 'axios';

const PTW_GEOJSON_URL =
  'https://wri-users.s3.us-east-1.amazonaws.com/aberger/places_to_watch/places_to_watch.geojson';

export const getPlacesToWatch = async () => {
  try {
    const { data } = await axios.get(PTW_GEOJSON_URL);

    const transformedData = data.features.map((feature) => {
      const TYPE_MAP = {
        Article: 'mongabay',
        Soy: 'soy',
        Oil_palm: 'palm',
      };

      const {
        ID,
        type,
        bbox,
        title,
        description,
        image_link,
        image_credit,
        article_link: link,
        geometry,
      } = feature.properties;

      return {
        ptw_id: ID,
        type: TYPE_MAP[type],
        bbox: JSON.stringify(bbox),
        name: title,
        description,
        image: image_link,
        image_source: image_credit,
        link,
        geometry,
      };
    });

    return transformedData;
  } catch (error) {
    console.error('Error fetching GeoJSON:', error);
    return null;
  }
};

export default {
  getPlacesToWatch,
};
