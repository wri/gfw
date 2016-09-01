define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'mps',
  'validate',
  'map/services/LayerSpecService',
  'connect/models/Subscription',
  'connect/views/MapMiniView',
  'connect/views/MapMiniControlsView',
  'connect/views/MapMiniDrawingView',
  'connect/views/MapMiniUploadView',
  'text!connect/templates/subscriptionNew.handlebars',
  'text!connect/templates/subscriptionNewDraw.handlebars',
  'text!connect/templates/subscriptionNewData.handlebars'
], function($, Backbone, Handlebars, _, mps, validate, LayerSpecService, Subscription, MapMiniView, MapMiniControlsView, MapMiniDrawingView, MapMiniUploadView, tpl, tplDraw, tplData) {

  'use strict';

  var constraints = {
    'name': {
      presence: true,
    },
  };


  var SubscriptionNewView = Backbone.View.extend({

    subscription: new Subscription({
      defaults: {
        aoi: null,
        language: 'en',
        datasets: [],
        activeLayers: [],
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
    }),

    templates: {
      default: Handlebars.compile(tpl),
      draw: Handlebars.compile(tplDraw),
      data: Handlebars.compile(tplData),
    },

    events: {
      'change #aoi': 'onChangeAOI',
      'change .dataset-checkbox' : 'onChangeDataset',
      'change #select-layers': 'onChangeLayers',
      'submit #new-subscription': 'onSubmitSubscription',
      'change input,textarea,select' : 'onChangeInput',
    },

    initialize: function(router, user) {
      this.router = router;
      this.user = user;

      LayerSpecService._getAllLayers(
        function(layer){
          return !layer.iso && !!layer.analyzable;
        }.bind(this),

        function(layers){
          this.layers = _.groupBy(_.sortBy(layers, 'title'), 'category_name');
        }.bind(this),

        function(error){
          console.log(error);
        }.bind(this)
      );

      this.listeners();
      this.render();
    },

    listeners: function() {
      // STATUS
      this.subscription.on('change:aoi', this.changeAOI.bind(this));
      this.subscription.on('change:layers', this.changeLayers.bind(this));

      // MPS
      mps.subscribe('Drawing/geostore', function(geostore){
        this.subscription.set('params', {
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
      var aoi = this.subscription.get('aoi');
      if (!!aoi) {
        this.$formType.html(this.templates[aoi]({
          layers: this.layers
        }));
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
      new MapMiniUploadView(mapView.map);
    },

    /**
     * CHANGE EVENTS
     * - changeAOI
     */
    changeAOI: function() {
      var aoi = this.subscription.get('aoi');
      this.renderType();
    },

    changeAOIType: function() {
      var aoiType = this.subscription.get('aoiType');
      this.renderType();
    },


    /**
     * UI EVENTS
     * - onChangeAOI
     */
    onChangeAOI: function(e) {
      e && e.preventDefault();
      this.subscription.set('aoi', $(e.currentTarget).val());
    },

    onChangeDataset: function(e) {
      e && e.preventDefault();
      var datasets = _.compact(_.map(this.$datasetCheckboxs, function(el){
        var isChecked = $(el).is(':checked');
        return (isChecked) ? $(el).attr('id') : null;
      }.bind(this)));

      this.subscription.set('datasets', _.clone(datasets));
    },

    onChangeLayers: function(e) {
      e && e.preventDefault();
      var layers = [$(e.currentTarget).val()];
      this.subscription.set('layers', _.clone(layers));
    },

    onChangeInput: function(e) {
      this.validateInput(e.currentTarget.name, e.currentTarget.value);
      this.updateForm();
    },

    onSubmitSubscription: function(e) {
      e && e.preventDefault();

      var attributesFromForm = _.extend({
        language: 'en',
        resource: {
          type: 'EMAIL',
          content: this.user.get('email')
        }
      }, _.omit(validate.collectFormValues(this.$form, {
        trim: true,
        nullify: true
      }), 'datasets'), this.subscription.toJSON());

      if (this.validate(attributesFromForm)) {
        this.subscription.set(attributesFromForm, { silent: true }).save()
          .then(function(){
            this.router.navigateTo('subscriptions', {
              trigger: true
            });
            mps.publish('Notification/open', ['notification-my-gfw-subscription-correct']);
          }.bind(this))

          .fail(function(){
            mps.publish('Notification/open', ['notification-my-gfw-subscription-incorrect']);
          }.bind(this));

      } else {
        this.updateForm();
        mps.publish('Notification/open', ['notification-my-gfw-subscription-incorrect']);
      }
    },

    /**
     * LAYERS
     * - toggleLayer
     */
    changeLayers: function() {
      var layers = this.subscription.get('layers');
      var where = [{ slug: layers[0].slug }];

      LayerSpecService.toggle(where,
        _.bind(function(layerSpec) {
          mps.publish('LayerNav/change', [layerSpec]);
          mps.publish('Place/update', [{go: false}]);
        }, this));
    },


    /**
     * VALIDATIONS && FORM UPDATE
     * - validate
     * - validateInput
     */
    validate: function(attributesFromForm) {
      var newConstraints = {};
      switch(this.subscription.get('aoi')) {
        case 'draw':
          newConstraints = {
            'datasets': {
              presence: true,
            },
            'params.geostore': {
              presence: true,
            },
          }
        break;
        case 'data':
        break;
      }
      // Validate form, if is valid the response will be undefined
      var constraintsExtended = _.extend({}, constraints, newConstraints);
      this.errors = validate(attributesFromForm, constraintsExtended);
      return ! !!this.errors;
    },

    // TO-DO: validate checkbox
    validateInput: function(name, value) {
      let errors = validate.single(value, constraints[name]);
      if (!!errors) {
        this.errors[name] = errors[0];
      } else {
        this.errors && this.errors[name] && delete this.errors[name];
      }
    },

    updateForm: function() {
      this.$form.find('input, textarea, select').removeClass('-error');
      this.$form.find('label').removeClass('-error');
      for (var key in this.errors) {
        var $input = this.$form.find('[name="'+key+'"]');
        var $label = this.$form.find('[for="'+key+'"]');
        $input.addClass('-error');
        $label.addClass('-error');
      }
    },


  });

  return SubscriptionNewView;

});
