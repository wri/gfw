define([
  'Class', 'backbone', 'underscore', 'handlebars', 'mps',
  'helpers/languagesHelper',
  'models/UserModel',
  'text!connect/templates/userForm.handlebars'
], function(Class, Backbone, _, Handlebars, mps, languagesHelper, User, tpl) {

  'use strict';

  var UserFormValidator = Class.extend({
    validations: {
      email: {
        message: 'Please enter your email',
        validator: function(user) {
          return ! _.isEmpty(user.get('email'));
        }
      },
      language: {
        message: 'Please enter your language',
        validator: function(user) {
          return ! _.isEmpty(user.get('language'));
        }
      },
      signUpForTesting: {
        message: 'Please enter your email to sign up as an official tester',
        validator: function(user) {
          return !(user.get('signUpForTesting') && _.isEmpty(user.get('email')));
        }
      }
    },

    messages: {},

    isValid: function(user) {
      this.messages = {};

      _.each(this.validations, function(attribute, attributeName) {
        if (attribute.validator(user) === false) {
          this.messages[attributeName] = attribute.message;
        }
      }.bind(this));

      return _.isEmpty(this.messages);
    }
  });

  var UserFormView = Backbone.View.extend({
    className: 'my-gfw-profile-form content-form',

    events: {
      'change select': '_handleSelectChange',
      'change input': '_handleInputChange',
      'keyup input': '_handleInputChange',
      'click #submit': '_submit'
    },

    template: Handlebars.compile(tpl),

    initialize: function(options) {
      options = options || {};
      this.isModal = options.isModal;
      this.user = options.user;
      this.validator = new UserFormValidator();

      if (this.user) {
        this.listenTo(this.user, 'sync', this.render);
        this._checkProfileStatus();
        this.render();
      }
    },

    render: function() {
      var userLang = this.user.getLanguage();
      var languagesList = languagesHelper.getListSelected(userLang);

      this.$el.html(this.template({
        action: window.gfw.config.GFW_API_OLD+'/user',
        redirect: window.location.href,
        user: this.user.toJSON(),
        errors: this.validator.messages,
        isModal: this.isModal,
        languages: languagesList
      }));

      this._renderSelectedOptions();
    },

    _checkProfileStatus: function() {
      var profileComplete = this.user.attributes.profileComplete;
      if (!profileComplete) {
        mps.publish('Notification/open', ['notification-my-gfw-profile-incomplete']);
      }
    },

    _renderSelectedOptions: function() {
      var selectFields = ['sector', 'primaryResponsibilities', 'country', 'howDoYouUse'],
          attributes = this.user.toJSON();

      selectFields.forEach(function(field) {
        var $select = this.$('select[name="'+field+'"]');

        if (!_.isEmpty(attributes[field])) {
          $select.val(attributes[field]);

          var selected = $select.val() || [],
              $input = $select.siblings('input');
          if (selected.indexOf('Other') > -1) {
            $input.show();
            $input.val(_.last(attributes[field]));
          } else {
            $input.hide();
            $input.val('');
          }
        }
      }.bind(this));

      this.$('input[name="signUpForTesting"][value="'+(attributes.signUpForTesting===true).toString()+'"]').
        prop('checked', true);
    },

    _enableSubmit: function() {
      this.$('#submit').removeClass('disabled');
    },

    _handleInputChange: function(event) {
      this._enableSubmit();
    },

    _handleSelectChange: function(event) {
      this._enableSubmit();

      var $el = this.$(event.currentTarget),
          $input = $el.siblings('input');

      var selected = $el.val() || [];
      if (selected.indexOf('Other') > -1) {
        $input.show();
      } else {
        $input.hide();
        $input.val('');
      }
    },

    _submit: function() {
      this.user.checkLogged()
        .then(function(response) {
          var $submitButton = this.$('#submit');

          if ($submitButton.hasClass('disabled')) { return; }

          $submitButton.hide();
          this.$('.spinner3').show();

          var formValues = this.$('form').
          serializeArray().
          reduce(function(prev, curr) {
            if (prev[curr.name] !== undefined) {
              prev[curr.name] = [].concat(prev[curr.name]);
              prev[curr.name].push(curr.value);
            } else {
              prev[curr.name] = curr.value;
            }
            return prev;
          }, {});

          this.user.set(formValues);
          if (this.validator.isValid(this.user)) {
            formValues.profileComplete = true;
            this.user.set({
              profileComplete: true
            });
            this.user.save(formValues, {patch: true}).then(this._redirect.bind(this));
          } else {
            this.render();
            mps.publish('Notification/open', ['notification-my-gfw-profile-errors']);
            window.location.hash = 'user-profile';
          }
        }.bind(this))
        .catch(function(e) {
          mps.publish('Notification/open', ['notification-my-gfw-not-logged']);
        }.bind(this));
    },

    _redirect: function() {
      var match,
        pl     = /\+/g,
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
        query  = window.location.search.substring(1),
        urlParams = {};

      while((match = search.exec(query)) !== null) {
        urlParams[decode(match[1])] = decode(match[2]);
      }

      if (urlParams.redirect !== undefined) {
        window.location.href = urlParams.redirect;
      } else {
        mps.publish('Notification/open', ['notification-my-gfw-profile-saved']);
        this.trigger('saved');
        window.scrollTo(0,0);
      }
    }
  });

  return UserFormView;

});
