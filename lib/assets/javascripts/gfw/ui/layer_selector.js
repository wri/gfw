gfw.ui.model.Layer = Backbone.Model.extend({
  defaults: {
    selected: false,
    visible: true
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
    "click li a:not(.source)": "onLayerClick",
    "click li a.source": "onSourceClick"

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    _.bindAll( this, "toggle", "toggleOpen", "toggleDraggable", "onStopDragging", "onLayerClick", "addLayers", "addSelectedLayer", "toggleLandsatSelector" );

    this.options = _.extend(this.options, this.defaults);

    this.layers = new gfw.ui.collection.Layers();

    this.layers.add(new gfw.ui.model.Layer({ style: config.BASE_MAP_STYLE, customMapType: "TERRAIN", title: "Black & White", name: "terrain", selected: true }));
    this.layers.add(new gfw.ui.model.Layer({ mapType: google.maps.MapTypeId.TERRAIN, title: "Terrain", name: "classic", }));
    this.layers.add(new gfw.ui.model.Layer({ mapType: google.maps.MapTypeId.SATELLITE, title: "Satellite", name: "satellite", }));

    this.layers.add(new gfw.ui.model.Layer({ customMapType:"TREEHEIGHT", title: "Tree Height", name: "tree_height" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT", title: "Landsat", name: "landsat" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT1999", title: "Landsat 1999", name: "landsat1999" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2000", title: "Landsat 2000", name: "landsat2000" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2001", title: "Landsat 2001", name: "landsat2001" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2002", title: "Landsat 2002", name: "landsat2002" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2003", title: "Landsat 2003", name: "landsat2003" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2004", title: "Landsat 2004", name: "landsat2004" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2005", title: "Landsat 2005", name: "landsat2005" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2006", title: "Landsat 2006", name: "landsat2006" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2007", title: "Landsat 2007", name: "landsat2007" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2008", title: "Landsat 2008", name: "landsat2008" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2009", title: "Landsat 2009", name: "landsat2009" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2010", title: "Landsat 2010", name: "landsat2010" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2011", title: "Landsat 2011", name: "landsat2011" }));
    this.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT2012", title: "Landsat 2012", name: "landsat2012" }));

    this.selectedLayer = this.layers.find(function(layer) { return layer.get("selected"); });

    this.model = new gfw.ui.model.LayerSelector();

    this.model.bind("change:hidden",    this.toggle);
    this.model.bind("change:closed",    this.toggleOpen);
    this.model.bind("change:draggable", this.toggleDraggable);

    this.model.set("containment", "#map-container .map");

    this.add_related_model(this.model);

    this.template = new gfw.core.Template({
      template: $("#layer_selector-template").html(),
      type: 'mustache'
    });

    this.landsat_template = new gfw.core.Template({
      template: $("#landsat_selector-template").html(),
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
      var name = layer.get("name");

      if(name === 'terrain' ||
         name === 'classic' ||
         name === 'satellite'||
         name === 'tree_height' ||
         name === 'landsat') {
        that.$layers.append(template.render( layer.toJSON() ));
      } else {
        that.$landsat_layers.append(template.render( layer.toJSON() ));
      }

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
      var height = marginTop + 40 * (that.layers.length-14) + 4;

      that.$el.removeClass("closed");

      that.$selected_layer.fadeOut(250, function() {
        that.$layers.show();
        that.$layers.animate({ opacity: 1, height: height }, { duration: that.defaults.speed });
      });

    }

  },

  toggleLandsatSelector: function(callback) {
    this.$layer_selector = $(".layer_selector");
    this.$landsat = $("#landsat");
    this.$landsat_layers = $(".landsat_layers");

    var top  = this.$landsat.position().top + 22 - this.$landsat_layers.height()/2;
    var left = this.$landsat.position().left - 205;

    this.$landsat_layers.css({
      left: left,
      top: top,
      position: 'absolute'
    });

    this.$landsat_layers.fadeIn(250);

    callback && callback();

    return this;
  },

  onLayerClick: function(e) {
    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    var map = this.options.map;
    var $li  = $(e.target).closest("li");
    var name = $li.attr("id");

    var layer = this.layers.find(function(layer) { return name == layer.get("name"); });

    if ($li.hasClass("landsat")) {
      if($(".landsat_layers").is(":visible")) {
        this.$landsat_layers.fadeOut(250);

        this.close();
      } else {
        this.toggleLandsatSelector();
      }

      return;
    } else {
      if (this.selectedLayer.get("name") == name) {

        if ($li.parent().hasClass("selected_layer")) {
          this.open();
        } else {
          this.close();

          this.$landsat_layers.fadeOut(250);
        }

        return;
      }
    }

    this.selectedLayer.set("selected", false);
    layer.set("selected", true);
    this.selectedLayer = layer;

    if (layer.get("customMapType")) {

      if (layer.get("customMapType") == "LANDSAT") {
        this.toggleLandsatSelector();

        return;
      }

      if (layer.get("customMapType") == "TREEHEIGHT") styledMap = config.mapStyles.TREEHEIGHT;

      for(var i = 1999;i < 2013; i++) {
        if (layer.get("customMapType") == "LANDSAT"+i) styledMap = config.mapStyles.LANDSAT[i];
      }

      if(layer.get("style")) {
        styledMap = new google.maps.StyledMapType(layer.get("style"), { name: layer.get("title") });
      }

      this.$landsat_layers.fadeOut(250);

      map.mapTypes.set(layer.get("title"), styledMap);
      map.setMapTypeId(layer.get("title"));

    } else {
      map.setMapTypeId(layer.get("mapType"));
    }

    this.addSelectedLayer();

    this.close();

  },

  onSourceClick: function(e) {
    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    var source = $(e.target).attr("data-source");

    sourceWindow.show(source).addScroll();
  },

  onLandsatClick: function(e) {
    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    landsatDialog.show();
  },

  render: function() {

    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));
    this.$el.append(this.landsat_template.render( this.model.toJSON() ));

    this.$layers         = this.$el.find(".layers");
    this.$selected_layer = this.$el.find(".selected_layer");
    this.$landsat_layers = this.$el.find(".landsat_layers");

    this.addSelectedLayer();
    this.addLayers();
    this.toggleOpen();

    return this.$el;

  }

});
