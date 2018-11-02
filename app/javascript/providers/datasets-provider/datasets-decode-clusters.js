const clusterDecodes = {
  userStories: data =>
    data &&
    data.data.map(d => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [d.attributes.lng, d.attributes.lat]
      },
      properties: d.attributes
    }))
};

export default {
  'ecddc53a-f7b9-42a8-9e7a-94a30aeef134': clusterDecodes.userStories
};
