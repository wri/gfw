define([
  'services/AnalysisService',
  'mps', 
  'underscore',
  'nsa',
  'helpers/api_responses',
], function(service, mps, _, nsa) {

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
        var config = {iso: 'bra', thresh: 10, dataset: 'umd-loss-gain'};
        var uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/{iso}{?bust,dev,thresh}';

        expect(service._getUriTemplate(config)).toEqual(uriTemplate);
      });

      it('correctly returns URI template for subnational API', function() {
        var config = {iso: 'bra', id1: 1, thresh: 10,
          dataset: 'umd-loss-gain'};
        var uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/{iso}/{id1}{?bust,dev,thresh}';

        expect(service._getUriTemplate(config)).toEqual(uriTemplate);
      });   

      it('correctly returns null template for invalid config', function() {
        var config = {};
        var uriTemplate = null;

        expect(service._getUriTemplate(config)).toEqual(uriTemplate);
      });      
    });


    /**
     * Spec for testing _getUriTemplate().
     */
    describe('_getUrl()', function() {

      beforeEach(function() {
      });

      it('correctly returns URL for UMD national API', function() {
        var config = {dataset: 'umd-loss-gain', iso: 'bra', thresh: 10};
        var url = 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/bra?thresh=10';

        expect(service._getUrl(config)).toEqual(url);
      });

     it('correctly returns URL for UMD subnational API', function() {
        var config = {
          dataset: 'umd-loss-gain', iso: 'bra', id1: 1, thresh: 10};
        var url = 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/bra/1?thresh=10';

        expect(service._getUrl(config)).toEqual(url);
      });       

      it('correctly returns URL for FORMA national API', function() {
        var config = {
          dataset: 'forma-alerts', iso: 'bra'};
        var url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra';

        expect(service._getUrl(config)).toEqual(url);
      });        
  
      it('correctly returns URL for FORMA subnational API', function() {
        var config = {
          dataset: 'forma-alerts', iso: 'bra', id1: 1};
        var url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra/1';

        expect(service._getUrl(config)).toEqual(url);
      });     

      it('correctly returns URL for FORMA wdpa API', function() {
        var config = {
          dataset: 'forma-alerts', wdpaid: 1,};
        var url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/wdpa/1';

        expect(service._getUrl(config)).toEqual(url);
      });            

      it('correctly returns URL for FORMA use API', function() {
        var config = {
          dataset: 'forma-alerts', use: 'logging', useid: 1,};
        var url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/use/logging/1';

        expect(service._getUrl(config)).toEqual(url);
      });            

      it('correctly returns null URL for invalid config', function() {
        var config = {};
        var uriTemplate = null;

        expect(service._getUrl(config)).toEqual(uriTemplate);
      });        
    });    


    /**
     * Spec for testing execute().
     */
    describe('execute()', function() {
      var response = null;
      var callback = null;
      var config = {dataset: 'umd-loss-gain', iso: 'bra', thresh: 10};

      beforeEach(function(done) {
        jasmine.Ajax.install();
        nsa.test = true;

        // Mock MapServiceLayer and Router
        callback = {
          success: function(data) {
            response = data;
            done();
          }
        };
        spyOn(callback, 'success').and.callThrough();
        service.execute(config, callback.success);
        jasmine.Ajax.requests.mostRecent().response({
          "status": 200,
          "responseText": '"boom"'
        });
      });

      it('correctly executes callback with data', function() {
        expect(response).toEqual('boom');
      });
    });

  });
});