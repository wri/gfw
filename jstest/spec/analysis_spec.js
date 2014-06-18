define([
  'app',
  'analysis',
  'mps', 
  'underscore',
  'helpers/api_responses'
], function(app, analysis, mps, _) {

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
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    afterEach(function() {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });

    describe("FORMA Alerts by country - success", function() {
      var callback = null;
      var url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra?period=2001%2C2008';

      beforeEach(function(done) {
        mps.publish(
          'analysis/get',
          [{layerName: 'forma-alerts', iso: 'bra', period: '2001,2008'}]);

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe(url);
        expect(request.method).toBe('POST');
        expect(request.data()).toEqual({});
        
        callback = {
          spy: function(response) {
            done();
          }
        };

        spyOn(callback, 'spy').and.callThrough();
        mps.subscribe('analysis/get-results', callback.spy);
        request.response(ApiResponse.forma_alerts.iso.success);
      });

      it("The analysis/get-results callback called with correct API response", function() {
        var response = null;
        var expected = JSON.parse(ApiResponse.forma_alerts.iso.success.responseText);
        
        expect(callback.spy).toHaveBeenCalled();
        response = callback.spy.calls.mostRecent().args[0];
        expect(response).toEqual(expected);     
      });
    });


    describe("FORMA Alerts by country - failure", function() {
      var callback = null;
      var url = 'http://beta.gfw-apis.appspot.com/forest-change/forma-alerts-foo/admin/bra?period=2001%2C2008';

      beforeEach(function(done) {
        mps.publish(
          'analysis/get',
          [{layerName: 'forma-alerts-foo', iso: 'bra', period: '2001,2008'}]);

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe(url);
        expect(request.method).toBe('POST');
        expect(request.data()).toEqual({});
        
        callback = {
          spy: function(responseText, status, error) {
            done();
          }
        };

        spyOn(callback, 'spy').and.callThrough();
        mps.subscribe('analysis/get-results-error', callback.spy);
        request.response(ApiResponse.forma_alerts.iso.notfound);
      });

      it("The analysis/get-results callback called with correct API response", function() {
        var response = null;
        var expected = ApiResponse.forma_alerts.iso.notfound.responseText;
        
        expect(callback.spy).toHaveBeenCalled();
        response = callback.spy.calls.mostRecent().args[0];
        expect(response).toEqual(expected);     
      });
    });
  });
});