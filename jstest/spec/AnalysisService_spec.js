define([
  'services/AnalysisService',
  'mps', 
  'underscore',
  'helpers/api_responses',
], function(service, mps, _) {

  'use strict';

  var k_combinations = function(set, k) {
    var i, j, combs, head, tailcombs;
    
    if (k > set.length || k <= 0) {
      return [];
    }
    
    if (k === set.length) {
      return [set];
    }
    
    if (k === 1) {
      combs = [];
      for (i = 0; i < set.length; i++) {
        combs.push([set[i]]);
      }
      return combs;
    }
    
    combs = [];
    for (i = 0; i < set.length - k + 1; i++) {
      head = set.slice(i, i+1);
      tailcombs = k_combinations(set.slice(i + 1), k - 1);
      for (j = 0; j < tailcombs.length; j++) {
        combs.push(head.concat(tailcombs[j]));
      }
    }
    return combs;
  };
   
  var combinations = function(set) {
    var k, i, combs, k_combs;
    combs = [];
    
    // Calculate all non-empty k-combinations
    for (k = 1; k <= set.length; k++) {
      k_combs = k_combinations(set, k);
      for (i = 0; i < k_combs.length; i++) {
        combs.push(k_combs[i]);
      }
    }
    return combs;
  };

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
  var reduce_params = function(combo) {
    return _.reduceRight(
      combo, 
      function(memo, pair) {
        memo[pair[0]] = pair[1]; 
        return memo;
      },
      {});
  };

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
  var param_combos = function(params) {
    var combos = combinations(params);
    return _.map(combos, reduce_params);
  };

  describe('AnalysisService Suite', function() {


    /**
     * Spec for testing _getUriTemplate().
     */
    describe('_getUriTemplate()', function() {

      beforeEach(function() {
      });

      it('correctly returns URI template for national API', function() {
        var config = {iso: 'bra', thresh: 10};
        var uriTemplate =  'http://{host}/forest-change/{dataset}/admin{/iso}{?period,download,bust,dev,thresh}';

        expect(service._getUriTemplate(config)).toEqual(uriTemplate);
      });
    });
  });
});