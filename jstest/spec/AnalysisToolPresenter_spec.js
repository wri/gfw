/**
 * Unit test coverage for AnalysisToolPresenter.
 */
define([
  'jquery',
  'presenters/AnalysisToolPresenter',
  'mps',
  'underscore',
  'helpers/api_responses',
], function($, Presenter, mps, _) {

  /* global describe, it, expect, beforeEach, jasmine */

  'use strict';

  var LatLng = function(lat, lng) {
    return {
      lng: function() {return lat;},
      lat: function() {return lng;}
    };
  };

  var getPath = function() {
    var path = _.map(_.range(4), function(i) {
      return new LatLng(i, i+1);
    });

    return path;
  };

  describe('presenters/AnalysisToolPresenter', function() {

    describe('createGeoJson()', function() {
      it('correctly returns request id for valid config', function() {

      });
    });

    describe('mps', function() {
      var presenter = new Presenter({});


      beforeEach(function() {
      });

      it('correctly generates GeoJSON string', function(done) {
        var path = getPath();
        var geojson = presenter.createGeoJson(path);

        jasmine.Ajax.uninstall();

        $.ajax({
          url: 'http://geojsonlint.com/validate',
          type: 'POST',
          data: geojson,
          dataType: 'json',
          success: function(data) {
            expect(data.status).toEqual('ok');
            done();
          },
          error: function(error) {
            throw error;
          }
        });
      });
    });
  });
});
