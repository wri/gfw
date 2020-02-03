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

    _uriTemplate: window.gfw.config.GFW_API + '/v1/gfw-metadata/{slug}',

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
      this._cache();
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
      $(e.currentTarget).addClass('spinner-info start');

      this.sourceModel = new SourceModel({
        slug: this.$current.data('source'),
      });

      if (!!this.$current.data('static')) {
        this.sourceStatic();
      } else {
        this.sourceModel.fetch({
          update:true,
          parse: true,
          success: this.sourceSuccess.bind(this),
          error: this.sourceError.bind(this),
        });
      }
    },

    sourceSuccess: function() {
      $(this.$current).removeClass('spinner-info start');
      this.$el.html(this.template(this.getData()));
      this.show();
      this.setTargetOfLinks();
      ga('send', 'event', document.title.replace('| Global Forest Watch',''), 'Info', this.sourceModel.get('slug'));
    },

    sourceError: function(error) {
      $(this.$current).removeClass('spinner-info start');
      this.$current.find('svg').removeClass('spinner-info start');
      console.info('The id '+this.sourceModel.get('slug')+' you are searching for does not exist in the API');
      this.sourceStatic();
    },

    // Fetch content when click fails
    sourceStatic: function() {
      var $clone = $('#' + this.sourceModel.get('slug')).clone();
      if (!!$clone.length) {
        this.$el.html(this.templateStatic({ clone: $clone.html() }));
        this.show();
        this.setTargetOfLinks();
      } else {
        console.info('The id '+ this.sourceModel.get('slug') +' you are searching for does not exist');
        this.presenter.notificate('notification-no-metadata')
      }
    },

    setTargetOfLinks: function() {
      this.$el.find('a').attr('target', '_blank');
      // Buff, such a selector...
      this.$el.find('a[href^="mailto:gfw"]').addClass('data-suggestion-link');
    },

    /**
     * [getData]
     * @return {[object]} [source Model with some amendments]
     */
    getData: function() {
      var data = this.sourceModel.toJSON();

      if (data.amazon_link) {
        // var file = encodeURIComponent(data.sql_api + '&format=geojson').replace(/%20/g, "%2520");
        // data.open_in_carto = 'http://oneclick.carto.com?file='+encodeURIComponent(data.amazon_link);
      }

      if (data.map_service) {
        data.open_in_arcgis = 'http://www.arcgis.com/home/webmap/viewer.html?url='+ data.map_service;
      }

      // Check if there is any button to display
      if (!!data.download_data || !!data.open_in_carto || !!data.open_in_arcgis) {
        data.footer = true;
      }

      return data;
    }

  });

  return SourceModalView;

});
