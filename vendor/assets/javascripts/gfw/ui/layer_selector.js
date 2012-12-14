gfw.ui.model.Layer = Backbone.Model.extend({
  defaults: {
    selected: false
  }
});

gfw.ui.collection.Layers = Backbone.Collection.extend({
  model: gfw.ui.model.Layer
});

gfw.ui.model.LayerSelector = Backbone.Model.extend({

  defaults: {
    hidden: true,
    closed: true,
    layerCount: 0
  }

});

gfw.ui.view.LayerSelector = gfw.ui.view.Widget.extend({

  className: 'layer_selector',

  events: {

    "click .toggle": "_toggleOpen",
    "click li a ": "onLayerClick"

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    _.bindAll( this, "toggle", "toggleOpen", "toggleDraggable", "onStopDragging", "onLayerClick", "ddLayers", "addSelectedLayer" );

    this.options = _.extend(this.options, this.defaults);

    this.layers = new gfw.ui.collection.Layers();

    this.layers.add(new gfw.ui.model.Layer({ style: config.BASE_MAP_STYLE, customMapType: "TERRAIN", title: "Terrain", name: "terrain", selected: true }));
    this.layers.add(new gfw.ui.model.Layer({ mapType: google.maps.MapTypeId.TERRAIN, title: "Classic", name: "classic", }));
    this.layers.add(new gfw.ui.model.Layer({ mapType: google.maps.MapTypeId.SATELLITE, title: "Satellite", name: "satellite", }));

    //this.layers.add(new gfw.ui.model.Layer({ customMapType:"TREEHEIGHT", mapType: config.mapStyles.TREEHEIGHT, title: "Tree Height", name: "tree_height" }));

    this.selectedLayer = this.layers.find(function(layer) { return layer.get("selected"); });

    this.model = new gfw.ui.model.LayerSelector();

    this.model.bind("change:hidden",    this.toggle);
    this.model.bind("change:closed",    this.toggleOpen);
    this.model.bind("change:draggable", this.toggleDraggable);

    this.add_related_model(this.model);

    var template = $("#layer_selector-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  addLayers: function() {

    var that = this;

    var template = new gfw.core.Template({
      template: $("#layer-template").html(),
      type: 'mustache'
    });

    this.layers.each(function(layer) {
      that.$layers.append(template.render( layer.toJSON() ));
    });

  },

  addSelectedLayer: function() {

    var template = new gfw.core.Template({
      template: $("#layer-template").html(),
      type: 'mustache'
    });

    this.$selected_layer.empty();
    this.$selected_layer.append(template.render( this.selectedLayer.toJSON() ));

  },

  toggleOpen: function() {

    var that = this;

    if (this.model.get("closed")) {

      that.$el.addClass("closed");

      that.$layers.animate({ opacity: 0, height: 0 }, that.defaults.speed, function() {
        that.$layers.hide();
        that.$selected_layer.fadeIn(250);
      });

    } else {

      var marginTop = 10;
      var height    = marginTop + 40 * that.layers.length;

      that.$el.removeClass("closed");

      that.$selected_layer.fadeOut(250, function() {
        that.$layers.show();
        that.$layers.animate({ opacity: 1, height: height }, { duration: that.defaults.speed });
      });

    }

  },

  onLayerClick: function(e) {

    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    var map = this.options.map;
    var $li  = $(e.target).closest("li");
    var name = $li.attr("id");

    if (this.selectedLayer.get("name") == name) {

      if ($li.parent().hasClass("selected_layer")) {
        this.open();
      } else {
        this.close();
      }

      return;
    }

    var layer = this.layers.find(function(layer) { return name == layer.get("name"); });

    this.selectedLayer.set("selected", false);
    layer.set("selected", true);
    this.selectedLayer = layer;

    if (layer.get("customMapType")) {

      var styledMap = new google.maps.StyledMapType(layer.get("style"), { name: layer.get("title") });

      map.mapTypes.set(layer.get("title"), styledMap);
      map.setMapTypeId(layer.get("title"));

    } else {
      map.setMapTypeId(layer.get("mapType"));
    }

    this.addSelectedLayer();

    this.close();

  },

  render: function() {

    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$layers         = this.$el.find(".layers");
    this.$selected_layer = this.$el.find(".selected_layer");

    this.addSelectedLayer();
    this.addLayers();
    this.toggleOpen();

    return this.$el;

  }

});
