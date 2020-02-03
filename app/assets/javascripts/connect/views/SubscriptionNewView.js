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
  'map/views/LegendView',
  'connect/views/CountrySelectionView',
  'connect/views/LayerSelectionView',
  'connect/views/DatasetsListView',
  'map/services/GeostoreService',
  'services/SubscriptionsService',
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
  LegendView,
  CountrySelectionView,
  LayerSelectionView,
  DatasetsListView,
  GeostoreService,
  subscriptionsService,
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
        isUpload: false,
        metadata: null,
        params: {
          geostore: null,
          iso: {
            country: null,
            region: null
          },
          wdpaid: null,
          use: null,
          useid: null
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
      'submit #new-subscription': 'onSubmitSubscription',
      'change input,textarea,select' : 'onChangeInput',
      'click .js-test-webhook': 'onClickTestWebhook',
    },

    initialize: function(router, user, params) {
      View.prototype.initialize.apply(this);

      this.router = router;
      this.user = user;
      this._setParams(params);

      this.render();

      this.listeners();

      // Set params
      setTimeout(function () {
        this.renderType();
      }.bind(this), 0);
    },

    _subscriptions: [
      // MPS
      {
        'Router/params': function(params) {
          this.updateView(params);
        }
      },
      {
        'Params/reset': function() {
          var defaults = _.extend({}, this.subscription.get('defaults').params, {
            geostore: null
          });

          this.subscription.set({
            isUpload: false,
            activeLayers: []
          }, { silent: true });
          this.subscription.set('params', defaults);
          this.subscription.unset('geostore', { silent: true });
          this.subscription.unset('metadata', { silent: true });

          mps.publish('Router/change', [this.subscription.toJSON()]);
        }
      },

      {
        'LayerNav/change': function(layerSpec) {
          var layers = null;
          var defaults = $.extend({}, this.subscription.attributes.params);

          if (layerSpec) {
            layers = _.keys(layerSpec.getLayers());
          }

          this.subscription.set({
            activeLayers: layers
          }, { silent: true });
          this.subscription.set('params', defaults);
          mps.publish('Router/change', [this.subscription.toJSON()]);
        }
      },

      {
        'Country/update': function(iso) {
          var defaults = $.extend({}, this.subscription.get('defaults').params);
          this.subscription.set(
            {
              params: _.extend({}, defaults, {
                iso: iso
              })
            }, { silent: true }
          );

          this.changeDatasets();
          mps.publish('Router/change', [this.subscription.toJSON()]);
        }
      },

      {
        'Shape/update': function(data) {
          var currentParams = this.subscription.attributes.params;
          var defaults = this.subscription.get('defaults').params;

          if (!!data.use && this.usenames.indexOf(data.use) === -1) {
             GeostoreService.use({ use: use, useid: useid }).then(function(useGeostoreId) {
              this.subscription.set({
                metadata: JSON.stringify(data)
              }, { silent: true });
              this.subscription.set('params', _.extend({}, defaults, {
                geostore: useGeostoreId,
                iso: {
                  country: currentParams.iso.country,
                  region: currentParams.iso.region
                }
              }));
              mps.publish('Router/change', [this.subscription.toJSON()]);
            }.bind(this));

          } else {
            this.subscription.set({
              metadata: JSON.stringify(data)
            }, { silent: true });
            this.subscription.set('params', _.extend({}, defaults, {
              use: data.use,
              useid: data.useid,
              wdpaid: data.wdpaid,
              iso: {
                country: currentParams.iso.country,
                region: currentParams.iso.region
              }
            }));
            mps.publish('Router/change', [this.subscription.toJSON()]);
          }
        }
      },

      {
        'Shape/upload': function(uploaded) {
          var defaults = this.subscription.get('defaults').params;
          this.subscription.set({ isUpload: uploaded }, { silent: true });
        }
      },

      {
        'Drawing/geostore': function(geostore) {
          var defaults = this.subscription.get('defaults').params;
          this.subscription.set('params', _.extend({}, defaults, { geostore: geostore }));
          mps.publish('Router/change', [this.subscription.toJSON()]);
          this.changeDatasets();
        }
      },

      {
        'Datasets/update': function(datasets) {
          this.subscription.set('datasets', datasets);
          mps.publish('Router/change', [this.subscription.toJSON()]);
        }
      },

      {
        'Datasets/clear': function(datasets) {
          this.subscription.set('datasets', [], {
            silent: true
          });
          mps.publish('Router/change', [this.subscription.toJSON()]);
        }
      },

      {
        'Datasets/refresh': function() {
          this.changeDatasets();
        }
      },

      {
        'Selected/reset': function() {
          var defaults = _.extend({}, this.subscription.attributes.params, {
            geostore: null,
            useId: null
          });

          this.subscription.set('params', defaults, { silent: true });
          this.subscription.unset('geostore', { silent: true });
          this.subscription.unset('metadata', { silent: true });

          mps.publish('Router/change', [this.subscription.toJSON()]);
        }
      }

    ],

    listeners: function() {
      // STATUS
      this.listenTo(this.subscription, 'change:aoi', this.changeAOI.bind(this));
      this.listenTo(this.subscription, 'change:params', this.changeDatasets.bind(this));
    },

    render: function() {
      this.$el.html(this.templates.default({
        aoi: this.subscription.get('aoi'),
        loggedIn: this.router.alreadyLoggedIn,
        apiHost: window.gfw.config.GFW_API
      }));
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

    updateView: function(params) {
      var currentParams = this.subscription.toJSON();

      if (params.aoi && params.aoi !== currentParams.aoi) {
        var newParams = _.extend(_.clone(currentParams), params);
        this.subscription.set(newParams, { silent: true });
        this.render();
        this.renderType();
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
      this.$selects = this.$el.find('select.chosen-select');
      this.$subscriptionUrl = this.$el.find('#subscriptionUrl');
      this.$testWebhookButton = this.$el.find('.js-test-webhook');
    },

    initSubViews: function() {
      var params = this.subscription.toJSON();

      var datasetsList = new DatasetsListView(params);

      var mapView = new MapMiniView({
        el: '#map',
        params: params
      });


      this.subViews = {
        datasetsListView: datasetsList,
        mapView: mapView,
        mapControlsView: new MapMiniControlsView(mapView.map),
        mapDrawingView: new MapMiniDrawingView(mapView.map),
        mapUploadView: new MapMiniUploadView(mapView.map),
        mapSelectedView: new MapMiniSelectedView(mapView.map, params),
        mapLegend: new LegendView(mapView.map, []),
        countrySelectionView: new CountrySelectionView(mapView.map, params),
        layerSelectionView: new LayerSelectionView(mapView.map, params)
      };
    },

    removeSubViews: function() {
      _.each(this.subViews, function(view){
        if (view._remove) {
          view._remove();
        } else {
          view.remove();
        }
      })
    },

    getResource: function(formData) {
      var type = 'EMAIL';
      var content = this.user.get('email');

      if (formData.url && formData.url.length > 0) {
        type = 'URL';
        content = formData.url;
      }

      return {
        resource: {
          type: type,
          content: content
        }
      }
    },

    /**
     * CHANGE EVENTS
     * - changeAOI
     * - changeDatasets
     */
    changeAOI: function() {
      mps.publish('Params/reset', []);
      this.renderType();
    },

    changeDatasets: function() {
      var subscription = this.subscription.toJSON();
      var params = subscription.params;

      mps.publish('Datasets/change', [{
        use: params.use,
        useid: params.useid,
        wdpaid: params.wdpaid,
        geostore: params.geostore,
        country: params.iso.country,
        region: params.iso.region,
        datasets: subscription.datasets
      }]);
    },

    _setParams: function(params) {
      var currentParams = {};
      currentParams.aoi = params.aoi;
      currentParams.params = _.extend({}, this.subscription.attributes.defaults.params);
      currentParams.params.iso = _.extend({}, this.subscription.attributes.defaults.params.iso);

      if (params.country) {
        currentParams.params.iso.country = params.country;
      }
      if (params.region) {
        currentParams.params.iso.region = params.region;
      }
      if (params.use) {
        currentParams.params.use = params.use;
      }
      if (params.useid) {
        currentParams.params.useid = params.useid;
      }
      if (params.wdpaid) {
        currentParams.params.wdpaid = params.wdpaid;
      }
      if (params.geostore) {
        currentParams.geostore = params.geostore;
      }
      if (params.datasets) {
        currentParams.datasets = params.datasets;
      }
      if (params.activeLayers) {
        currentParams.activeLayers = params.activeLayers;
      }
      if (params.metadata) {
        currentParams.metadata = params.metadata;
      }

      this.subscription.set(currentParams, { silent: true });
    },



    /**
     * UI EVENTS
     * - onChangeAOI
     * - onChangeInput
     * - onSubmitSubscription
     */
    onChangeAOI: function(e) {
      if (this.router.alreadyLoggedIn) {
        e && e.preventDefault();
        this.subscription.set('aoi', $(e.currentTarget).val());
      }
    },

    onChangeInput: function(e) {
      this.validateInput(e.currentTarget.name, e.currentTarget.value);
      this.updateForm();
    },

    onSubmitSubscription: function(e) {
      e && e.preventDefault();

      this.user.checkLogged()
        .then(function(response) {
          var currentParams = this.subscription.toJSON();
          currentParams.aoi = null;
          currentParams.resource = null;
          currentParams.datasets = [];

          var formData = validate.collectFormValues(this.$form, {
            trim: true,
            nullify: true
          });
          var resource = this.getResource(formData);
          var attributesFromForm = _.extend(resource, _.omit(formData, 'datasets'),
            this.subscription.toJSON());

          if (this.validate(attributesFromForm) && this.router.alreadyLoggedIn) {
            this.subscription.set(attributesFromForm, { silent: true });
            this.subscription.set(attributesFromForm, { silent: true }).save()
              .then(function() {
                // Scroll to top
                this.router.navigateTo('my-gfw/subscriptions', {
                  trigger: true
                });
                mps.publish('Subscriptions/new', [this.subscription.toJSON()]);

                this.subscription.clear({ silent: true })
                  .set(currentParams);
              }.bind(this))

              .fail(function(){
                mps.publish('Notification/open', ['notification-my-gfw-subscription-incorrect']);
              }.bind(this));
          } else {
            this.updateForm();
            mps.publish('Notification/open', ['notification-my-gfw-subscription-incorrect']);
          }
        }.bind(this))
        .catch(function(e) {
          mps.publish('Notification/open', ['notification-my-gfw-not-logged']);
        }.bind(this));
    },

    onClickTestWebhook: function (e) {
      e && e.preventDefault();

      var value = this.$subscriptionUrl.val();

      if (value !== '' && !this.$testWebhookButton.hasClass('-loading')) {
        _.each(this.subscription.attributes.datasets, function(dataset, i) {
          setTimeout(function () {
            subscriptionsService.testWebhook(this.$subscriptionUrl.val(), dataset)
          }.bind(this), i * 100);
        }.bind(this));

        var loader = this.$testWebhookButton.find('.webhook-loader');
        loader.html(this.$testWebhookButton.find('.webhook-text').html());
        this.$testWebhookButton.addClass('-loading');
        var intervalTimes = 0;
        var pointsInterval = setInterval(function() {
          if (intervalTimes === 3) {
            loader.html('Test webhook - data sent');
            setTimeout(function () {
              this.$testWebhookButton.removeClass('-loading');
            }.bind(this), 2000);

            clearInterval(pointsInterval);
          } else {
            loader.html(loader.html() + '.');
          }
          intervalTimes++;
        }.bind(this), 500);
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
