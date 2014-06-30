define([
  'services/AnalysisService',
  'mps',
  'underscore',
  'helpers/api_responses',
], function(analysis, mps, _) {

  var k_combinations = function(set, k) {
    var i, j, combs, head, tailcombs;

    if (k > set.length || k <= 0) {
      return [];
    }

    if (k == set.length) {
      return [set];
    }

    if (k == 1) {
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

  describe("The analysis module", function() {
    var apis = {
      global: "http://{0}/forest-change/{1}{?period,geojson,download,bust,dev}",
      national: "http://{0}/forest-change/{1}/admin{/iso}{?period,download,bust,dev}",
      subnational: "http://{0}/forest-change/{1}/admin{/iso}{/id1}{?period,download,bust,dev}",
      use: "http://{0}/forest-change/{1}/use/{/name}{/id}{?period,download,bust,dev}",
      wdpa: "http://{0}/forest-change/{1}/wdpa/{/id}{?period,download,bust,dev}"
    };

    it("is not null", function() {
      expect(analysis).not.toBe(null);
    });

    it("returns correct URI templates based on config", function() {
      var template = analysis.get_uritemplate({iso: 'bra'});
      var url = analysis.get_url({layerName: 'forma-alerts', iso: 'bra'});
      expect(template).toBe(apis.national);
      expect(url).toBe('http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra');
    });
  });


  describe("Analyze forest change layers", function() {
    var request = null;
    var originalTimeout;

    beforeEach(function() {
      jasmine.Ajax.install();
    });


    describe("FORMA Alerts by country - Test API URLs", function() {
      var params = [
        ['bust', 1],
        ['period', '2008-01-01,2009-01-01']];
      var combos = param_combos(params);

      it("creates correct URLs via get_url()", function() {

        _.each(combos, function(combo) {
          var url = null;
          var path = 'forest-change/forma-alerts/admin/bra';
          var kvp = null;

          combo.layerName = 'forma-alerts';
          combo.iso = 'bra';
          url = analysis.get_url(combo);
          expect(url.contains(path)).toBe(true);
          for (var key in combo) {
            if (key === 'iso' || key === 'layerName') {
              continue;
            }
            kvp = '{0}={1}'.format(key, encodeURIComponent(combo[key]));
            console.log(kvp, url);
            expect(url.contains(kvp)).toBe(true);
          }
        });
      });

    });

    describe("FORMA Alerts by country - Test Success", function() {
      var cb = null;
      var url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra?period=2001%2C2008';

      beforeEach(function(done) {
        mps.publish(
          'analysis/get',
          [{layerName: 'forma-alerts', iso: 'bra', period: '2001,2008'}]);

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe(url);
        expect(request.method).toBe('POST');
        expect(request.data()).toEqual({});

        cb = {
          spy: function(response) {
            done();
          }
        };

        spyOn(cb, 'spy').and.callThrough();
        mps.subscribe('analysis/get-success', cb.spy);
        request.response(ApiResponse.forma_alerts.iso.success);
      });

      it("The analysis/get-results cb called with correct API response", function() {
        var cbArgs = cb.spy.calls.mostRecent().args;
        var text = cbArgs[0];
        var expectedText = ApiResponse.forma_alerts.iso.success.responseText;

        expect(cb.spy).toHaveBeenCalled();
        expect(text).toEqual(JSON.parse(expectedText));
      });
    });


    describe("FORMA Alerts by country - Not found", function() {
      var cb = null;
      var url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts-foo/admin/bra?period=2001%2C2008';

      beforeEach(function() {
        mps.publish(
          'analysis/get',
          [{layerName: 'forma-alerts-foo', iso: 'bra', period: '2001,2008'}]);

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe(url);
        expect(request.method).toBe('POST');
        expect(request.data()).toEqual({});

        spy = jasmine.createSpy('failure');
        mps.subscribe('analysis/get-failure', spy);
        request.response(ApiResponse.forma_alerts.iso.notfound);
      });

      it("The analysis/get-results cb called with correct API response", function() {
        var cbArgs = spy.calls.mostRecent().args;
        var text = cbArgs[0];
        var status = cbArgs[1];
        var error = cbArgs[2];
        var expectedText = ApiResponse.forma_alerts.iso.notfound.responseText;

        expect(spy).toHaveBeenCalled();
        expect(text).toEqual(expectedText);
        expect(status).toEqual('error');
        expect(error).toEqual('');
      });
    });


    describe("FORMA Alerts by country - Failure", function() {
      var cb = null;
      var url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra?period=YYYY%2CYYYY';

      beforeEach(function(done) {
        mps.publish(
          'analysis/get',
          [{layerName: 'forma-alerts', iso: 'bra', period: 'YYYY,YYYY'}]);

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe(url);
        expect(request.method).toBe('POST');
        expect(request.data()).toEqual({});

        cb = {
          spy: function(responseText, status, error) {
            done();
          }
        };

        spyOn(cb, 'spy').and.callThrough();
        mps.subscribe('analysis/get-failure', cb.spy);
        request.response(ApiResponse.forma_alerts.iso.failure);
      });

      it("The analysis/get-results cb called with correct API response", function() {
        var cbArgs = cb.spy.calls.mostRecent().args;
        var text = cbArgs[0];
        var status = cbArgs[1];
        var error = cbArgs[2];
        var expectedText = ApiResponse.forma_alerts.iso.failure.responseText;

        expect(cb.spy).toHaveBeenCalled();
        expect(text).toEqual(expectedText);
        expect(status).toEqual('error');
        expect(error).toEqual('');
      });
    });
  });
});
