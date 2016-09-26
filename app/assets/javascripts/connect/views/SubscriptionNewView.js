define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'mps',
  'validate',
  'helpers/languagesHelper',
  'core/View',
  'connect/models/Subscription',
  'connect/views/MapMiniView',
  'connect/views/MapMiniControlsView',
  'connect/views/MapMiniDrawingView',
  'connect/views/MapMiniUploadView',
  'connect/views/MapMiniSelectedView',
  'connect/views/CountrySelectionView',
  'connect/views/LayerSelectionView',
  'map/services/GeostoreService',
  'text!connect/templates/subscriptionNew.handlebars',
  'text!connect/templates/subscriptionNewDraw.handlebars',
  'text!connect/templates/subscriptionNewData.handlebars',
  'text!connect/templates/subscriptionNewCountry.handlebars',
], function(
  $,
  Backbone,
  Handlebars,
  _,
  mps,
  validate,
  languagesHelper,
  View,
  Subscription,
  MapMiniView,
  MapMiniControlsView,
  MapMiniDrawingView,
  MapMiniUploadView,
  MapMiniSelectedView,
  CountrySelectionView,
  LayerSelectionView,
  GeostoreService,
  tpl,
  tplDraw,
  tplData,
  tplCountry
) {

  'use strict';

  var constraints = {
    'name': {
      presence: true,
    },
  };


  var SubscriptionNewView = View.extend({
    usenames: ['mining', 'oilpalm', 'fiber', 'logging'],

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
      country: Handlebars.compile(tplCountry),
    },

    events: {
      'change #aoi': 'onChangeAOI',
      'change .dataset-checkbox' : 'onChangeDataset',
      'submit #new-subscription': 'onSubmitSubscription',
      'change input,textarea,select' : 'onChangeInput',
    },

    initialize: function(router, user) {
      View.prototype.initialize.apply(this);

      this.router = router;
      this.user = user;

      this.listeners();
      this.render();
    },

    _subscriptions: [
      // MPS
      {
        'Params/reset': function(layerSpec) {
          var defaults = this.subscription.get('defaults').params;
          this.subscription.set('params', defaults);
          console.log(this.subscription.get('params'));
        }
      },

      {
        'LayerNav/change': function(layerSpec) {
          var defaults = this.subscription.get('defaults').params;
          this.subscription.set('params', defaults);
          console.log(this.subscription.get('params'));
        }
      },

      {
        'Country/update': function(iso) {
          var defaults = this.subscription.get('defaults').params;
          this.subscription.set('params', _.extend({}, defaults, { iso: iso }));
          console.log(this.subscription.get('params'));
        }
      },

      {
        'Shape/update': function(data) {
          var defaults = this.subscription.get('defaults').params;

          if (!!data.use && this.usenames.indexOf(data.use) === -1) {
            var provider = {
              table: data.use,
              filter: 'cartodb_id = ' + data.useid,
              user: 'wri-01',
              type: 'carto'
            };

            GeostoreService.use(provider).then(function(useGeostoreId) {
              this.subscription.set('params', _.extend({}, defaults, { geostore: useGeostoreId }));
              console.log(this.subscription.get('params'));
            }.bind(this));
          } else {
            this.subscription.set('params', _.extend({}, defaults, data));
            console.log(this.subscription.get('params'));
          }
        }
      },

      {
        'Drawing/geostore': function(geostore) {
          var defaults = this.subscription.get('defaults').params;
          this.subscription.set('params', _.extend(defaults, { geostore: geostore }));
          console.log(this.subscription.get('params'));
        }
      },
    ],

    listeners: function() {
      // STATUS
      this.listenTo(this.subscription, 'change:aoi', this.changeAOI.bind(this));
    },

    render: function() {
      this.$el.html(this.templates.default({}));
      this.cache();
      this.renderChosen();
    },

    renderType: function() {
      var aoi = this.subscription.get('aoi');
      var userLang = this.user.getLanguage();
      var languagesList = languagesHelper.getListSelected(userLang);

      if (!!aoi) {
        this.$formType.html(this.templates[aoi]({
          email: this.user.get('email'),
          languages: languagesList
        }));
        this.cache();
        this.renderChosen();
        this.removeSubViews();
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
      });
    },

    cache: function() {
      this.$form = this.$el.find('#new-subscription');
      this.$formType = this.$el.find('#new-subscription-content');
      this.$datasetCheckboxs = this.$el.find('.dataset-checkbox');
      this.$selects = this.$el.find('select.chosen-select');
    },

    initSubViews: function() {
      var mapView = new MapMiniView();
      this.subViews = {
        mapView: mapView,
        mapControlsView: new MapMiniControlsView(mapView.map),
        mapDrawingView: new MapMiniDrawingView(mapView.map),
        mapUploadView: new MapMiniUploadView(mapView.map),
        mapSelectedView: new MapMiniSelectedView(mapView.map),
        countrySelectionView: new CountrySelectionView(mapView.map),
        layerSelectionView: new LayerSelectionView(mapView.map),
      };
    },

    removeSubViews: function() {
      _.each(this.subViews, function(view){
        view._remove();
      })
    },

    /**
     * CHANGE EVENTS
     * - changeAOI
     */
    changeAOI: function() {
      mps.publish('Params/reset', []);
      var aoi = this.subscription.get('aoi');
      this.renderType();
    },



    /**
     * UI EVENTS
     * - onChangeAOI
     * - onChangeDataset
     * - onChangeInput
     * - onSubmitSubscription
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

    onChangeInput: function(e) {
      this.validateInput(e.currentTarget.name, e.currentTarget.value);
      this.updateForm();
    },

    onSubmitSubscription: function(e) {
      e && e.preventDefault();

      var attributesFromForm = _.extend({
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
      var errors = validate.single(value, constraints[name]);
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
