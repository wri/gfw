define([
  'backbone', 'handlebars', 'moment',
  'connect/views/ListItemDeleteConfirmView', 'connect/views/SubscriptionListItemLayerSelectView',
  'text!connect/templates/subscriptionListItem.handlebars'
], function(
  Backbone, Handlebars, moment,
  ListItemDeleteConfirmView, SubscriptionListItemLayerSelectView,
  tpl
) {

  'use strict';

  var SubscriptionListItemView = Backbone.View.extend({
    events: {
      'click .subscriptions-delete-item': 'confirmDestroy',
      'click h4': 'editName',
      'click .view-on-map': 'viewOnMap',
      'click .dataset': 'editLayers',
      'blur h4': 'saveName',
      'keyup h4': 'handleNameKeyUp'
    },

    tagName: 'tr',

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.subscription = options.subscription;

      this.render();
    },

    render: function() {
      var subscription = this.subscription.toJSON();
      console.log(subscription);

      subscription.confirmationUrl = this.confirmationUrl();
      subscription.topics = this.subscription.formattedTopics();
      if (subscription.createdAt !== undefined) {
        subscription.createdAt = moment(subscription.createdAt).
        format('dddd, YYYY-MM-DD, h:mm a');
      }

      this.$el.html(this.template(subscription));

      return this;
    },

    confirmationUrl: function() {
      return window.gfw.config.GFW_API_HOST_NEW_API + '/subscriptions/' +
        this.subscription.id + '/send_confirmation';
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

    handleNameKeyUp: function(event) {
      if (event.keyCode === 13) {
        return $(event.currentTarget).blur();
      }

      if (event.keyCode === 27) {
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
