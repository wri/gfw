/**
 * Unit test coverage for AnalysisService.
 */
define([
  'underscore',
  'mps',
  'map/services/AnalysisService',
  'helpers/api_responses',
], function(_, mps, service) {

  /* global describe, it, expect, afterEach, beforeEach, jasmine, spyOn */

  'use strict';

  describe('AnalysisService', function() {

    describe('_getId()', function() {
      it('correctly returns request id for valid config', function() {
        var id = null;

        id = service._getId({dataset: 'foo', 'iso': 'bar'});
        expect(id).toEqual('foo:national');
        id = service._getId({dataset: 'foo', iso: 'bar', id1: 1});
        expect(id).toEqual('foo:subnational');
        id = service._getId({dataset: 'foo', geojson: 'geojson'});
        expect(id).toEqual('foo:world');
        id = service._getId({dataset: 'foo', wdpaid: 1});
        expect(id).toEqual('foo:wdpa');
        id = service._getId({dataset: 'foo', use: 'foo'});
        expect(id).toEqual('foo:use');
        id = service._getId({dataset: 'foo'});
        expect(id).toEqual(null);
      });
    });

    describe('mps', function() {
      var data, callback;
      var config = {dataset: 'umd-loss-gain', iso: 'bra', thresh: 10};

      beforeEach(function(done) {
        jasmine.Ajax.install();
        // Disable caching and redefine requests
        service._cacheConfig = null;
        service._defineRequests();

        callback = {
          success: function(results) {
            data = results;
            done();
          }
        };

        mps.subscribe('AnalysisService/results', callback.success);
        spyOn(callback, 'success').and.callThrough();
        mps.publish('AnalysisService/get', [config]);
        jasmine.Ajax.requests.mostRecent().response({
          'status': 200,
          'responseText': '"boom"'
        });
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it('correctly executes callback with data', function() {
        expect(data).toEqual('boom');
      });
    });

  });
});

// var k_combinations = function(set, k) {
//   var i, j, combs, head, tailcombs;

//   if (k > set.length || k <= 0) {
//     return [];
//   }

//   if (k === set.length) {
//     return [set];
//   }

//   if (k === 1) {
//     combs = [];
//     for (i = 0; i < set.length; i++) {
//       combs.push([set[i]]);
//     }
//     return combs;
//   }

//   combs = [];
//   for (i = 0; i < set.length - k + 1; i++) {
//     head = set.slice(i, i+1);
//     tailcombs = k_combinations(set.slice(i + 1), k - 1);
//     for (j = 0; j < tailcombs.length; j++) {
//       combs.push(head.concat(tailcombs[j]));
//     }
//   }
//   return combs;
// };

// var combinations = function(set) {
//   var k, i, combs, k_combs;
//   combs = [];

//   // Calculate all non-empty k-combinations
//   for (k = 1; k <= set.length; k++) {
//     k_combs = k_combinations(set, k);
//     for (i = 0; i < k_combs.length; i++) {
//       combs.push(k_combs[i]);
//     }
//   }
//   return combs;
// };

/**
 * Reduce supplied array of param arrays into a single object.
 *
 * > var params = [['a', 1], ['b', 2]];
 * > reduce_params(params);
 * {a: 1, b: 2}
 *
 * @param  {array} array of param arrays (e.g., [['a', 1], ['b', 2]])
 * @return {object} params as object (e.g., {a: 1, b:2})
 */
// var reduce_params = function(combo) {
//   return _.reduceRight(
//     combo,
//     function(memo, pair) {
//       memo[pair[0]] = pair[1];
//       return memo;
//     },
//     {});
// };

/**
 * Return array of objects for all combinations of supplied params array.
 *
 * > get_config_combos([['a', 1], ['b', 2], ['c', 3]]);
 * [ { a: 1 },
 *   { b: 2 },
 *   { c: 3 },
 *   { b: 2, a: 1 },
 *   { c: 3, a: 1 },
 *   { c: 3, b: 2 },
 *   { c: 3, b: 2, a: 1 } ]
 *
 * @param  {array} params array of params [key, value]
 * @return {array} array of param objects
 */
// var param_combos = function(params) {
//   var combos = combinations(params);
//   return _.map(combos, reduce_params);
// };
