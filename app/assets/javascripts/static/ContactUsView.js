define([
  'jquery',
  'backbone'
], function($, Backbone) {

  'use strict';

  const topics = {
    'report-a-bug-or-error-on-gfw': {
      name: 'Report a bug or error on GFW',
      placeholder: 'Explain the bug or error and tell us where on the website you encountered it. What browser (e.g., Chrome version 50.0.2661.94 m) and operating system (e.g., Windows 8.1) do you use?',
    },
    'provide-feedback': {
      name: 'Provide feedback',
      placeholder: 'Tell us about your experience with GFW! Examples: How can we improve GFW? Why did you visit GFW? How do you use GFW? If and how is the information provided by GFW useful for your work? Are there any additional features and/or data that would be useful?  Was anything confusing or difficult to use?  Etc...',
    },
    'media-request': {
      name: 'Media request',
      placeholder: 'How can we help you?',
    },
    'data-related-inquiry': {
      name: 'Data-related inquiry or suggestion',
      placeholder: 'How can we help you?',
    },
    'gfw-commodities-inquiry': {
      name: 'GFW Commodities inquiry',
      placeholder: 'How can we help you?',
    },
    'gfw-fires-inquiry': {
      name: 'GFW Fires inquiry',
      placeholder: 'How can we help you?',
    },
    'gfw-climate-inquiry': {
      name: 'GFW Climate inquiry',
      placeholder: 'How can we help you?',
    },
    'gfw-water-inquiry': {
      name: 'GFW Water inquiry',
      placeholder: 'How can we help you?',
    },
    'general-inquiry': {
      name: 'General inquiry',
      placeholder: 'How can we help you?',
    },
  }

  const constraints = {
    'contact-email': {
      presence: true,
      email: true
    },
    'contact-topic': {
      presence: true
    },
    'contact-message': {
      presence: true
    }
  };

  var ContacUsView = Backbone.View.extend({

    el: '#contact_us',

    events: {
      'click .js-btn-submit': 'actionSubmit',
      'change input, textarea, select': 'changeInput',
      'change #contact-topic': 'changeTopic'
    },

    initialize: function() {
      this.$spinner = this.$el.find('.m-spinner');
      this.$form = this.$el.find('#contact-form');
      this.$step = this.$el.find('.step');
      this.$stepBtn = this.$el.find('.step-btn');
      this.$contactMessage = this.$el.find('#contact-message');
    },

    actionSubmit(e) {
      e && e.preventDefault();
      (this.validate(e)) ? this.sendForm() : this.updateForm();
    },

    // Send the data to the API
    sendForm() {
      // Production send request
      // Send request
      this.$spinner.addClass('-start');
      var xhr = new XMLHttpRequest();

      xhr.open('POST', window.gfw.config.GFW_API_HOST + '/emails');
      xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

      xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 201) {
          this.changeStep('success');
          this.resetForm();
          this.$spinner.removeClass('-start');
        } else {
          this.changeStep('error');
          this.$spinner.removeClass('-start');
        }
      }.bind(this);

      xhr.onerror = () => {
        this.changeStep('error');
        this.$spinner.removeClass('-start');
      }

      xhr.send(JSON.stringify(this.serialize(this.$form[0])));

      // // Develop Send request
      // // Comment this code if this is going to pro
      // if (true) {
      //   this.changeStep('success');
      //   this.$spinner.removeClass('-start');
      // } else {
      //   this.changeStep('error');
      //   this.$spinner.removeClass('-start');
      // }
    },

    updateForm() {
      this.$form.find('input, textarea, select').removeClass('-error');
      this.$form.find('label').removeClass('-error');
      for (var key in this.errors) {
        var $input = this.$form.find('#'+key);
        var $label = this.$form.find('label[for='+key+']');
        $input.addClass('-error');
        $label.addClass('-error');
      }
    },

    resetForm() {
      this.$form.find('input, textarea, select').val(null);
    },

    serialize(form) {
    	if (!form || form.nodeName !== "FORM") {
    		return;
    	}
    	let obj = {};
    	for (let i = form.elements.length - 1; i >= 0; i = i - 1) {
    		if (form.elements[i].name === "") {
    			continue;
    		}
    		switch (form.elements[i].nodeName) {
    		case 'INPUT':
    			switch (form.elements[i].type) {
    			case 'text':
    			case 'email':
    			case 'hidden':
    			case 'password':
    			case 'button':
    			case 'reset':
    			case 'submit':
    				obj[form.elements[i].name] = form.elements[i].value;
    				break;
    			case 'checkbox':
    			case 'radio':
            if (form.elements[i].checked) {
              obj[form.elements[i].name] = form.elements[i].value;
            } else if (!obj[form.elements[i].name]) {
              obj[form.elements[i].name] = false;
            }
    				break;
    			case 'file':
    				break;
    			}
    			break;
    		case 'TEXTAREA':
    			obj[form.elements[i].name] = form.elements[i].value;
    			break;
    		case 'SELECT':
    			switch (form.elements[i].type) {
    			case 'select-one':
    				obj[form.elements[i].name] = form.elements[i].value;
    				break;
    			case 'select-multiple':
    				for (let j = form.elements[i].options.length - 1; j >= 0; j = j - 1) {
    					if (form.elements[i].options[j].selected) {
    						obj[form.elements[i].name] = form.elements[i].options[j].value;
    					}
    				}
    				break;
    			}
    			break;
    		case 'BUTTON':
    			switch (form.elements[i].type) {
    			case 'reset':
    			case 'submit':
    			case 'button':
    				obj[form.elements[i].name] = form.elements[i].value;
    				break;
    			}
    			break;
    		}
    	}
    	return obj;
    },

    validate(e) {
      e && e.preventDefault();
      let attributes = this.serialize(this.$form[0]);

      // Validate form, if is valid the response will be undefined
      this.errors = validate(attributes, constraints);
      return ! !!this.errors;
    },

    validateInput(name, value) {
      let errors = validate.single(value, constraints[name]);
      if (!!errors && this.errors) {
        this.errors[name] = errors[0];
      } else {
        this.errors && this.errors[name] && delete this.errors[name];
      }
    },

    changeInput(e) {
      e && e.preventDefault();
      this.validateInput(e.currentTarget.name, e.currentTarget.value);
      this.updateForm();
    },

    changeStep(step) {
      this.$step.removeClass('-active');
      this.$stepBtn.removeClass('-active');

      // Set actives
      this.$el.find('.step[data-step="'+step+'"]').addClass('-active');
      this.$el.find('.step-btn[data-step="'+step+'"]').addClass('-active');
    },

    changeTopic(e) {
      var topic = e.currentTarget.value;
      if (!!topic) {
        var placeholder = topics[topic]['placeholder'];
        this.$contactMessage.attr('placeholder', placeholder);
      }
    }

  });

  return ContacUsView;
});
