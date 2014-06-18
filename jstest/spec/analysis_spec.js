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

    it("correctly classifies apis", function() {
      var template = analysis.get_uritemplate({iso: 'bra'});
      var url = analysis.get_url({layerName: 'forma-alerts', iso: 'bra'});
      expect(template).toBe(apis.national);
      expect(url).toBe('http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra');
    });
  });

  describe("Run analysis via mps.publish(analysis/get)", function() {
    var requeat = null;

    beforeEach(function() {
      jasmine.Ajax.install();

      mps.publish('analysis/get', [{layerName: 'forma-alerts', iso: 'bra'}]);

      request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe('http://beta.gfw-apis.appspot.com/forest-change/forma-alerts/admin/bra');
      expect(request.method).toBe('POST');
      expect(request.data()).toEqual({});
    });

    describe("Check mps.publish(analysis/get-results)", function() {
      var callback = null;

      beforeEach(function(done) {
        callback = {
          spy: function(response) {
            done();
          }
        };
        spyOn(callback, 'spy').and.callThrough();
        mps.subscribe('analysis/get-results', callback.spy);
        request.response(ApiResponse.forma_alerts.iso.success);
      });

      it("fires subscriber callback with correct API response", function() {
        var response = null;
        var expected = JSON.parse(ApiResponse.forma_alerts.iso.success.responseText);
        
        expect(callback.spy).toHaveBeenCalled();
        response = callback.spy.calls.mostRecent().args[0];
        expect(response).toEqual(expected);     
      });
    });
  });
});