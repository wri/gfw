define([
  'services/CountryService',
  'nsa', 
  'helpers/api_responses',
], function(service, nsa) {

  'use strict';

  describe('CountryService Suite', function() {


    it('the service is not null', function() {
      expect(service).not.toEqual(null);
    });

    /**
     * Spec for testing _getUriTemplate().
     */
    describe('_getUrl()', function() {

      beforeEach(function() {
      });

      it('correctly returns URL for supplied ISO code', function() {
        var url = 'http://beta.gfw-apis.appspot.com/countries/bra';

        expect(service._getUrl('bra')).toEqual(url);
      });
    });    


    /**
     * Spec for testing execute().
     */
    describe('execute()', function() {
      var response = null;
      var callback = null;

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
        service.execute('bra', callback.success);
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