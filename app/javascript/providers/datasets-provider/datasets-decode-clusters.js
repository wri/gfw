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
    })
};

export default {
  'ecddc53a-f7b9-42a8-9e7a-94a30aeef134': clusterDecodes.userStories
};
