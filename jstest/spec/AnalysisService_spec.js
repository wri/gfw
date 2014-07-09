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

      
      // quicc-alerts
      it('correctly returns URI template for quicc-alerts', function() {
        var config = null;
        var uriTemplate = null;

        // World
        config = {geojson: 'foo', dataset: 'quicc-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts{?geojson,period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        // National
        config = {iso: 'bra', dataset: 'quicc-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/admin/{iso}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        // Subnational
        config = {iso: 'bra', id1: '1', dataset: 'quicc-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/admin/{iso}/{id1}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);    

        // WDPA
        config = {wdpaid: '1', dataset: 'quicc-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/wdpa/{wdpaid}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        // USE
        config = {use: 'loggging', useid: '1', dataset: 'quicc-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/use/{use}/{useid}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);                        
      });


      // nasa-active-fires
      it('correctly returns URI template for nasa-active-fires', function() {
        var config = null;
        var uriTemplate = null;
        
        // World
        config = {geojson: 'foo', dataset: 'nasa-active-fires'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires{?geojson,period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        // National
        config = {iso: 'bra', dataset: 'nasa-active-fires'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/admin/{iso}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        // Subnational
        config = {iso: 'bra', id1: '1', dataset: 'nasa-active-fires'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/admin/{iso}/{id1}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);    

        // WDPA
        config = {wdpaid: '1', dataset: 'nasa-active-fires'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/wdpa/{wdpaid}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        // USE
        config = {use: 'loggging', useid: '1', dataset: 'nasa-active-fires'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/use/{use}/{useid}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);                        
      });

      // forma-alerts
      it('correctly returns URI template for forma-alerts', function() {
        var config = null;
        var uriTemplate = null;

        // World
        config = {geojson: 'foo', dataset: 'forma-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts{?geojson,period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        // National
        config = {iso: 'bra', dataset: 'forma-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/{iso}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        // Subnational
        config = {iso: 'bra', id1: '1', dataset: 'forma-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/{iso}/{id1}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);    

        // WDPA
        config = {wdpaid: '1', dataset: 'forma-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/wdpa/{wdpaid}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        // USE
        config = {use: 'loggging', useid: '1', dataset: 'forma-alerts'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/use/{use}/{useid}{?period,bust,dev}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);                        
      });

      // umd-loss-gain
      it('correctly returns URI template for umd-loss-gain', function() {
        var config = null;
        var uriTemplate = null;

        // National
        config = {iso: 'bra', thresh: 10, dataset: 'umd-loss-gain'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/{iso}{?bust,dev,thresh}';
        expect(service._getUriTemplate(config)).toEqual(uriTemplate);

        config = {iso: 'bra', id1: 1, thresh: 10, dataset: 'umd-loss-gain'};
        uriTemplate = 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/{iso}/{id1}{?bust,dev,thresh}';
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

      // umd-loss-gain
      it('correctly returns URL for umd-loss-gain', function() {
        var config = null;
        var url = null;

        // National
        config = {dataset: 'umd-loss-gain', iso: 'bra', thresh: 10};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/bra?thresh=10';
        expect(service._getUrl(config)).toEqual(url);

        // Subnational
        config = {
          dataset: 'umd-loss-gain', iso: 'bra', id1: 1, thresh: 10};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/umd-loss-gain/admin/bra/1?thresh=10';
        expect(service._getUrl(config)).toEqual(url);
      });


      // forma-alerts
      it('correctly returns URL for forma-alerts', function() {
        var config = null;
        var url = null;

        // World
        config = {dataset: 'forma-alerts', geojson: 'foo'};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts?geojson=foo';
        expect(service._getUrl(config)).toEqual(url);

        // National
        config = {dataset: 'forma-alerts', iso: 'bra'};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra';
        expect(service._getUrl(config)).toEqual(url);

        // Subnational
        config = {dataset: 'forma-alerts', iso: 'bra', id1: 1};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra/1';
        expect(service._getUrl(config)).toEqual(url);


        // Use
        config = {dataset: 'forma-alerts', use: 'logging', useid: 1,};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/use/logging/1';
        expect(service._getUrl(config)).toEqual(url);

        // WDPA
        config = {dataset: 'forma-alerts', wdpaid: '1'};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/wdpa/1';
        expect(service._getUrl(config)).toEqual(url);        
      });        
  

      // quicc-alerts
      it('correctly returns URL for quicc-alerts', function() {
        var config = null;
        var url = null;

        // World
        config = {dataset: 'quicc-alerts', geojson: 'foo'};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts?geojson=foo';
        expect(service._getUrl(config)).toEqual(url);

        // National
        config = {dataset: 'quicc-alerts', iso: 'bra'};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/admin/bra';
        expect(service._getUrl(config)).toEqual(url);

        // Subnational
        config = {dataset: 'quicc-alerts', iso: 'bra', id1: 1};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/admin/bra/1';
        expect(service._getUrl(config)).toEqual(url);


        // Use
        config = {dataset: 'quicc-alerts', use: 'logging', useid: 1,};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/use/logging/1';
        expect(service._getUrl(config)).toEqual(url);

        // WDPA
        config = {dataset: 'quicc-alerts', wdpaid: '1'};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/quicc-alerts/wdpa/1';
        expect(service._getUrl(config)).toEqual(url);        
      });       


      // nasa-active-fires
      it('correctly returns URL for nasa-active-fires', function() {
        var config = null;
        var url = null;

        // World
        config = {dataset: 'nasa-active-fires', geojson: 'foo'};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires?geojson=foo';
        expect(service._getUrl(config)).toEqual(url);

        // National
        config = {dataset: 'nasa-active-fires', iso: 'bra'};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/admin/bra';
        expect(service._getUrl(config)).toEqual(url);

        // Subnational
        config = {dataset: 'nasa-active-fires', iso: 'bra', id1: 1};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/admin/bra/1';
        expect(service._getUrl(config)).toEqual(url);


        // Use
        config = {dataset: 'nasa-active-fires', use: 'logging', useid: 1,};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/use/logging/1';
        expect(service._getUrl(config)).toEqual(url);

        // WDPA
        config = {dataset: 'nasa-active-fires', wdpaid: '1'};
        url = 'http://beta.gfw-apis.appspot.com/forest-change/nasa-active-fires/wdpa/1';
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