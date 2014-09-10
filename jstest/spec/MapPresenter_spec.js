/**
 * Unit tests for the MapPresenter class.
 */
define([
  'underscore',
  'mps',
  'map/presenters/MapPresenter',
  'helpers/baselayers'
], function(_, mps, Presenter) {

  describe('MapPresenter', function() {
    var presenter, viewSpy, place;

    /**
     * Set MockView,
     * Set presenter, don't subscriber to events.
     */
    beforeEach(function() {
      viewSpy = jasmine.createSpyObj(
        'viewSpy', ['setLayers', 'setOptions']);

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

      spyOn(Presenter.prototype, '_subscribe');
      presenter = new Presenter(viewSpy);
    });

    /**
     * Test the MapPresenter StatusModel.
     */
    describe('Initialization', function() {
      it('subscribe to application events', function() {
        expect(Presenter.prototype._subscribe).toHaveBeenCalled();
      });

      it('presenter.status is defined correctly', function() {
        expect(presenter.status).toBeDefined();
        expect(presenter.status.toJSON()).toEqual({
          threshold: null
        });
      });
    });

    /**
     * Test presenter response to 'Place/go' events.
     */
    describe('_onPlaceGo()', function() {
      beforeEach(function() {
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
        expect(presenter._setLayers).toHaveBeenCalledWith(baselayers, {currentDate: [2001, 2002]});
      });
    });

    describe('_updateStatusModel()', function() {
      it('Should set status params from suplied params, only those permitted', function() {
        presenter._updateStatusModel(place.params);

        expect(presenter.status.toJSON()).toEqual({
          threshold: 70
        });
      });
    });

    describe('_setMapOptions()', function() {
      it('Should call view.setOptions', function() {
        presenter._setMapOptions(_.pick(place.params,
          'zoom', 'maptype', 'lat', 'lng'));
        expect(presenter.view.setOptions).toHaveBeenCalled();
        expect(presenter.view.setOptions.calls.count()).toEqual(1);
      });
    });

  });
});
