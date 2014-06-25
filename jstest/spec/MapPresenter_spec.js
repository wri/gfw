/**
 * Unit tests for the MapPresenter class.
 */
define([
  'presenters/MapPresenter',
  'mps', 
  'underscore',
  'nsa'
], function(MapPresenter, mps, _, nsa) {

  describe("The MapPresenter", function() {
    // The MapView mock
    var viewSpy = null;

    // The presenter to test
    var presenter = null;

    
    describe("Test responding to published events", function() {
      var place = {
        name: 'map',
        params: {
          baselayers: 'loss',
          zoom: 8,
          maptype: 'terrain',
          lat: 1,
          lng: 2
        }
      };
      
      beforeEach(function(done) {
        jasmine.Ajax.install();
        nsa.test = true;  
        viewSpy = jasmine.createSpyObj(
          'viewSpy',
          ['initLayers', 'setZoom', 'setCenter', 'setMapTypeId']);
        presenter = new MapPresenter(viewSpy);  
        mps.subscribe('Map/layers-initialized', function() {
          done();
        });
        mps.publish('Place/go', [place]);        
        request = jasmine.Ajax.requests.mostRecent();
        request.response(ApiResponse.layers.success);        
      });

      it("Check Place/go handling", function() {
        var layers = JSON.parse('[{"id":595,"slug":"loss","title":"Loss","title_color":"#F69","subtitle":"(annual, 30m, global)","sublayer":null,"table_name":"gfw_loss_year","source":null,"category_color":"#F69","category_slug":"forest_clearing","category_name":"Forest change","external":false,"zmin":0,"zmax":22,"xmax":null,"xmin":null,"ymax":null,"ymin":null,"tileurl":"http://earthengine.google.org/static/hansen_2013/gfw_loss_year/{Z}/{X}/{Y}.png","visible":true}]');

        // Zoom
        expect(viewSpy.setZoom).toHaveBeenCalled();
        expect(viewSpy.setZoom).toHaveBeenCalledWith(8);
        expect(viewSpy.setZoom.calls.count()).toEqual(1);

        // Center
        expect(viewSpy.setCenter).toHaveBeenCalled();
        expect(viewSpy.setCenter).toHaveBeenCalledWith(1, 2);
        expect(viewSpy.setCenter.calls.count()).toEqual(1);

        // Maptype
        expect(viewSpy.setMapTypeId).toHaveBeenCalled();
        expect(viewSpy.setMapTypeId).toHaveBeenCalledWith('terrain');        
        expect(viewSpy.setMapTypeId.calls.count()).toEqual(1);

        // TODO check initLayers
        expect(viewSpy.initLayers).toHaveBeenCalled();
        expect(viewSpy.initLayers).toHaveBeenCalledWith(layers);        
        expect(viewSpy.initLayers.calls.count()).toEqual(1);

      });
    });
  });
});