/**
 * Unit tests for the PantropicalLayer class.
 */
define([
  'views/layers/PantropicalLayer',
  'underscore'
], function(PantropicalLayer, _) {

  describe("The PantropicalLayer", function() {
    // The view mock
    var view = null;
    var layer = null;
    var map = null;

    beforeEach(function() {
      layer = {
        category_color: "#B2D26E",
        category_name: "Forest cover",
        category_slug: "forest_cover",
        external: true,
        id: 590,
        slug: "pantropical",
        source: null,
        sublayer: null,
        subtitle: null,
        table_name: "pantropical",
        tileurl: "http://gfw-ee-tiles.appspot.com/gfw/masked_forest_carbon/{Z}/{X}/{Y}.png",
        title: "Tropical forest carbon stocks",
        title_color: "#FED98E",
        visible: true,
        xmax: null,
        xmin: null,
        ymax: null,
        ymin: null,
        zmax: null,
        zmin: null
      };

      map = {};

      view = new PantropicalLayer(layer, map);
    });

    it("Check pantropical layer rendering", function() {
      view.render();

      expect(view.render).toHaveBeenCalled();
      expect(view.render.calls.count()).toEqual(1);

      expect(view.getQuery).toHaveBeenCalled();
      expect(view.getQuery.calls.count()).toEqual(1);
      // get query to return string
      // this.cdb to be defined
    });
  });
});
