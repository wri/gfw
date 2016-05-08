define([
  'map/models/UserModel',
], function(User) {

  'use strict';

  describe('UserModel', function() {

    describe('.setEmailIfEmpty', function() {

      var user;

      beforeEach(function() {
        user = new User();
      });

      it('updates the email if the user has no email', function() {
        user.setEmailIfEmpty('new@email.com');
        expect(user.get('email')).toEqual('new@email.com');
      });

      it('does not update the email if the user already has an email', function() {
        user.set('email', 'old@email.com');
        user.setEmailIfEmpty('new@email.com');
        expect(user.get('email')).toEqual('old@email.com');
      });

    });

  });

});
