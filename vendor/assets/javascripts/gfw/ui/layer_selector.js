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

    _.bindAll( this, "toggle", "toggleOpen", "toggleDraggable", "onStopDragging" );

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

  toggleOpen: function() {

    var that = this;

    if (this.model.get("closed")) {

      that.model.set("contentHeight", that.$content.height());
      that.$content.animate({ opacity: 0, height: that.defaults.minHeight }, that.defaults.speed, function() {
      });

      that.$el.addClass("closed");

    } else {

      that.$content.animate({ opacity: 1, height: that.model.get("contentHeight") }, that.defaults.speed);
      that.$el.removeClass("closed");

    }

  },

  render: function() {

    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$layers         = this.$el.find(".layers");
    this.$selected_layer = this.$el.find(".selected_layer");

    return this.$el;

  }

});
