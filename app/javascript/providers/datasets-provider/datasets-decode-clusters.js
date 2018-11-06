const clusterDecodes = {
  userStories: data =>
    data &&
    data.data.map(d => {
      const imageObj =
        d.attributes.media && d.attributes.media.find(i => i.url);

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.attributes.lng, d.attributes.lat]
        },
        properties: {
          ...d.attributes,
          linkId: d.id,
          media: imageObj && imageObj.url
        }
      };
    }),
  mongabayStories: data =>
    data &&
    data.rows.map(d => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [d.lon, d.lat]
      },
      properties: d
    })),
  earthJournalismStories: data =>
    data &&
    data.rows.map(d => {
      const geometry = JSON.parse(d.st_asgeojson);
      return {
        type: 'Feature',
        geometry,
        properties: d
      };
    })
};

export default {
  'ecddc53a-f7b9-42a8-9e7a-94a30aeef134': clusterDecodes.userStories,
  'e097ebfe-56d9-4564-8e2a-d3328bdaea38': clusterDecodes.mongabayStories,
  '2f4d9b87-6629-4658-8175-87d7892a5f32': clusterDecodes.earthJournalismStories
};
