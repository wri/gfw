/**
 * Unit test coverage for PlaceService.
 */
define([
  'map/services/PlaceService',
  'mps',
], function(PlaceService, mps) {

  'use strict';

  // describe('PlaceService', function() {
  //   var params, service, name = 'map';

  //   beforeEach(function() {
  //     service = new PlaceService();
  //   });

  //   describe('_getPresenterParams', function() {

  //     it('correctly get params from 0 registered presenters', function() {
  //       var results = service._getPresenterParams([]);
  //       expect(results).toEqual({});
  //     });

  //     it('correctly get params from 1 registered presenters', function() {
  //       var presenter = jasmine.createSpyObj('presenter', ['getPlaceParams']);
  //       var params = {boom: 'boom'};

  //       presenter.getPlaceParams.and.returnValue(params);
  //       expect(service._getPresenterParams([presenter])).toEqual(params);
  //     });

  //   });

  // });

  // describe('PlaceService Suite', function() {
  //   var params = null;
  //   var name = 'map';
  //   var service = null;

  //   beforeEach(function() {
  //     params = {
  //       zoom: '8',
  //       lat: '1.1',
  //       lng: '2',
  //       iso: 'idn',
  //       maptype: 'terrain',
  //       baselayers: 'loss',
  //       sublayers: '1,2,3',
  //       begin: '2014',
  //       end: '3014'
  //     };
  //   });

  //   /**
  //    * Spec for testing _getPresenterParams().
  //    */
  //   describe('_getPresenterParams()', function() {

  //     beforeEach(function() {
  //       service = new PlaceService({}, {});
  //     });

  //     it('correctly gets params from 0 registered presenters', function() {
  //       var resultParams = service._getPresenterParams([]);

  //       expect(resultParams).toEqual({});
  //     });

  //     it('correctly gets params from 1 registered presenters', function() {
  //       var presenter = jasmine.createSpyObj('presenter', ['getPlaceParams']);
  //       var params = {boom: 'boom'};

  //       presenter.getPlaceParams.and.returnValue(params);
  //       expect(service._getPresenterParams([presenter])).toEqual(params);
  //     });

  //     it('correctly gets params from 2 registered presenters', function() {
  //       var p1 = jasmine.createSpyObj('presenter', ['getPlaceParams']);
  //       var p2 = jasmine.createSpyObj('presenter', ['getPlaceParams']);
  //       var params1 = {boom: 'boom'};
  //       var params2 = {bam: 'bam'};
  //       var params = _.extend(params1, params2);

  //       p1.getPlaceParams.and.returnValue(params1);
  //       p2.getPlaceParams.and.returnValue(params2);
  //       expect(service._getPresenterParams([p1, p2])).toEqual(params);
  //     });
  //   });

  //   /**
  //    * Spec for testing _getRoute().
  //    */
  //   describe('_getRoute()', function() {

  //     beforeEach(function() {
  //       service = new PlaceService({}, {});
  //     });

  //     it('correctly returns route', function() {
  //       var r = 'map/8/1.10/2.00/idn/terrain/loss/1,2,3?begin=2014&end=3014';
  //       expect(service._getRoute('map', params)).toEqual(r);
  //     });
  //   });


  //   /**
  //    * Spec for testing _handleNewPlace().
  //    */
  //   describe('_handleNewPlace()', function() {
  //     var mockLayerService = null;
  //     var mockRouter = null;

  //     beforeEach(function() {
  //       // Mock Ajax since it will call MapServiceLayer
  //       jasmine.Ajax.install();

  //       // Mock MapServiceLayer and Router
  //       mockLayerService = {
  //         getLayers: function(where, successCb, errorCb) {
  //           successCb('layers');
  //         }
  //       };
  //       spyOn(mockLayerService, 'getLayers').and.callThrough();
  //       mockRouter = jasmine.createSpyObj('router', ['navigate']);

  //       service = new PlaceService(mockLayerService, mockRouter);
  //     });

  //     // it('correctly publishes Place/go event when go is true', function(done) {
  //     //   mps.subscribe('Place/go', function(place) {
  //     //     expect(place.params).toEqual(jasmine.objectContaining({
  //     //       zoom: 8,
  //     //       lat: 1.1,
  //     //       lng: 2,
  //     //       iso: 'idn',
  //     //       maptype: 'terrain',
  //     //       begin: 2014,
  //     //       end: 3014,
  //     //       layers: 'layers'
  //     //     }));
  //     //   });
  //     //   service._handleNewPlace('map', params, true);
  //     //   done();
  //     // });

  //     it('correctly calls router.navigate when go is false', function() {
  //       var r = 'map/8/1.10/2.00/idn/terrain/loss/1,2,3?begin=2014&end=3014';

  //       service._handleNewPlace('map', params, false);
  //       expect(mockRouter.navigate).toHaveBeenCalledWith(r, {silent: true});
  //     });
  //   });


  //    /**
  //    * Spec for testing _formatUrl().
  //    */
  //   describe('_formatUrl()', function() {

  //     beforeEach(function() {
  //       service = new PlaceService({}, {});
  //     });

  //     it('correctly handles lat/lng strings', function() {
  //       expect(service._formatUrl('map', {lat: '1.234567', lng: '2.34567'})).
  //         toEqual({lat: '1.23', lng: '2.35'});
  //     });

  //     it('correctly handles lat/lng decimals', function() {
  //       expect(service._formatUrl('map', {lat: 1.23456789, lng: 2.3456789})).
  //         toEqual({lat: '1.23', lng: '2.35'});
  //     });

  //     it('correctly handles lat/lng integers', function() {
  //       expect(service._formatUrl('map', {lat: 1, lng: 2})).
  //         toEqual({lat: '1.00', lng: '2.00'});
  //     });

  //     it('correctly handles lat/lng with non-map route name', function() {
  //       expect(service._formatUrl('foo', {lat: 1, lng: 2})).
  //         toEqual({lat: 1, lng: 2});
  //     });
  //   });

  //  /**
  //    * Spec for testing _getBaselayerFilters().
  //    */
  //   describe('_getBaselayerFilters()', function() {

  //     beforeEach(function() {
  //       service = new PlaceService({}, {});
  //     });

  //     it('correctly returns filter for single layer', function() {
  //       var f1 = {slug: '1', category_slug: 'forest_clearing'};
  //       var f2 = {slug: '2', category_slug: 'forest_clearing'};

  //       expect(service._getBaselayerFilters('')).toEqual([]);
  //       expect(service._getBaselayerFilters('1')).toEqual([f1]);
  //       expect(service._getBaselayerFilters('1,2')).toEqual([f1, f2]);
  //     });
  //   });


  //  /**
  //    * Spec for testing _getSublayerFilters().
  //    */
  //   describe('_getSublayerFilters()', function() {

  //     beforeEach(function() {
  //       service = new PlaceService({}, {});
  //     });

  //     it('correctly returns filter for single layer', function() {
  //       var f1 = {id: 1};
  //       var f2 = {id: 2};

  //       expect(service._getSublayerFilters('')).toEqual([]);
  //       expect(service._getSublayerFilters('1')).toEqual([f1]);
  //       expect(service._getSublayerFilters('1,2')).toEqual([f1, f2]);
  //     });
  //   });


  //   /**
  //    * Spec for testing _standardizeParams().
  //    */
  //   describe('_standardizeParams()', function() {

  //     beforeEach(function() {
  //       service = new PlaceService({}, {});
  //     });

  //     it('correctly standardizes input parameters', function() {
  //       var resultParams = service._standardizeParams(params);

  //       expect(resultParams).toEqual(jasmine.objectContaining({
  //         zoom: 8,
  //         lat: 1.1,
  //         lng: 2,
  //         iso: 'idn',
  //         maptype: 'terrain',
  //         begin: 2014,
  //         end: 3014
  //       }));
  //     });

  //     it('correctly adds a default ALL iso parameter', function() {
  //       var testParams = _.omit(params, 'iso');
  //       var resultParams = service._standardizeParams(testParams);

  //       expect(resultParams).toEqual(jasmine.objectContaining({
  //         zoom: 8,
  //         lat: 1.1,
  //         lng: 2,
  //         iso: 'ALL',
  //         maptype: 'terrain',
  //         begin: 2014,
  //         end: 3014
  //       }));
  //     });
  //   });

  //   describe('Test Place/register event', function() {
  //     var presenter = {name: 'presenter'};

  //     beforeEach(function() {
  //       service = new PlaceService({}, {});
  //       mps.publish('Place/register', [presenter]);
  //     });

  //     it('Presenter registered', function() {
  //       expect(service._presenters[1]).toEqual(presenter);
  //     });
  //   });
  // });
});
