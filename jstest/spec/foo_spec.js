define([
  'nsa',
  'mps', 
  'underscore',
  'helpers/api_responses'
], function(nsa, mps, _) {

  describe("Foo test", function() {

    beforeEach(function() {
      jasmine.Ajax.install();
    });

    it("is not null", function() {
      expect(1).not.toBe(null);
    });

    describe("Foo test", function() {
      beforeEach(function(done) {
        var request = jasmine.Ajax.requests.mostRecent();
        done();
      });
      it("dude", function() {
        expect(1).not.toBe(null);        
      });
    });
  });
});