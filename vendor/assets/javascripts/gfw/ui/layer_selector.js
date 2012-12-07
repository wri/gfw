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

    "click .toggle": "_toggleOpen"

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    _.bindAll( this, "toggle", "toggleOpen", "toggleDraggable", "onStopDragging", "addLayers", "addSelectedLayer" );

    this.options = _.extend(this.options, this.defaults);

    this.layers = new gfw.ui.collection.Layers();

    this.layers.add(new gfw.ui.model.Layer({ title: "Satellite",   name: "satellite", selected: true }));
    this.layers.add(new gfw.ui.model.Layer({ title: "Terrain",     name: "terrain" }));
    this.layers.add(new gfw.ui.model.Layer({ title: "Tree Height", name: "tree_height" }));

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

    var layer = this.layers.find(function(layer) { return layer.get("selected"); });

    var template = new gfw.core.Template({
      template: $("#layer-template").html(),
      type: 'mustache'
    });

    this.$selected_layer.append(template.render( layer.toJSON() ));

  },

  toggleOpen: function() {

    var that = this;

    if (this.model.get("closed")) {

      that.$el.addClass("closed");

      that.$layers.animate({ opacity: 0, height: 0 }, that.defaults.speed, function() {
        that.$selected_layer.fadeIn(250);
      });

    } else {
    console.log("open", this.$el,this.$selected_layer);

      var marginTop = 10;
      var height    = marginTop + 40 * that.layers.length;
      console.log(height, this.$layers);

      that.$el.removeClass("closed");

      that.$selected_layer.fadeOut(250, function() {
        that.$layers.animate({ opacity: 1, height: height }, that.defaults.speed);
      });

    }

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
