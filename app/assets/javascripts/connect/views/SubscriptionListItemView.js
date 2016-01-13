define([
  'backbone', 'handlebars', 'moment',
  'connect/collections/Subscriptions',
  'connect/views/SubscriptionListItemDeleteConfirmView',
  'text!connect/templates/subscriptionListItem.handlebars'
], function(Backbone, Handlebars, moment, Subscriptions, SubscriptionListItemDeleteConfirmView, tpl) {

  'use strict';

  var SubscriptionListItemView = Backbone.View.extend({
    events: {
      'click .subscriptions-delete-item': 'confirmDestroy',

      'click h4': 'editName',
      'blur h4': 'saveName',
      'keyup h4': 'handleNameKeyUp'
    },

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      this.subscription = options.subscription;

      this.render();
    },

    render: function() {
      var subscription = this.subscription.toJSON();

      subscription.params.geom = JSON.stringify(subscription.params.geom);
      if (subscription.created !== undefined) {
        subscription.created = moment(subscription.created).
          format('dddd, YYYY-MM-DD, h:mm a');
      }

      this.$el.html(this.template(subscription));

      return this;
    },

    confirmDestroy: function(event) {
      event.preventDefault();

      var confirmView = new SubscriptionListItemDeleteConfirmView({
        subscription: this.subscription});
      this.$el.append(confirmView.render().el);
      this.listenTo(confirmView, 'confirmed', function() {
        this.destroy();
      }.bind(this));
    },

    destroy: function() {
      this.subscription.destroy({
         success: this.remove.bind(this)});
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
