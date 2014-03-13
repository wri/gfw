gfw.ui.model.Layer = cdb.core.Model.extend({
  defaults: {
    selected: false,
    visible: true
  }
});

gfw.ui.collection.Layers = Backbone.Collection.extend({
  model: gfw.ui.model.Layer
});

gfw.ui.model.LayerSelector = cdb.core.Model.extend({
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
    var that = this;

    _.bindAll( this, "toggle", "toggleOpen", "toggleDraggable", "onStopDragging", "onLayerClick", "addLayers", "addSelectedLayer", "toggleLandsatSelector" );

    this.options = _.extend(this.options, this.defaults);

    this.layers = new gfw.ui.collection.Layers();
    this.landsat_layers = new gfw.ui.collection.Layers();

    // layers are defined in helpers
    _.each(config.MAPSTYLES, function(layer, index) {
      if (index === 'landsat') {
        that.layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT", title: "Landsat", name: "landsat" }));

        _.each(layer, function(layer, index) {
          that.landsat_layers.add(new gfw.ui.model.Layer({ customMapType:"LANDSAT"+index, title: "Landsat "+index, name: "landsat"+index }));
        });
      } else {
        if (layer['type'] === 'mapType') {
          that.layers.add(new gfw.ui.model.Layer({ style: layer.style, title: layer.title, name: index, }));
        } else if (layer['type'] === 'customMapType') {
          that.layers.add(new gfw.ui.model.Layer({ customMapType: "TREEHEIGHT", title: "Tree height", name: "treeheight" }));
        } else {
          that.layers.add(new gfw.ui.model.Layer({ style: layer.style, customMapType: "GRAYSCALE", title: "Grayscale", name: "grayscale", selected: true }));
        }
      }
    });

    this.model = new gfw.ui.model.LayerSelector();

    this.model.bind("change:hidden",    this.toggle);
    this.model.bind("change:closed",    this.toggleOpen);
    this.model.bind("change:draggable", this.toggleDraggable);

    this.model.set("containment", "#map-container .map");

    this.template = new cdb.core.Template({
      template: $("#layer_selector-template").html(),
      type: 'mustache'
    });

    this.landsat_template = new cdb.core.Template({
      template: $("#landsat_selector-template").html(),
      type: 'mustache'
    });

    this.selectedLayer = this.layers.find(function(layer) { return layer.get("selected"); });
  },

  addLayers: function() {
    var that = this;

    var template = new cdb.core.Template({
      template: $("#layer-template").html(),
      type: 'mustache'
    });

    var layers = [
      'grayscale',
      'terrain',
      'satellite',
      'treeheight',
      'roads',
      'landsat'
    ]

    this.layers.each(function(layer) {
      var name = layer.get("name");

      if (_.contains(layers, name)) {
        that.$layers.append(template.render( layer.toJSON() ));
      } else {
        that.$landsat_layers.append(template.render( layer.toJSON() ));
      }
    });
  },

  addSelectedLayer: function() {
    var template = new cdb.core.Template({
      template: $("#layer-template").html(),
      type: 'mustache'
    });

    var landsat_template = new cdb.core.Template({
      template: $("#landsat_layer-template").html(),
      type: 'mustache'
    });

    this.$selected_layer.empty();

    if (this.selectedLayer.get("name").indexOf('landsat') !== -1) {
      this.$selected_layer.append(landsat_template.render( this.selectedLayer.toJSON() ));
    } else {
      this.$selected_layer.append(template.render( this.selectedLayer.toJSON() ));
    }
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
      debugger;
      var marginTop = 10,
          height = marginTop + 40 * (that.layers.length-14) + 4;

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

    var map = this.options.map,
        $li  = $(e.target).closest("li"),
        name = $li.attr("id");

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

      var styledMap = {};

      if (layer.get("style")) {
        styledMap = new google.maps.StyledMapType(layer.get("style"), { name: layer.get("title") });
      } else if (layer.get("customMapType") == "TREEHEIGHT") {
        styledMap = config.MAPSTYLES.treeheight.style;
      } else {
        for(var i = 1999; i < 2013; i++) {
          if (layer.get("customMapType") == "LANDSAT"+i) styledMap = config.MAPSTYLES.landsat[i];
        }
      }

      this.$landsat_layers.fadeOut(250);

      map.mapTypes.set(layer.get("title"), styledMap);
      map.setMapTypeId(layer.get("title"));
    } else {
      map.setMapTypeId(layer.get("style"));
    }

    ga('send', 'event', 'LayerSelector', 'Toggle', layer.get('title'));

    this.addSelectedLayer();

    this.close();
  },

  onSourceClick: function(e) {
    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    var source = $(e.target).attr("data-source");

    SourceWindow.show(source).addScroll();
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
