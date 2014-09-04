/**
 * Unit tests for the Router class.
 */
define([
  'map/router',
  'underscore',
  'backbone',
], function(Router, _, Backbone) {

    'use strict';

    describe('Router', function() {
      var router;

      beforeEach(function() {
        spyOn(Router.prototype, 'map');
        spyOn(Router.prototype, '_checkForCacheBust');
        router = new Router();
        Backbone.history.start();
      });

      afterEach(function() {
        Backbone.history.stop();
      });

      it('router.map called only when it has to', function() {
        // Map should be call:
        router.navigate('/map', true);
        router.navigate('/map/3/15.00/27.00/ALL/grayscale/modis', true);
        router.navigate('/map/3/15.00/27.00/ALL/grayscale/modis/', true);
        router.navigate('/map/3/15.00/27.00/ALL/grayscale/modis/591', true);
        router.navigate('/map/3/15.00/27.00/ALL/grayscale/modis/591/', true);
        router.navigate('/map/3/15.00/27.00/ALL/grayscale/modis/591?begin=2012-01-01&end=2012-03-01&threshold=10', true);

        // Map shouldn't be called:
        router.navigate('', true);
        router.navigate('/map/3/15.00/27.00/ALL/grayscale/modis/591/foo', true);

        expect(Router.prototype.map.calls.count()).toEqual(6);
      });

      it('cache bust has been called', function() {
        expect(Router.prototype._checkForCacheBust).toHaveBeenCalled();
      });
    });

})
