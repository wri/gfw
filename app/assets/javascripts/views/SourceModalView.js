define([
  'jquery',
  'backbone',
  'underscore',
  'handlebars',
  'uri',
  'views/ModalView',
  'text!templates/sourceModal.handlebars'

], function($,Backbone, _, Handlebars, UriTemplate, ModalView, tpl) {

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
      // var data = {
      //   function_: response['Function'] || null,
      //   cautions: response['Cautions'] || null,
      //   citation: response['Citation'] || null,
      //   license: response['License'] || null,
      //   tags: response['Tags'] || null,
      //   overview: response['Overview'] || null,
      //   title: response['Title'] || null,
      //   source: response['Source'] || null,
      //   frequency_of_updates: response['Frequency of Updates'] || null,
      //   translated_overview: response['Translated Overview'] || null,
      //   translated_title: response['Translated_Title'] || null,
      //   resolution: response['Resolution'] || null,
      //   geographic_coverage: response['Geographic Coverage'] || null,
      //   date_of_content: response['Date of Content'] || null,
      //   link_to_odp: 'http://earthenginepartners.appspot.com/science-2013-global-forest/download_v1.2.html'
      // }
      return response;
    }
  });

  var SourceModalView = ModalView.extend({

    id: '#sourceModal',

    className: "modal",

    template: Handlebars.compile(tpl),

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

    sourceClick: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      this.sourceModel = new SourceModel({
        slug: 'tree_cover_loss',
      });
      this.sourceModel.fetch({
        update:true,
        parse: true,
        success: this.sourceSuccess.bind(this),
        error: this.sourceError.bind(this),
      });

      // this.showBySource($(e.currentTarget).data('source'));
    },

    sourceSuccess: function() {
      this.$el.html(this.template(this.sourceModel.toJSON()));
      this.show();
    },

    sourceError: function(error) {
      console.log(error);
    }

  });

  return SourceModalView;

});
