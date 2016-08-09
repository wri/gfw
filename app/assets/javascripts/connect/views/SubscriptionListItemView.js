define([
  'backbone',
  'handlebars',
  'moment',
  'chosen',
  'uri',  
  'connect/views/ListItemDeleteConfirmView',
  'connect/views/SubscriptionListItemLayerSelectView',
  'text!connect/templates/subscriptionListItem.handlebars'
], function(
  Backbone,
  Handlebars,
  moment,
  chosen,
  UriTemplate,
  ListItemDeleteConfirmView,
  SubscriptionListItemLayerSelectView,
  tpl
) {

  'use strict';


  var LANGUAGE_MAP = {
    'EN': 'English',
    'PT': 'Portuguese'
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
      'click .subscriptions-delete-item': 'confirmDestroy',
      'click h4': 'editName',
      'click #subscriptionLanguage': 'editLanguage',
      'click .view-on-map': 'viewOnMap',
      'click .dataset': 'editLayers',
      'blur h4': 'saveName',
      'keyup': 'handleKeyUp'
    },

    tagName: 'tr',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.subscription = options.subscription;

      this.render();
    },

    render: function() {
      var subscription = this.subscription.toJSON();

      subscription.language = LANGUAGE_MAP[subscription.language];
      subscription.confirmationUrl = this.confirmationUrl();
      subscription.viewOnMapURL = this.viewOnMapURL();
      subscription.topics = this.subscription.formattedTopics();
      if (subscription.createdAt !== undefined) {
        subscription.createdAt = moment(subscription.createdAt).
        format('dddd, YYYY-MM-DD, h:mm a');
      }

      this.$el.html(this.template(subscription));

      this.$('#subscriptionLanguageSelector').chosen({
        width: '150px',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: 'Oops, nothing found!'
      });

      return this;
    },

    confirmationUrl: function() {
      var subscription = this.subscription.toJSON();
      return window.gfw.config.GFW_API_HOST_NEW_API + '/subscriptions/' +
        subscription.id + '/send_confirmation';
    },

    viewOnMapURL: function() {
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

    viewOnMap: function() {
      window.ga('send', 'event', 'User Profile', 'Go to the Map');
    },

    confirmDestroy: function(event) {
      event.preventDefault();

      var confirmView = new ListItemDeleteConfirmView({
        model: this.subscription});
      
      this.$el.append(confirmView.render().el);
      
      this.listenTo(confirmView, 'confirmed', function() {
        this.destroy();
        window.ga('send', 'event', 'User Profile', 'Delete Subscription');
      }.bind(this));
    },

    destroy: function() {
      this.subscription.destroy({
        success: this.remove.bind(this)});
    },

    editLayers: function() {
      var layerSelectView = new SubscriptionListItemLayerSelectView({
        subscription: this.subscription});
      this.$('.dataset').replaceWith(layerSelectView.render().el);

      this.listenTo(layerSelectView, 'complete', this.render);
    },

    editName: function(event) {
      var $el = $(event.currentTarget);
      if (!$el.hasClass('editing')) {
        var value = this.subscription.get('name');

        $el.addClass('editing').
          html('<input />').
          find('input').val(value).
          focus();
      }
    },

    editLanguage: function(event) {
      var $el = $(event.currentTarget);
      if (!$el.hasClass('editing')) {
        $el.addClass('editing');

        var value = this.subscription.get('language');
        this.$('#subscriptionLanguageSelector').
          val(value).
          on('change', this.saveLanguage.bind(this)).
          trigger('chosen:updated');
        this.$('#subscriptionLanguageSelector_chosen').addClass('editing');
      }
    },

    saveLanguage: function(event) {
      var $el = this.$('#subscriptionLanguageSelector_chosen');
      if ($el.hasClass('editing')) {
        var $selector = this.$('#subscriptionLanguageSelector'),
            old_value = this.subscription.get('language'),
            new_value = $selector.val();

        this.subscription.save('language', new_value, {
          wait: true,
          silent: true,
          success: this.resetLanguage.bind(this),
          error: function() {
            $selector.
              addClass('error').
              val(old_value);
          }
        });
      }
    },

    resetLanguage: function() {
      var $el = this.$('#subscriptionLanguage'),
          $selector = this.$('#subscriptionLanguageSelector'),
          value = this.subscription.get('language');

      $el.removeClass('editing').html(LANGUAGE_MAP[value]);
      $selector.removeClass('editing').val(value).trigger('chosen:updated');
    },

    handleKeyUp: function(event) {
      if (event.keyCode === 13) {
        return $(event.currentTarget).blur();
      }

      if (event.keyCode === 27) {
        this.resetLanguage();
        return this.resetName();
      }
    },

    saveName: function(event) {
      var $el = $(event.currentTarget);
      if ($el.hasClass('editing')) {
        var old_value = this.subscription.get('name'),
            new_value = $el.find('input').val();

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

    resetName: function() {
      var $el = this.$('h4'),
          value = this.subscription.get('name');
      $el.removeClass('editing').html(value);
    }
  });

  return SubscriptionListItemView;

});
