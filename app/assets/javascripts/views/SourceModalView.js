define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'views/ModalView',
  'text!templates/sourceModal.handlebars',
  'text!templates/sourceModalStatic.handlebars'

], function($,Backbone, _, Handlebars, UriTemplate, ModalView, tpl, tplStatic) {

  var SourceModel = Backbone.Model.extend({

    _uriTemplate: 'http://54.88.79.102/gfw-sync/metadata/{slug}',

    initialize: function(options) {
      this.options = _.extend({}, options);
      this.setUrl();
    },

    setUrl: function() {
      this.url = new UriTemplate(this._uriTemplate).fillFromObject(this.options);
    },

    parse: function(response) {
      return response;
    }
  });

  var SourceModalView = ModalView.extend({

    id: '#sourceModal',

    className: "modal",

    template: Handlebars.compile(tpl),
    templateStatic: Handlebars.compile(tplStatic),

    initialize: function() {
      // Inits
      this.constructor.__super__.initialize.apply(this);
      this.render();
      this._initVars();
      this.setListeners();
      this.$body.append(this.el);
    },

    setListeners: function() {
      this.$body.on('click', '.source', _.bind(this.sourceClick, this ));
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    // Fetch model when click
    sourceClick: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      var slug = $(e.currentTarget).data('source');
      this.sourceModel = new SourceModel({
        slug: slug,
      });
      this.sourceModel.fetch({
        update:true,
        parse: true,
        success: this.sourceSuccess.bind(this),
        error: this.sourceError.bind(this),
      });
    },

    sourceSuccess: function() {
      this.$el.html(this.template(this.sourceModel.toJSON()));
      this.show();
      ga('send', 'event', document.title.replace('| Global Forest Watch',''), 'Info', this.sourceModel.get('slug'));
    },

    sourceError: function(error) {
      this.sourceStatic();
    },

    // Fetch content when click fails
    sourceStatic: function() {
      var $clone = $('#' + this.sourceModel.get('slug')).clone();
      console.log($clone);
      this.$el.html(this.templateStatic({ clone: $clone.html() }));
      this.show()
    },

  });

  return SourceModalView;

});
