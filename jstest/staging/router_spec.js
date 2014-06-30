define([
  'router',
  'underscore',
  'backbone',
  'mps'
], function(Router, _, Backbone, mps) {

    describe("The router module", function() {

      var router = null;

      beforeEach(function() {
        var mockApp = {};
        router = new Router(mockApp);
      });

      it("is not null", function() {
        expect(router).not.toBe(null);
      });

      it("handles navigate event", function() {
        mps.publish('navigate', [{path: 'foo/bar/baz'}]);
        expect(router.path).toBe('foo/bar/baz');
      });

      it("handles map route", function() {
        router.map('foo', 'bar', 'baz');
        expect(router.mapView).not.toBe(null);
      });
    });
});