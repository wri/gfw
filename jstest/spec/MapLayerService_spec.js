define([
  'services/MapLayerService',
  'nsa',
  'mps', 
  'underscore',
  'helpers/api_responses'  
], function(service, nsa, mps, _) {

  describe("The MapLayerService", function() {
    var request = null;

    beforeEach(function() {
      jasmine.Ajax.install();
      nsa.test = true;
    });

    
    describe("Test getLayers", function() {
      var spy = null;
    
      beforeEach(function(done) {  
        spy = {
          success: function(layers) {
            done();
          },
          error: function(error) {

          }
        };      
        spyOn(spy, 'success').and.callThrough();
        service.getLayers([{id: 581}, {slug: 'forest2000'}], spy.success, spy.error);
        
        request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe(service._getUrl());
        expect(request.method).toBe('POST');
        expect(request.data()).toEqual({});
        request.response(ApiResponse.layers.success);
      });

      it("Called success callback with correct layer", function() {
        var expected = JSON.parse('[{"id":591,"slug":"forest2000","title":"Tree cover extent","title_color":"#A5ED80","subtitle":null,"sublayer":null,"table_name":"forest2000","source":null,"category_color":"#B2D26E","category_slug":"forest_cover","category_name":"Forest cover","external":true,"zmin":null,"zmax":null,"xmax":null,"xmin":null,"ymax":null,"ymin":null,"tileurl":"http://gfw-ee-tiles.appspot.com/gfw/forest_cover_2000/{Z}/{X}/{Y}.png","visible":true},{"id":581,"slug":"logging","title":"Logging","title_color":"#fecc5c","subtitle":null,"sublayer":null,"table_name":"logging_all_merged","source":null,"category_color":"#c98e6c","category_slug":"forest_use","category_name":"Forest use","external":false,"zmin":0,"zmax":22,"xmax":null,"xmin":null,"ymax":null,"ymin":null,"tileurl":"https://wri-01.cartodb.com/tiles/logging_all_merged/{Z}/{X}/{Y}.png","visible":true}]');
        var layers = spy.success.calls.argsFor(0)[0];

        expect(spy.success).toHaveBeenCalled();
        expect(spy.success.calls.count()).toEqual(1);
        expect(layers).toContain(expected[0]);
        expect(layers).toContain(expected[1]);
      });
    });
  });
});