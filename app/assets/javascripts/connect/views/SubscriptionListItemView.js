define([
  'backbone',
  'handlebars',
  'moment',
  'chosen',
  'mps',  
  'connect/views/ListItemDeleteConfirmView',
  'connect/views/ListItemDatasetsConfirmView',
  'text!connect/templates/subscriptionListItem.handlebars'
], function(
  Backbone,
  Handlebars,
  moment,
  chosen,
  mps,
  ListItemDeleteConfirmView,
  ListItemDatasetsConfirmView,
  tpl
) {

  'use strict';

  var SubscriptionListItemView = Backbone.View.extend({
    // We should change this to a common view

    events: {
      'click .btn-edit-name-subscription': 'onClickEditName',
      'blur  .btn-edit-name-subscription': 'onBlurEditName',
      'change #select-language-subscription': 'onChangeLanguage',
      'click .btn-delete-subscription': 'onClickDestroy',
      'click .btn-view-on-map-subscription': 'onClickViewOnMap',
      'click .btn-dataset-subscription': 'onClickDataset',
      'click .btn-dataset-remove': 'onClickDatasetRemove',
    },

    tagName: 'li',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.subscription = options.subscription;
      this.render();
    },

    render: function() {
      var subscription = _.extend({}, this.subscription.toJSON(), {
        confirmationUrl: this.getConfirmationURL(),
        topics: this.subscription.formattedTopics(),
        topicsDelete: (this.subscription.get('datasets').length > 1) ? true : false,
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

        // Check if the value has changed before save it
        if (old_value != new_value) {        
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

      }
    },

    onKeyUpEditName: function(e) {
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
          $el.val(new_value);
          mps.publish('Notification/open', ['notification-my-gfw-subscription-correct']);
        },
        error: function() {
          $el.val(old_value);
          mps.publish('Notification/open', ['notification-my-gfw-subscription-incorrect']);
        }
      });      
    },

    // Destroy
    onClickDestroy: function(e) {
      e.preventDefault();

      this.subscription.set('from', 'your profile');
      
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
      var confirmView = new ListItemDatasetsConfirmView({
        model: this.subscription
      });

      this.$el.append(confirmView.render().el);
      
      // Listen to confirmed param of confirmView
      this.listenTo(confirmView, 'confirmed', function(datasets) {
        this.saveDatasets(datasets);
      }.bind(this));      
    },

    onClickDatasetRemove: function(e) {
      e && e.preventDefault();
      var datasets = _.without(this.subscription.get('datasets'),$(e.currentTarget).data('dataset'));
      this.saveDatasets(datasets);
    },

    /**
     * HELPERS
     * - resetName
     */
    saveDatasets: function(datasets) {
      this.subscription.save('datasets', datasets, {
        wait: true,
        silent: true,
        patch: true,
        success: function() {
          mps.publish('Notification/open', ['notification-my-gfw-subscription-correct']);
        },
        error: function() {
          mps.publish('Notification/open', ['notification-my-gfw-subscription-incorrect']);
        }
      });
    },

    resetName: function() {
      var $el = this.$('.btn-edit-name-subscription'),
          value = this.subscription.get('name');
      $el.removeClass('-editing').html(value);
    }
  });

  return SubscriptionListItemView;

});
