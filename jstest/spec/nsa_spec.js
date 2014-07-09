define([
  'nsa',
  'mps',
  'underscore',
  'helpers/api_responses'
], function(nsa, mps, _) {

  describe("The nsa module", function() {
    var request = null;
    var cache = null;

    beforeEach(function() {
      jasmine.Ajax.install();
    });

    it("is not null", function() {
      expect(nsa).not.toBe(null);
    });

    describe("success callback", function() {
      var cb = null;
      var spy = null;

      beforeEach(function() {
        cache = false;

        spy = jasmine.createSpy('success');
        nsa.spy('/foo', {}, spy, null, cache);

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('/foo');
        expect(request.method).toBe('POST');
        expect(request.data()).toEqual({});
        request.response(ApiResponse.forma_alerts.iso.success);
      });

      it("was called with correct response", function() {
        var cbArgs = spy.calls.mostRecent().args;
        var text = JSON.stringify(cbArgs[0]);
        var expectedText = '{"data":{}}';

        expect(spy).toHaveBeenCalled();
        expect(text).toEqual(expectedText);
      });
    });
  });
});
