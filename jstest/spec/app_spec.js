define([
  'app',
  'underscore',
  'backbone'
], function(app, _, Backbone) {

    describe("The app module", function() {

      it("is not null", function() {
        expect(app).not.toBe(null);
      });

      it("has defined capitalize() and parseUrl() mixins", function() {
        expect(_.capitalize).not.toBe(null);
        expect(_.parseUrl).not.toBe(null);
      });
    });
});