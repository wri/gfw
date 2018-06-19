define([
  'jquery',
  'backbone',
  'handlebars',
  'underscore',
  'mps',
  'validate',
  'jquery_fileupload',

], function($, Backbone, Handlebars, _, mps, validate, jquery_fileupload) {

  'use strict';

  var MAXFILESIZE = 2000000000;
  var TIMEOUT = 3600000;

  var constraints = {
    'data_format': {
      presence: true,
    },
    'data_show': {
      presence: true,
    },
    'data_email': {
      presence: true,
      email: true,
    },
    'data_agree': {
      presence: true,
      inclusion: {
        within: [true],
      }
    },
    'data_permission': {
      presence: true,
      inclusion: {
        within: [true],
      }
    },
    'data_terms': {
      presence: true,
      inclusion: {
        within: [true],
      }
    },
    'data_updating': {
      presence: true,
      inclusion: {
        within: [true],
      }
    },
    'data_uploaded': {
      presence: true
    },
    'metadata_title': {
      presence: true
    },
    'metadata_function': {
      presence: true
    },
    'metadata_geographic_coverage': {
      presence: true
    },
    'metadata_source': {
      presence: true
    },
    'metadata_date_of_content': {
      presence: true
    },
    'metadata_cautions': {
      presence: true
    },
  };


  var ContributeDataView = Backbone.View.extend({
    el: '#contributeDataView',

    model: new (Backbone.Model.extend({
      urlRoot: window.gfw.config.GFW_API + '/form/contribution-data/',
      sync: function(method, model, options) {
        options || (options = {});

        if (!options.crossDomain) {
          options.crossDomain = true;
        }

        if (!options.xhrFields) {
          options.xhrFields = {withCredentials:true};
        }

        return Backbone.sync.call(this, method, model, options);
      },
    })),

    events: {
      'change .js-radio-fieldset' : 'onChangeFieldset',
      'change .js-radio-uploadtype' : 'onChangeUploadType',
      'change input,textarea,select' : 'onChangeInput',
      'click .js-upload-file' : 'onClickFileUpload',
      'change .js-upload-link' : 'onChangeFileLink',
      'submit #new-contribution': 'onSubmitContribution',
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }
      this.cache();
      this.listeners();
      this.setUploadField();
    },

    listeners: function() {
    },

    cache: function() {
      this.$form = this.$el.find('#new-contribution');
      this.$fieldsets = this.$el.find('.-js-fieldset');
      this.$fieldSubmit = this.$el.find('#submit');
      // Other
      this.$fieldOtherName = this.$el.find('#other_name');
      // Uploads
      this.$fieldFileUploadType = this.$el.find('.field-uploadtype');
      this.$fieldFileUpload = this.$el.find('#fileupload');
      this.$fieldFileUploaded = this.$el.find('#fileuploaded');
      this.$fieldFileName = this.$el.find('#fileupload-name');
      this.$fieldFileBtn = this.$el.find('#fileupload-btn');
      this.$fieldFileProgress = this.$el.find('#fileupload-progress');
    },

    setUploadField: function() {
      var that = this;

      this.$fieldFileUpload.fileupload({
        fileInput: this.$fieldFileUpload,
        url: this.$form.data('url'),
        type: 'POST',
        autoUpload: true,
        formData: this.$form.data('form-data'),
        paramName: 'file',
        dataType: 'XML',
        maxFileSize: MAXFILESIZE, // 10 MB
        timeout: TIMEOUT
      })

      .on('fileuploadadd', function (e, data) {
        _.each(data.files, function(file) {
          if (file && file.size > MAXFILESIZE) {
            mps.publish('Notification/open', ['notification-limit-exceed']);
            return;
          } else {
            // Set progress bar
            that.$fieldFileProgress.toggleClass('-uploading', true);
            that.$fieldFileProgress.find('span').width(0);
            // Set upload spinner
            that.$fieldFileBtn.find('.m-spinner').toggleClass('-start', true);
            // Set submit button
            that.$fieldSubmit.toggleClass('disabled', true);
            that.$fieldSubmit.prop('disabled', true);
            that.$fieldSubmit.val('Please wait...');
          }
        });
      })

      .on('fileuploaddone', function (e, data) {
        mps.publish('Notification/open', ['notification-upload-success-server']);

        // extract key and generate URL from response
        var key   = $(data.jqXHR.responseXML).find('Key').text();
        var url   = '//' + that.$form.data('host') + '/' + key;

        // Set 'data_uploaded' val and trigger the change
        that.$fieldFileUploaded.val(url).trigger('change');
        // Set progress bar
        that.$fieldFileProgress.find('span').width('100%');
        // Set upload spinner
        that.$fieldFileBtn.find('.m-spinner').toggleClass('-start', false);
        // Set name of file
        that.$fieldFileName.text(data.files[0].name);
        // Set submit button
        that.$fieldSubmit.toggleClass('disabled', false);
        that.$fieldSubmit.prop('disabled', false);
        that.$fieldSubmit.val('Submit data');

      })

      .on('fileuploadprogress', function (e, data) {
        var progress = parseInt(data.loaded / data.total * 100, 10);
        that.$fieldFileProgress.find('span').width(progress + '%');
      })

      .on('fileuploadfail', function (e, data){
        mps.publish('Notification/open', ['notification-upload-error-server']);
        // Set 'data_uploaded' val and trigger the change
        that.$fieldFileUploaded.val(null);
        // Set progress bar
        that.$fieldFileProgress.toggleClass('-uploading', false);
        // Set upload spinner
        that.$fieldFileBtn.find('.m-spinner').toggleClass('-start', false);
        // Set name of file
        that.$fieldFileName.text('No file chosen');
        // Set submit button
        that.$fieldSubmit.toggleClass('disabled', false);
        that.$fieldSubmit.prop('disabled', false);
        that.$fieldSubmit.val('Submit data');
      });
    },

    /**
     * VALIDATIONS && FORM UPDATE
     * - validate
     * - validateInput
     */
    validate: function(attributesFromForm) {
      // Validate form, if is valid the response will be undefined
      this.errors = validate(attributesFromForm, constraints);
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
      this.$form.find('[for]').removeClass('-error');
      for (var key in this.errors) {
        var $input = this.$form.find('[name='+key+']');
        var $label = this.$form.find('[for='+key+']');
        $input.addClass('-error');
        $label.addClass('-error');
      }
    },

    /**
     * UI EVENTS
     * - onChangeFieldset
     * - onChangeInput
     * - onSubmitContribution
     */
    onChangeFieldset: function(e) {
      var fieldset = this.$form.find('input[name="data_show"]:checked').data('fieldset');
      // Hide/open current filedset
      this.$fieldsets.toggleClass('-active', false);
      this.$fieldsets.filter('#fieldset-'+fieldset).toggleClass('-active', true);

      // Handle exceptions
      switch (fieldset) {
        case 'other':
          this.$fieldOtherName
            .toggleClass('-disabled', false)
            .prop('disabled', false);
          this.$fieldOtherName.focus();
        break;
        default:
          this.$fieldOtherName
            .toggleClass('-disabled', true)
            .prop('disabled', true);
      }

    },

    onChangeUploadType: function() {
      var uploadtype = this.$form.find('input[name="data_uploadtype"]:checked').data('uploadtype');
      // Hide/open current filedset
      this.$fieldFileUploadType.toggleClass('-active', false);
      this.$fieldFileUploadType.filter('#uploadtype-'+ uploadtype).toggleClass('-active', true);

    },

    onChangeInput: function(e) {
      var name = e.currentTarget.name,
          value = (e.currentTarget.value == 'on') ? true : e.currentTarget.value;

      this.validateInput(name, value);
      this.updateForm();
    },

    onClickFileUpload: function(e) {
      e && e.preventDefault();
      this.$fieldFileUpload.trigger('click');
    },

    onChangeFileLink: function(e) {
      e && e.preventDefault();
      this.$fieldFileUploaded.val($(e.currentTarget).val()).trigger("change");
    },

    onSubmitContribution: function(e) {
      e && e.preventDefault();
      var attributesFromForm = validate.collectFormValues(this.$form);

      if (this.validate(attributesFromForm)) {
        this.model.set(attributesFromForm).save()
          .then(function(){
            mps.publish('Notification/open', ['contribution-new-form-success']);
            this.trackForm(attributesFromForm, false);
            $(document).scrollTop(0);
            setTimeout(function(){ window.location.reload(); }, 1000);
          }.bind(this))
          .fail(function(){
            mps.publish('Notification/open', ['contribution-new-form-error']);
            this.trackForm(attributesFromForm, true);
          }.bind(this))

      } else {
        this.updateForm();
        mps.publish('Notification/open', ['contribution-new-form-error']);
        this.trackForm(attributesFromForm, true);
        $(document).scrollTop(0);
      }
    },

    trackForm: function (attributesFromForm, error) {
      var label = error
        ? "Incomplete Form"
        : (
          attributesFromForm.data_uploadtype === "Link"
            ? "Link by URL"
            : "Upload a shape file"
      );
      ga('send', 'event', 'Get Involved', 'Contribute Data', label);
    }
  });

  return ContributeDataView;

});