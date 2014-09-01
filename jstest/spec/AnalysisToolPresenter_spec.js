/**
 * Unit test coverage for AnalysisToolPresenter.
 */
define([
  'jquery',
  'underscore',
  'mps',
  'presenters/AnalysisToolPresenter'
], function($, _, mps, Presenter) {

  /* global describe, it, expect, beforeEach, jasmine */

  'use strict';

  describe('AnalysisToolPresenter', function() {
    var presenter = null;
    var viewSpy = {};

    beforeEach(function() {
      presenter = new Presenter(this.viewSpy);
    });

    describe('StatusModel', function() {
      it('is defined', function() {
        expect(presenter.status).toBeDefined();
      });

      it('correct default values', function() {
        expect(presenter.status.toJSON()).toEqual({
          baselayer: null,
          analysis: null,
          currentDate: null,
          threshold: null,
          overlay: null,
          polygon: null,
          multipolygon: null
        });
      });
    });

    // describe('_publishAnalysis', function() {
    //   it('analysis resource constructed correctly', function() {

    //   });

    //   it('publish analysis correctly', function() {

    //   });

    //   it("publish 'Place/update' to update the url with the current analysis", function() {

    //   });
    // });

  });

});

// var LatLng = function(lat, lng) {
//   return {
//     lng: function() {
//       return lat;
//     },
//     lat: function() {
//       return lng;
//     }
//   };
// };

// var getPath = function() {
//   var path = _.map(_.range(4), function(i) {
//     return new LatLng(i, i + 1);
//   });

//   return path;
// };

// describe('AnalysisToolPresenter', function() {

//   describe('createGeoJson()', function() {
//     it('correctly returns request id for valid config', function() {

//     });
//   });

//   describe('mps', function() {
//     var presenter = new Presenter({});


//     beforeEach(function() {});

//     it('correctly generates GeoJSON string', function(done) {
//       var path = getPath();
//       var geojson = presenter.createGeoJson(path);

//       jasmine.Ajax.uninstall();

//       $.ajax({
//         url: 'http://geojsonlint.com/validate',
//         type: 'POST',
//         data: geojson,
//         dataType: 'json',
//         success: function(data) {
//           expect(data.status).toEqual('ok');
//           done();
//         },
//         error: function(error) {
//           throw error;
//         }
//       });
//     });
//   });
// });
