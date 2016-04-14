define([
  'backbone', 'jquery',
  'map/views/tabs/SubscribeView',
  'map/models/UserModel',
], function(Backbone, $, SubscribeView, User) {

  'use strict';

  describe('SubscribeView', function() {

    describe('.subscribe', function() {

      var user,
          context,
          email = 'new@email.com';

      beforeEach(function() {
        user = new User();
        spyOn(user, 'save');

        window.ga = function() {};
        var subscription = new (Backbone.Model.extend({
          url: '/', defaults: {email: email}}))();

        context = {
          user: user,
          subscription: subscription,
          onSave: function() {},
          close: function() {},
          showSpinner: function() {},
          stopListening: function() {},
          '$el': $('<div>')
        };
      });

      it('updates the user email if they do not have one', function() {
        SubscribeView.prototype.subscribe.call(context);
        expect(user.get('email')).toEqual(email);
        expect(user.save).toHaveBeenCalled();
      });

      it('does not update the user email if they have one', function() {
        user.set('email', 'old@email.com');
        SubscribeView.prototype.subscribe.call(context);
        expect(user.get('email')).toEqual('old@email.com');
        expect(user.save).toHaveBeenCalled();
      });

    });

  });

});
