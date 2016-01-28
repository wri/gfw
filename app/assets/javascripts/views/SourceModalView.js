define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'views/ModalView',
  'presenters/SourceModalPresenter',
  'text!templates/sourceModal.handlebars',
  'text!templates/sourceModalStatic.handlebars'

], function($,Backbone, _, Handlebars, UriTemplate, ModalView, SourceModalPresenter, tpl, tplStatic) {

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
      this.presenter = new SourceModalPresenter(this);
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
      // current
      this.$current = $(e.currentTarget);
      this.$current.find('svg').attr('class','spinner start');

      this.sourceModel = new SourceModel({
        slug: this.$current.data('source'),
      });
      this.sourceModel.fetch({
        update:true,
        parse: true,
        success: this.sourceSuccess.bind(this),
        error: this.sourceError.bind(this),
      });
    },

    sourceSuccess: function() {
      this.$current.find('svg').attr('class','');
      this.$el.html(this.template(this.sourceModel.toJSON()));
      this.show();
      this.setTargetOfLinks();
      ga('send', 'event', document.title.replace('| Global Forest Watch',''), 'Info', this.sourceModel.get('slug'));
    },

    sourceError: function(error) {
      this.$current.find('svg').attr('class','');
      console.info('The id you are searching for does not exist in the API');
      this.sourceStatic(this.sourceModel.get('slug'));
    },

    // Fetch content when click fails
    sourceStatic: function(slug) {
      var $clone = $('#' + slug).clone();
      if (!!$clone.length) {
        this.$el.html(this.templateStatic({ clone: $clone.html() }));
        this.show();
        this.setTargetOfLinks();
      } else {
        console.info('The id you are searching for does not exist');
        this.presenter.notificate('not-no-metadata')
      }
    },

    setTargetOfLinks: function() {
      this.$el.find('a').attr('target', '_blank');
    }

  });

  return SourceModalView;

});
