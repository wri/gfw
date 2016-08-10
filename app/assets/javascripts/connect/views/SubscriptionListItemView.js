define([
  'backbone',
  'handlebars',
  'moment',
  'chosen',
  'uri',
  'mps',  
  'connect/views/ListItemDeleteConfirmView',
  'connect/views/SubscriptionListItemLayerSelectView',
  'text!connect/templates/subscriptionListItem.handlebars'
], function(
  Backbone,
  Handlebars,
  moment,
  chosen,
  UriTemplate,
  mps,
  ListItemDeleteConfirmView,
  SubscriptionListItemLayerSelectView,
  tpl
) {

  'use strict';


  var LANGUAGE_MAP = {
    'en': 'English',
    'pt': 'Portuguese'
  };

  var MAP_URL = '/map/3/0/0/{iso}/grayscale/{baselayers}{?fit_to_geom,geostore,wdpaid,use,useid}';

  var SubscriptionListItemView = Backbone.View.extend({
    // We should change this to a common view
    datasets: [
      {
        name: 'loss',
        slug: 'umd-loss-gain',
      },{
        name: 'forestgain',
        slug: 'umd-loss-gain'
      },{
        name: 'forma',
        slug: 'forma-alerts'
      },{
        name: 'imazon',
        slug: 'imazon-alerts',
      },{
        name: 'terrailoss',
        slug: 'terrai-alerts',
      },{
        name: 'prodes',
        slug: 'prodes-loss',
      },{
        name: 'guyra',
        slug: 'guira-loss',
      },{
        name: 'viirs_fires_alerts',
        slug: 'viirs-active-fires',
      },{
        name: 'umd_as_it_happens',
        slug: 'glad-alerts',
      }
    ],

    events: {
      'click .btn-edit-name-subscription': 'onClickEditName',
      'blur  .btn-edit-name-subscription': 'onBlurEditName',
      'change #select-language-subscription': 'onChangeLanguage',
      'click .btn-delete-subscription': 'onClickDestroy',
      'click .btn-view-on-map-subscription': 'onClickViewOnMap',
      'click .btn-dataset-subscription': 'onClickDataset'
    },

    tagName: 'tr',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.subscription = options.subscription;
      this.render();
    },

    render: function() {
      var subscription = _.extend({}, this.subscription.toJSON(), {
        confirmationUrl: this.getConfirmationURL(),
        viewOnMapURL: this.getViewOnMapURL(),
        topics: this.subscription.formattedTopics(),
        createdAt: (!!this.subscription.get('createdAt')) ? moment(this.subscription.get('createdAt')).format('dddd, YYYY-MM-DD, h:mm a') : this.subscription.get('createdAt')
      });

      this.$el.html(this.template(subscription));
      this.cache();
      this.renderChosen();
      return this;
    },

    cache: function() {
      this.$selectLanguage = this.$el.find('#select-language-subscription');
    },

    renderChosen: function() {
      this.$selectLanguage
        .val(this.subscription.get('language') || 'en')
        // .chosen({
        //   width: '150px',
        //   disable_search: true,
        //   allow_single_deselect: true,
        //   inherit_select_classes: true,
        //   no_results_text: 'Oops, nothing found!'
        // });
    },

    /**
     * GETTERS
     * - getConfirmationURL
     * - getViewOnMapURL
     */
    getConfirmationURL: function() {
      var subscription = this.subscription.toJSON();
      return window.gfw.config.GFW_API_HOST_NEW_API + '/subscriptions/' + subscription.id + '/send_confirmation';
    },

    getViewOnMapURL: function() {
      var subscription = this.subscription.toJSON();
      var iso = _.compact(_.values(subscription.params.iso)).join('-') || 'ALL';
      var baselayers = _.pluck(_.where(this.datasets, { slug: subscription.datasets[0]}), 'name');
      var mapObject = {
        iso: iso,
        baselayers: baselayers,
        fit_to_geom: true,
        geostore: (!!subscription.params.geostore) ? subscription.params.geostore : null,
        wdpaid: (!!subscription.params.wdpaid) ? subscription.params.wdpaid : null,
        use: (!!subscription.params.use) ? subscription.params.use : null,
        useid: (!!subscription.params.useid) ? subscription.params.useid : null,
      }
      return new UriTemplate(MAP_URL).fillFromObject(mapObject);
    },

    /**
     * UI EVENTS
     * - onClickEditName
     * - onBlurEditName
     * - onChangeLanguage
     * - onClickDestroy
     * - onClickViewOnMap
     * - onClickDataset
     * - onKeyUp
     */
    // Name
    onClickEditName: function(e) {
      var $el = $(e.currentTarget);
      if (!$el.hasClass('-editing')) {
        var value = this.subscription.get('name');

        $el.addClass('-editing').
          html('<input />').
          find('input').val(value).
          focus();

        $el.on('keyup.'+this.subscription.get('id'), this.onKeyUpEditName.bind(this));
      }
    },

    onBlurEditName: function(e) {
      var $el = $(e.currentTarget);
      if ($el.hasClass('-editing')) {
        var old_value = this.subscription.get('name'),
            new_value = $el.find('input').val();

        $el.off('keyup.'+this.subscription.get('id'));

        this.subscription.save('name', new_value, {
          patch: true,
          wait: true,
          silent: true,
          success: this.resetName.bind(this),
          error: function() {
            $el.find('input').
              addClass('error').
              val(old_value).
              focus();
          }
        });
      }
    },

    onKeyUpEditName: function(e) {
      console.log(e.keyCode);
      if (e.keyCode === 13) {
        return $(e.currentTarget).blur();
      }

      if (e.keyCode === 27) {
        return this.resetName();
      }
    },

    // Language
    onChangeLanguage: function(e) {
      var $el = $(e.currentTarget),
          old_value = this.subscription.get('language'),
          new_value = $el.val();

      this.subscription.save('language', new_value, {
        wait: true,
        silent: true,
        patch: true,
        success: function() {
          $el
            .removeClass('error')
            .val(new_value)
        },
        error: function() {
          $el
            .addClass('error')
            .val(old_value);
        }
      });      
    },

    // Destroy
    onClickDestroy: function(e) {
      e.preventDefault();

      // Create and append confirm view
      var confirmView = new ListItemDeleteConfirmView({
        model: this.subscription
      });
      this.$el.append(confirmView.render().el);
      
      // Listen to confirmed param of confirmView
      this.listenTo(confirmView, 'confirmed', function() {
        this.subscription.destroy({
          success: this.remove.bind(this)
        });
        mps.publish('Notification/open', ['notification-my-gfw-subscription-deleted']);       
        window.ga('send', 'event', 'User Profile', 'Delete Subscription');
      }.bind(this));
    },

    // View on map
    onClickViewOnMap: function() {
      window.ga('send', 'event', 'User Profile', 'Go to the Map');
    },

    // Datasets
    onClickDataset: function() {
      var layerSelectView = new SubscriptionListItemLayerSelectView({subscription: this.subscription});
      this.$('.dataset').replaceWith(layerSelectView.render().el);

      this.listenTo(layerSelectView, 'complete', this.render);
    },

    /**
     * HELPERS
     * - resetName
     */
    resetName: function() {
      var $el = this.$('.btn-edit-name-subscription'),
          value = this.subscription.get('name');
      $el.removeClass('-editing').html(value);
    }
  });

  return SubscriptionListItemView;

});
