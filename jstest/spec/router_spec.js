define([
  'router',
  'underscore',
  'backbone',
  'mps'
], function(Router, _, Backbone, mps) {

    'use strict';

    describe('Router', function() {

      afterEach(function() {
        Backbone.history.stop();
      });

      it('router.map called when only it has to', function() {
        spyOn(Router.prototype, 'map');

        var router = new Router();
        Backbone.history.start();

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

      it('cache burst has been called', function() {
        spyOn(Router.prototype, '_checkForCacheBust');
        var router = new Router();
        expect(Router.prototype._checkForCacheBust).toHaveBeenCalled();
      });

    });

});
