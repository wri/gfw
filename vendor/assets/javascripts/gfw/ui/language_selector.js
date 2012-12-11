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

    _.bindAll( this, "toggle" );

    this.options = _.extend(this.options, this.defaults);

    this.languages = new gfw.ui.collection.Languages();

    //this.selectedLanguage = this.layers.find(function(layer) { return layer.get("selected"); });

    this.model = new gfw.ui.model.LanguageSelector();

    //this.model.bind("change:hidden",    this.toggle);
    //this.model.bind("change:closed",    this.toggleOpen);
    //this.model.bind("change:draggable", this.toggleDraggable);

    //this.add_related_model(this.model);

    var template = $("#language_selector-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  addLanguage: function(options) {

    var language = new gfw.ui.model.Language( options );

    this.languages.add(language);

    var template = new gfw.core.Template({
      template: $("#language-template").html(),
      type: 'mustache'
    });

    this.$languages.append(template.render( language.toJSON() ));
  },

  onLanguageClick: function(e) {

  },

  render: function() {

    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$languages      = this.$el.find(".languages");

    return this.$el;

  }

});
