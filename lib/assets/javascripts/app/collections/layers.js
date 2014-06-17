/**
 * The layer collection module.
 * 
 * @return singleton instance of LayerCollection class (extends 
 * Backbone.CartoDB.CartoDBCollection).
 */
define([
  'jquery',
  'underscore',
  'backbone',
  'backbone_cartodb',
  'mps',
  'gmap',
  'presenter'
], function ($, _, Backbone, BackboneCartoDB, mps, gmap, presenter) {

	var LayerCollection = Backbone.CartoDB({user: 'wri-01'}).CartoDBCollection.extend({

	  sql: function() {
	    return ['SELECT cartodb_id AS id, slug, title, title_color, subtitle, sublayer, table_name, source, category_color, category_slug, category_name, external, zmin, zmax, ST_XMAX(the_geom) AS xmax,',
	      'ST_XMIN(the_geom) AS xmin, ST_YMAX(the_geom) AS ymax, ST_YMIN(the_geom) AS ymin, tileurl, true AS visible',
	      'FROM layerinfo_dev_copy',
	      'WHERE display = TRUE ORDER BY displaylayer, title ASC'].join(' ');
	  },

	  getBaselayers: function() {
	    return _.where(this.toJSON(), {category_name: 'Forest change'})
	  },

	  getBaselayer: function(baselayer) {
	    var layer = _.where(this.toJSON(), {category_name: 'Forest change', 
	    		slug: baselayer});
	    if (layer) {
	    	return layer[0];
	    }
	  }
	});

	var layerCollection = new LayerCollection();

	return layerCollection;

});