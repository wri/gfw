define([
  'jquery',
  'backbone',
  'backbone.syphon',
  'handlebars',
  'underscore',
  'mps',
  'connect/views/MapMiniView',
  'connect/views/MapMiniControlsView',
  'connect/views/MapMiniDrawingView',
  'text!connect/templates/subscriptionNew.handlebars',
  'text!connect/templates/subscriptionNewDraw.handlebars',
  'text!connect/templates/subscriptionNewCountry.handlebars'
], function($, Backbone, BackboneSyphon, Handlebars, _, mps, MapMiniView, MapMiniControlsView, MapMiniDrawingView, tpl, tplDraw, tplCountry) {

  'use strict';

  var SubscriptionNewView = Backbone.View.extend({

    status: new (Backbone.Model.extend({
      defaults: {
        aoi: null,
        lang: 'en',
        name: 'Testing',
        datasets: [],
        params: {
          geostore: null,
          iso: {
            country: null,
            region: null
          },
          wdpaid: null,
          use: null,
          useid: null,
        }
      }
    })),

    templates: {
      default: Handlebars.compile(tpl),
      draw: Handlebars.compile(tplDraw),
      country: Handlebars.compile(tplCountry),
    },

    events: {
      'change #aoi': 'onChangeAOI',
      'change .dataset-checkbox' : 'onChangeDataset',
      'submit #new-subscription': 'onSubmitSubscription',
    },

    initialize: function() {
      this.listeners();
      this.render();
    },

    listeners: function() {
      // STATUS
      this.status.on('change:aoi', this.changeAOI.bind(this));

      // MPS
      mps.subscribe('Drawing/geostore', function(geostore){
        this.status.set('params', {
          geostore: geostore,
          iso: {
            country: null,
            region: null
          },
          wdpaid: null,
          use: null,
          useid: null,
        });
      }.bind(this));
    },

    render: function() {
      this.$el.html(this.templates.default({}));
      this.cache();
      this.renderChosen();
    },

    renderType: function() {
      var aoi = this.status.get('aoi');
      if (!!aoi) {
        this.$formType.html(this.templates[aoi]({}));
        this.cache();
        this.renderChosen();
        this.initSubViews();
      } else {
        this.$formType.html('');
      }
    },

    renderChosen: function() {
      _.each(this.$selects, function(select){
        var $select = $(select);
        if (! !!$select.data('chosen')) {
          $select.chosen({
            width: '100%',
            disable_search: true,
            inherit_select_classes: true,
            no_results_text: "Oops, nothing found!"
          });
        }
      })
    },

    cache: function() {
      this.$form = this.$el.find('#new-subscription');
      this.$formType = this.$el.find('#new-subscription-content');
      this.$datasetCheckboxs = this.$el.find('.dataset-checkbox');
      this.$selects = this.$el.find('select.chosen-select');
    },

    initSubViews: function() {
      var mapView = new MapMiniView();

      new MapMiniControlsView(mapView.map);
      new MapMiniDrawingView(mapView.map);
    },

    /**
     * CHANGE EVENTS
     * - changeAOI
     */
    changeAOI: function() {
      var aoi = this.status.get('aoi');
      this.renderType();
    },


    /**
     * UI EVENTS
     * - onChangeAOI
     */
    onChangeAOI: function(e) {
      e && e.preventDefault();
      this.status.set('aoi', $(e.currentTarget).val());
    },

    onChangeDataset: function(e) {
      e && e.preventDefault();
      var datasets = _.compact(_.map(this.$datasetCheckboxs, function(el){
        var isChecked = $(el).is(':checked');
        return (isChecked) ? $(el).attr('id') : null;
      }.bind(this)));

      this.status.set('datasets', _.clone(datasets));
    },

    onSubmitSubscription: function(e) {
      e && e.preventDefault();
      var attributesFromForm = Backbone.Syphon.serialize(this.$form);
      console.log(this.status.toJSON());
      console.log(attributesFromForm);

      debugger;


      // // Remove 'media' because we want to set it from the model
      // // I don't know why this serializing is returning 'media { image: "" }'
      // if (attributesFromForm.media) {
      //   delete attributesFromForm.media;
      // }

      // this.story.set(_.extend({}, this.story.toJSON(), attributesFromForm));

      // if (this.validate()) {
      //   this.story.save().then(function(result) {
      //     var id = result.data.id;
      //     window.location = '/stories/'+id;
      //   });
      // } else {
      //   this.updateForm();
      //   mps.publish('Notification/open', ['story-new-form-error']);
      //   $(document).scrollTop(0);
      // }
    }
  });

  return SubscriptionNewView;

});
