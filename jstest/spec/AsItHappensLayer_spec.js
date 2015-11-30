/**
 * Unit tests for the AsItHappensLayer class.
 */
define([
  'map/views/layers/AsItHappensLayer',
], function(AsItHappensLayer) {

  describe('AsItHappensLayer', function() {
    it('exists', function() {
      expect(AsItHappensLayer).toBeDefined();
    });

    describe('.filterCanvasImgdata', function() {
      var layer,
          result;

      // 3x3 RGBA pixels
      var imageData = [
        0,0,0,0,    4,0,0,0,  0,0,0,0,
        254,0,0,0,  0,0,0,0,  0,50,0,0,
        0,0,0,0,    0,0,0,0,  0,0,0,0
      ];

      beforeEach(function() {
        var dates = [moment('2015-01-01'), moment('2015-10-14')];
        layer = new AsItHappensLayer({}, {currentDate: dates});
        layer.timelineExtent = dates;
        layer.filterCanvasImgdata(imageData, 3, 3, 10);
      });

      it('sets the alpha channel to 0 for pixels outside of the range', function() {
        expect(imageData[3]).toEqual(0);
        expect(imageData[11]).toEqual(0);
        expect(imageData[19]).toEqual(0);
        expect(imageData[23]).toEqual(0);
        expect(imageData[27]).toEqual(0);
        expect(imageData[31]).toEqual(0);
        expect(imageData[35]).toEqual(0);
      });

      it('sets the alpha channel to 255 for pixels inside of the range', function() {
        expect(imageData[7]).toEqual(255);
        expect(imageData[15]).toEqual(255);
      });

      it('sets the R & G channels correctly for pixels inside of the range', function() {
        // Expecting these magic values is a bit funky,
        // but at least allows for the method under test to be
        // refactored safely
        expect(imageData[4]).toEqual(220);
        expect(imageData[5]).toEqual(87.39513353563818);
        expect(imageData[6]).toEqual(150.5);

        expect(imageData[12]).toEqual(220);
        expect(imageData[13]).toEqual(87.39513353563818);
        expect(imageData[14]).toEqual(150.5);
      });
    });
  });

});
