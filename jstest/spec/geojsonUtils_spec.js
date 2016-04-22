define([
  'helpers/geojsonUtilsHelper'
], function(geojsonUtils) {

  describe('.featureCollectionToFeature', function() {

    describe('given a feature collection', function() {
      var featureCollection = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": [
                [
                  [ 22.3242, 4.5655 ],
                  [ 25.6641, -0.3516 ],
                  [ 20.5664, -3.8643 ],
                  [ 22.3242, 4.5655 ]
                ]
              ]
            }
          }
        ]
      };

      var feature = {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [ 22.3242, 4.5655 ],
                [ 25.6641, -0.3516 ],
                [ 20.5664, -3.8643 ],
                [ 22.3242, 4.5655 ]
              ]
            ]
          }
      };

      it('combines the given features in to a single feature', function() {
        var actualFeatureCollection = geojsonUtils.featureCollectionToFeature(featureCollection);
        expect(actualFeatureCollection).toEqual(feature);
      });
    });

    describe('given a geometry', function() {

      it('returns the given geometry', function() {
        expect(geojsonUtils.featureCollectionToFeature({})).toEqual({});
      });

    });

  });

});
