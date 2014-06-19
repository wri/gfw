define([
  'app',
  'nsa',
  'mps', 
  'underscore',
  'helpers/api_responses',
], function(app, nsa, mps, _) {


  describe("The nsa module", function() {
    
    var request = null;
    var cache = null;

    beforeEach(function() {
      jasmine.Ajax.install();
    });

    
    describe("foo", function() {
      
      var cb = null;
    
      beforeEach(function(done) {
        cache = false;
        cb = {
          spy: function(response) {
            done();
          }
        };
        
        nsa.spy('/foo', {}, cb.spy);

        request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('/foo');
        expect(request.method).toBe('POST');
        expect(request.data()).toEqual({});

        spyOn(cb, 'spy').and.callThrough();
        request.response(ApiResponse.forma_alerts.iso.success);
      });

      it("", function() {
        var cbArgs = cb.spy.calls.mostRecent().args;
        var text = cbArgs[0];
        var expectedText = 'foo';

        expect(cb.spy).toHaveBeenCalled();
        expect(text).toEqual(expectedText);
      });
    });
  });
});