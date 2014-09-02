/**
 * Unit tests for the MapPresenter class.
 */
define([
  'underscore',
  'mps',
  'presenters/MapPresenter',
  'helpers/baselayers'
], function(_, mps, MapPresenter) {

  describe('MapPresenter', function() {
    var presenter, viewSpy, place;

    /**
     * Set MockView,
     * Set presenter, don't subscriber to events.
     */
    beforeEach(function() {
      viewSpy = jasmine.createSpyObj(
        'viewSpy', ['setLayers', 'setOptions']);

      MapPresenter.prototype._subscribe = new Function();
      presenter = new MapPresenter(viewSpy);
    });

    afterEach(function() {
      presenter = null;
    });

    /**
     * Test the MapPresenter StatusModel.
     */
    describe('StatusModel', function() {
      it('is defined', function() {
        expect(presenter.status).toBeDefined();
      });

      it('correct default values', function() {
        expect(presenter.status.toJSON()).toEqual({
          threshold: null,
          currentDate: null
        });
      });
    });

    /**
     * Test presenter response to 'Place/go' events.
     */
    describe('_onPlaceGo', function() {
      beforeEach(function() {
        place = {
          params: {
            name: 'map',
            zoom: 3,
            maptype: 'terrain',
            lat: 24,
            lng: 18,
            threshold: 70,
            begin: 2001,
            end: 2002
          },
          layerSpec: {
            getLayers: function() {
              return baselayers;
            }
          }
        };

        spyOn(presenter, '_setMapOptions');
        spyOn(presenter, '_updateStatusModel');
        spyOn(presenter, '_setLayers');
        presenter._onPlaceGo(place);
      });

      it('Should call _setMapOptions with correct params', function() {
        expect(presenter._setMapOptions).toHaveBeenCalled();
        expect(presenter._setMapOptions.calls.count()).toEqual(1);
        expect(presenter._setMapOptions).toHaveBeenCalledWith(_.pick(place.params,
          'zoom', 'maptype', 'lat', 'lng'));
      });

      it('Should call _updateStatusModel with place params', function() {
        expect(presenter._updateStatusModel).toHaveBeenCalled();
        expect(presenter._updateStatusModel.calls.count()).toEqual(1);
        expect(presenter._updateStatusModel).toHaveBeenCalledWith(place.params);
      });

      it('Should call _setLayers with layers object', function() {
        expect(presenter._setLayers).toHaveBeenCalled();
        expect(presenter._setLayers.calls.count()).toEqual(1);
        expect(presenter._setLayers).toHaveBeenCalledWith(baselayers);
      });
    });

    describe('_updateStatusModel', function() {
      it('Should set status params from suplied params, only those permitted', function() {
        presenter._updateStatusModel(place.params);

        expect(presenter.status.toJSON()).toEqual({
          threshold: 70,
          currentDate: [2001, 2002]
        });
      });

    });

  });
});
