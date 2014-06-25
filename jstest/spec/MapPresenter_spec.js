/**
 * Unit tests for the AnalysisButtonPresenter class.
 */
define([
  'presenters/MapPresenter',
  'mps', 
  'underscore'
], function(MapPresenter, mps, _) {

  describe("The MapPresenter", function() {
    // The MapView mock
    var viewSpy = null;

    // The presenter to test
    var presenter = null;

    beforeEach(function() {
      viewSpy = {
        initLayers: function(layers) {
        },
        setZoom: function(zoom) {
        },
        setCenter: function(lat, lng) {
        },
        setMapTypeId: function(maptype) {
        }
      };
      presenter = new MapPresenter(viewSpy);
    });

    describe("Test responding to published events", function() {
      var place = {
        name: 'map',
        params: {
          zoom: 8,
          maptype: 'terrain',
          lat: 1,
          lng: 2
        }
      };
      
      beforeEach(function() {
        _.each(['initLayers', 'setZoom', 'setCenter', 'setMapTypeId'], 
          _.partial(spyOn, viewSpy));
      });

      it("Check Map/set-zoom handling", function() {
        mps.publish('Map/set-zoom', [8]);        
        expect(viewSpy.setZoom).toHaveBeenCalled();
        expect(viewSpy.setZoom.calls.count()).toEqual(1);
        expect(viewSpy.setZoom.calls.argsFor(0)).toEqual([8]);
      });

      it("Check Place/go handling", function() {
        mps.publish('Place/go', [place]);        

        // Zoom
        expect(viewSpy.setZoom).toHaveBeenCalled();
        expect(viewSpy.setZoom.calls.count()).toEqual(1);
        expect(viewSpy.setZoom.calls.argsFor(0)).toEqual([8]);

        // Center
        expect(viewSpy.setCenter).toHaveBeenCalled();
        expect(viewSpy.setCenter.calls.count()).toEqual(1);
        expect(viewSpy.setCenter.calls.argsFor(0)).toEqual([1, 2]);

        // Maptype
        expect(viewSpy.setMapTypeId).toHaveBeenCalled();
        expect(viewSpy.setMapTypeId.calls.count()).toEqual(1);
        expect(viewSpy.setMapTypeId.calls.argsFor(0)).toEqual(['terrain']);
      });      
    });

    
    // describe("Test onClick event from view", function() {
    //   var callbackSpy = null;

    //   beforeEach(function() {
    //     callbackSpy = {
    //       callback: function(data) {
    //       }
    //     };
    //     spyOn(callbackSpy, 'callback');
    //     mps.subscribe('AnalysisButton/clicked', callbackSpy.callback);
        
    //     // Simulates the view calling onClick
    //     presenter.onClick();
    //   });

    //   it("Test AnalysisButton/clicked event was published", function() {
    //     expect(callbackSpy.callback).toHaveBeenCalled();
    //     expect(callbackSpy.callback.calls.count()).toEqual(1);
    //     expect(callbackSpy.callback.calls.argsFor(0)).toEqual([]);
    //   });     
    // });    
  });
});