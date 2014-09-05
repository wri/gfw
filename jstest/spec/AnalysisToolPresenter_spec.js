/**
 * Unit test coverage for AnalysisToolPresenter.
 */
define([
  'jquery',
  'underscore',
  'mps',
  'moment',
  'map/presenters/AnalysisToolPresenter',
  'helpers/baselayers',
  'helpers/analysis_resource'
], function($, _, mps, moment, Presenter) {

  /* global describe, it, expect, beforeEach, jasmine */

  'use strict';

  describe('AnalysisToolPresenter', function() {
    var presenter, viewSpy, layerSpec;

    layerSpec = {
      getBaselayers: function() {
        return baselayers;
      }
    };

    beforeEach(function() {
      viewSpy = {
        model: {
          set: jasmine.createSpy(),
        },
        $widgetBtn: jasmine.createSpyObj('$widgetBtn', ['toggleClass']),
        _fitBounds: jasmine.createSpy()
      };

      spyOn(Presenter.prototype, '_subscribe');
      presenter = new Presenter(viewSpy);
    });

    describe('Initialization', function() {
      it('subscribe to application events', function() {
        expect(Presenter.prototype._subscribe).toHaveBeenCalled();
      });

      it('is defined', function() {
        expect(presenter.status).toBeDefined();
        expect(presenter.status.toJSON()).toEqual({
          baselayer: null,
          analysis: null,
          currentDate: null,
          threshold: null,
          overlay: null,
          polygon: null,
          multipolygon: null,
          disableUpdating: false
        });
      });
    });

    describe('_setBaselayer()', function() {
      beforeEach(function() {
        presenter._setBaselayer(baselayers);
      });

      it('correctly set disabled widget button', function() {
        expect(viewSpy.$widgetBtn.toggleClass).toHaveBeenCalled();
        expect(viewSpy.$widgetBtn.toggleClass).toHaveBeenCalledWith('disabled', false);
        expect(viewSpy.$widgetBtn.toggleClass.calls.count()).toEqual(1);
      });

      it('correctly set baselayer', function() {
        expect(presenter.status.get('baselayer').slug).toEqual('umd_tree_loss_gain');
      });
    });

    describe('_publishAnalysis()', function() {
      beforeEach(function() {
        presenter.status.set('baselayer', _.findWhere(baselayers, {slug: 'umd_tree_loss_gain'}));
        presenter.status.set('threshold', 70);
        presenter.status.set('currentDate', [moment(), moment()]);
        presenter._publishAnalysis(AnalysisResource);
      });

      it('must create valid resource', function() {
        expect(presenter.status.get('analysis').thresh).toEqual('?thresh=70');
        expect(presenter.status.get('analysis').period).toEqual(moment().format('YYYY-MM-DD') + ',' + moment().format('YYYY-MM-DD'));
      });
    });
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
