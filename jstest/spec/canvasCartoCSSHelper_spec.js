define([
  'moment',
  'helpers/canvasCartoCSSHelper'
], function(moment, helper) {

  'use strict';

  describe('canvasCartoCSSHelper', function() {
    it('exists', function() {
      expect(helper).toBeDefined();
    });

    describe('.generateDaily', function() {
      describe('given a start and end date', function() {
        var css;

        beforeEach(function() {
          css = helper.generateDaily('date',
            moment('2015-01-01'), moment('2015-01-02'));
        });

        it('generates cartocss with default layer rules', function() {
          var expectedCss = "#layer { marker-fill-opacity: 1;marker-line-width: 0;marker-placement: point;marker-width: 1;marker-height: 1;marker-allow-overlap: true";
          expect(css.indexOf(expectedCss)).toBeGreaterThan(-1);
        });
      });
    });
  });

});
