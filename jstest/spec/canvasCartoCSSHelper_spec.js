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
          var cssRegex = new RegExp("^#layer { marker-width: 1; marker-line-width: 0; marker-allow-overlap: true;");
          expect(css).toMatch(cssRegex);
        });

        it('generates cartocss with a rule for each day', function() {
          var expectedCss = "#layer { marker-width: 1; marker-line-width: 0; marker-allow-overlap: true; [date=\"2015-01-01\"] { marker-fill: rgba(1, 0, 0, 1); } [date=\"2015-01-02\"] { marker-fill: rgba(2, 0, 0, 1); } }";
          expect(css).toEqual(expectedCss);
        });
      });

      describe('given a start and end date spanning more than 255 days', function() {
        var css;

        beforeEach(function() {
          css = helper.generateDaily('date',
            moment('2015-01-01'), moment('2015-12-01'));
        });

        it('uses the G channel for the overflow', function() {
          var cssRegex = new RegExp("\\[date=\"2015-09-13\"\\] { marker-fill: rgba\\(0, 1, 0, 1\\); }");
          expect(css).toMatch(cssRegex);
        });
      });
    });
  });

});
