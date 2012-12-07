gfw.ui.model.Language = Backbone.Model.extend({
  defaults: {
    selected: false
  }
});

gfw.ui.collection.Languages = Backbone.Collection.extend({
  model: gfw.ui.model.Language
});

gfw.ui.model.LanguageSelector = Backbone.Model.extend({

  defaults: {
    hidden: true,
    closed: true
  }

});

gfw.ui.view.LanguageSelector = gfw.ui.view.Widget.extend({

  className: 'language_selector',

  events: {

    "click li a ": "onLanguageClick"

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    //_.bindAll( this, "toggle", "toggleOpen", "toggleDraggable", "onStopDragging", "onLanguageClick", "addLanguages", "addSelectedLanguage" );

    //this.options = _.extend(this.options, this.defaults);

    //this.layers = new gfw.ui.collection.Languages();

    //this.layers.add(new gfw.ui.model.Language({ mapType: google.maps.MapTypeId.TERRAIN, title: "Terrain",     name: "terrain", selected: true }));
    //this.layers.add(new gfw.ui.model.Language({ mapType: google.maps.MapTypeId.SATELLITE, title: "Satellite",   name: "satellite", }));
    //this.layers.add(new gfw.ui.model.Language({ customMapType:"TREEHEIGHT", mapType: config.mapStyles.TREEHEIGHT, title: "Tree Height", name: "tree_height" }));

    //this.selectedLanguage = this.layers.find(function(layer) { return layer.get("selected"); });

    //this.model = new gfw.ui.model.LanguageSelector();

    //this.model.bind("change:hidden",    this.toggle);
    //this.model.bind("change:closed",    this.toggleOpen);
    //this.model.bind("change:draggable", this.toggleDraggable);

    //this.add_related_model(this.model);

    //var template = $("#layer_selector-template").html();

    //this.template = new gfw.core.Template({
      //template: template,
      //type: 'mustache'
    //});

  },

  render: function() {

    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$languages      = this.$el.find(".languages");

    //this.addSelectedLanguage();
    //this.addLanguages();
    this.toggleOpen();

    return this.$el;

  }

});
