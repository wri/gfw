define([
  'Class',
  'jquery',
  'backbone',
  'mps',
  'handlebars',
  'jquery_fileupload',
  'backbone.syphon',
  'moment',
  'underscore',
  'validate',
  'stories/models/StoryModel',
  'stories/models/MediaModel',
  'models/UserModel',
  'stories/views/LatestStoriesView',
  'text!stories/templates/storiesNew.handlebars'
], function(
  Class,
  $,
  Backbone,
  mps,
  Handlebars,
  jquery_fileupload,
  BackboneSyphon,
  moment,
  _,
  validate,
  Story,
  Media,
  User,
  LatestStoriesView,
  tpl
) {

  'use strict';

  var MAP_CONFIG = {
    zoom: 3,
    minZoom: 3,
    maxZoom: 20,
    center: new google.maps.LatLng(15, 27),
    mapTypeId: google.maps.MapTypeId.HYBRID,
    backgroundColor: '#99b3cc',
    disableDefaultUI: true,
  };

  var BASE_URL = 'https://gfw2stories.s3.amazonaws.com/uploads/';

  var constraints = {
    'title': {
      presence: {
        message: "Please enter a title for your story"
      },
    },
    'geojson': {
      presence: {
        message: "Please enter a location for your story"
      },
    },
    'email': {
      email: {
        message: "Please enter a correct email"
      },
    }
  };

  var StoriesNewView = Backbone.View.extend({

    el: '.layout-content',

    template: Handlebars.compile(tpl),

    events: {
      'click #controlZoomIn': '_zoomIn',
      'click #controlZoomOut': '_zoomOut',
      'click #autoLocate': '_autoLocate',
      'input #video' : 'videoInput',
      'dragenter .sortable' : 'dragenter',
      'dragstart .sortable' : 'dragstart',
      'click #submit': 'submit',
      'click .upload_picture': 'showFileSelector',
      'change #hideUser' : 'onChangeHideUser'
    },

    initialize: function(params) {
      this.sourceDrag = undefined;
      this.errors = null;
      this.user = new User();
      this.id = params && params.id || null;
      this.router = params.router;
      this.alreadyLoggedIn = params.alreadyLoggedIn;

      if (this.alreadyLoggedIn) {
        this.user.fetch()
          .then(function(){
            this.initStory();
          }.bind(this))
      } else {
        this.renderPlaceHolder();
      }

    },

    cache: function() {
      this.$form = $('#new_story');
      this.$personalInfo = $('#field-personal-info');
    },

    initStory: function() {
      if (this.id) {
        this.story = new Story({
          id: this.id,
          edit: true
        });
        this.story
          .fetch()
          .done(function(res) {
            this.render(res);
            this.renderMedia();
            this.cache();
          }.bind(this));
      } else {
        this.story = new Story();
        this.render();
        this.cache();
      }
      this.setListeners();
    },

    setListeners: function() {
      $(document).on('keyup keypress', 'input, textarea', function(e){
        var charCode = (e.which) ? e.which : e.keyCode;
        if( charCode === 13 ) {
          e.preventDefault();
          return false;
        }
      });
    },

    videoInput: function(e) {
      if ($(e.target).val().length == 0) {
        var removable = document.getElementById('videothumbnail');
        if (removable) {
          removable.parentNode.removeChild(removable);
        }
      } else {
        var media = new Media({
          embedUrl: $(e.target).val()
        });
        this.story.addMedia(media);
        this._addVideoThumbnail(media);
      }
    },

    _getVideoID: function(url) {
      // template: http://img.youtube.com/vi/<video-id-here>/default.jpg

      if (url.length) {
        var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        if (match && match[2].length == 11) {
          mps.publish('Notification/close');
          return 'http://img.youtube.com/vi/' + match[2] + '/default.jpg';
        } else {
          mps.publish('Notification/open', ['notif-not-a-correct-youtube-link']);
          return null;
        }
      }
      return null;
    },

    _addVideoThumbnail: function(media) {
      var vidID  = this._getVideoID(media.attributes.embedUrl),
          $thumb = $('#videothumbnail');

      if ($thumb.length > 0) {
        if (!!vidID) {
          $thumb.find('.inner_box').css('background-image','url('+ vidID +')');
          $thumb.data('orderid', media.attributes.embedUrl);
        } else {
          var videos = this.story.get('media').filter( function(model) {
            return !!model.get('embedUrl')
          });
          this.story.get('media').remove(videos);

          $thumb.fadeOut(250, function() {
            $thumb.remove();
          });
        }
      } else {
        if (!!vidID) {
          $('.thumbnails').append('<li class="sortable thumbnail" draggable="true" id="videothumbnail" data-orderid="'+ media.attributes.embedUrl +'"><div class="inner_box" style=" background-image: url('+ vidID +');"></div><a href="#" class="destroy"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shape-close"></use></svg></a></li>');
          $thumb = $('#videothumbnail');
          $thumb.find('.destroy').on('click', function(e) {
            e.preventDefault();

            var confirmation = confirm('Are you sure?')

            if (confirmation === true) {
              var videos = this.story.get('media').filter( function(model) {
                return !!model.get('embedUrl')
              });
              this.story.get('media').remove(videos);

              $("#video").val('');
              $thumb.fadeOut(250, function() {
                $thumb.remove();
              });
            }
          }.bind(this));
        }
      }

      this.oldUrl = media.attributes.embedUrl;
    },

    _addImageThumbnail: function(media) {
      var $thumb = $('<li class="sortable thumbnail" draggable="true" data-orderid="'+ media.attributes.previewUrl +'" ><div class="inner_box" style=" background-image: url('+ BASE_URL + media.attributes.previewUrl +');"></div><a href="#" class="destroy"><svg><use xlink:href="#shape-close"></use></svg></a></li>');

      $(".thumbnails").append($thumb);

      $thumb.find('.destroy').on('click', function(e) {
        e.preventDefault();

        var confirmation = confirm('Are you sure?')

        if (confirmation == true) {

          var image = this.story.get('media').filter( function(model) {
            return model.get('previewUrl') == $thumb.data('orderid')
          });
          this.story.get('media').remove(image);

          $thumb.fadeOut(250, function() {
            $thumb.remove();
          });
        }
      }.bind(this));
    },

    showFileSelector: function(event) {
      event.preventDefault();
      this.$('#fileupload').click();
    },

    renderFileUploader: function() {
      var that = this;

      var remainingFiles = 0;
      $('#fileupload').fileupload({
        url: '/media/upload',
        dataType: 'json',
        autoUpload: true,
        acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
        maxFileSize: 4000000, // 4 MB
        // Enable image resizing, except for Android and Opera,
        // which actually support image resizing, but fail to
        // send Blob objects via XHR requests:
        disableImageResize: /Android(?!.*Chrome)|Opera/
        .test(window.navigator.userAgent),
        previewMaxWidth: 132,
        previewMaxHeight: 76,
        previewCrop: true,
        timeout: 3600000
      })

      .on('fileuploadadd', function (e, data) {
        data.context = $('<div/>').appendTo('#files');

        remainingFiles += _.size(data.files);
        _.each(data.files, function(file) {
          if (file && file.size > 4000000) {
            mps.publish('Notification/open', ['notification-limit-exceed']);
            return;
          } else {
            var filename = that.prettifyFilename(file.name);
            var $thumbnail = $("<li class='thumbnail preview' data-name='"+filename+"' ><div class='filename'>"+ file.name +"</div><div class='spinner'><svg><use xlink:href='#shape-spinner'></use></svg></div></li>");
            $('.thumbnails').append($thumbnail);
            $thumbnail.fadeIn(250);

            var $submitButton = $("form input[type='submit']");
            $submitButton.addClass('disabled');
            $submitButton.attr('disabled', 'disabled');
            $submitButton.val('Please wait...');
          }
        });
      })

      .on('fileuploaddone', function (e, data) {
        var files = [data.result];

        _.each(files, function (file) {
          remainingFiles -= 1;

          var media = new Media({
            previewUrl: file.basename
          });

          that.story.addMedia(media);

          var url = file.url.replace('https', 'http');
          var $thumb = $('<li class="sortable thumbnail" draggable="true" data-orderid="'+ file.basename +'" ><div class="inner_box" style=" background-image: url('+url+');"></div><a href="#" class="destroy"><svg><use xlink:href="#shape-close"></use></svg></a></li>');

          var filename = that.prettifyFilename(file.basename).substring(45);


          // Remove the preview image
          $(".thumbnail[data-name='"+filename+"']").fadeOut(250, function() {
            $(this).remove();

            $(".thumbnails").append($thumb);
            $thumb.fadeIn(250);
          });

          $thumb.find('.destroy').on('click', function(e) {
            e.preventDefault();

            var confirmation = confirm('Are you sure?')

            if (confirmation == true) {

              var image = this.story.get('media').filter( function(model) {
                return model.get('previewUrl') == $thumb.data('orderid')
              });
              this.story.get('media').remove(image);

              $thumb.fadeOut(250, function() {
                $thumb.remove();
              });
            }
          }.bind(that));
        });

        if (remainingFiles <= 0) {
          var $submitButton = $("form input[type='submit']");
          $submitButton.val('Submit story');
          $submitButton.removeClass('disabled');
          $submitButton.attr('disabled', false);
        }

        ga('send', 'event', 'Stories', 'New story', 'submit');
      })

      .on('fileuploadfail', function (e, data){
        mps.publish('Notification/open', ['notification-upload-error-server']);
        var $submitButton = $("form input[type='submit']");
        $submitButton.val('Submit story');
        $submitButton.removeClass('disabled');
        $submitButton.attr('disabled', false);
      });
    },

    zoomToStory: function() {
      var pos = new google.maps.LatLng(this.story.get('lat'), this.story.get('lng'));
      this.map.panTo(pos);
      this.map.setZoom(18);
    },

    setStoryLocationToCenter: function() {
      var center = this.map.getCenter();
      this.story.set('geojson', { "type": "Point", "coordinates": [center.lng(), center.lat()] });
      this.story.set('lat', center.lat(), { silent: true });
      this.story.set('lng', center.lng(), { silent: true });
    },

    renderMap: function() {
      var $searchInput = $('.map-search-input');

      // Load map
      this.map = new google.maps.Map($('#map')[0], MAP_CONFIG);

      // Listen to map loaded
      google.maps.event.addListenerOnce(
        this.map, 'idle', function() {
          if (this.story.hasLocation()) {
            this.zoomToStory();
          } else {
            this._autoLocate();
          }
        }.bind(this)
      );

      // Set autocomplete search input
      this.autocomplete = new google.maps.places.Autocomplete($searchInput[0], {types: ['geocode']});
      // Listen to selected areas (search)
      google.maps.event.addListener(this.autocomplete, 'place_changed', function() {
        var place = this.autocomplete.getPlace();
        if (place && place.geometry && place.geometry.viewport) {
          this.map.fitBounds(place.geometry.viewport)
        }
        if (place && place.geometry && place.geometry.location && !place.geometry.viewport) {
          var index = [];
          for (var x in place.geometry.location) {
             index.push(x);
          }
          this.map.setCenter(new google.maps.LatLng(place.geometry.location[index[0]], place.geometry.location[index[1]]));
        }
      }.bind(this));

      google.maps.event.addDomListener($searchInput[0], 'keydown', function(e) {
        if (e.keyCode == 13) {
          e.preventDefault();
        }
      });

      google.maps.event.addListener(
        this.map, 'zoom_changed', this.setStoryLocationToCenter.bind(this));
      google.maps.event.addListener(
        this.map, 'dragend', this.setStoryLocationToCenter.bind(this));
    },

    _autoLocate: function(e){
      var $autoLocate = this.$('#autoLocate');
      $autoLocate.addClass('active');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            $autoLocate.removeClass('active');
            var lat = position.coords.latitude,
                lng = position.coords.longitude;
            this.story.set('geojson', { "type": "Point", "coordinates": [lng, lat] });
            this.story.set('lat', lat, {silent: true});
            this.story.set('lng', lng, {silent: true});
            this.zoomToStory();
          }.bind(this),

          function() {
            $autoLocate.removeClass('active');
            mps.publish('Notification/open', ['notification-enable-location']);
          }
        );
      } else {
        $autoLocate.removeClass('active');
      }
    },

    isbefore: function(a, b) {
      if (a.parentNode == b.parentNode) {
        for (var cur = a; cur; cur = cur.previousSibling) {
          if (cur === b) {
              return true;
          }
        }
      }
      return false;
    },

    dragenter: function(e) {
      var target = e.target;
      if (! !!target.classList.contains('sortable')) {
        // check we're dropping the element in a proper draggable element
        target = target.closest('.sortable');
      }

      if (this.isbefore(this.sourceDrag, target)) {
        target.parentNode.insertBefore(this.sourceDrag, target);
      } else {
        target.parentNode.insertBefore(this.sourceDrag, target.nextSibling);
      }

      var orderedArray = _.map(this.$('.sortable'), function(sort) {
        return $(sort).data('orderid');
      })

      this.story.get('media').move(orderedArray);
    },

    dragstart: function(e) {
      this.sourceDrag = e.target;
      (e.originalEvent || e).dataTransfer.effectAllowed = 'move';
    },

    //ZOOM
    _zoomIn: function() {
      this.map.setZoom(this.map.getZoom() + 1);
    },
    _zoomOut: function(){
      this.map.setZoom(this.map.getZoom() - 1);
    },

    prettifyFilename: function (filename) {
      var file = filename.substring(0,filename.length - 4);
      return file.toLowerCase().replace(/ /g,"_");
    },

    submit: function(event) {
      event.preventDefault();

      var attributesFromForm = Backbone.Syphon.serialize(this.$('form#new_story'));
      // As long as the checkbox is for just the oposite
      attributesFromForm.hideUser = !attributesFromForm.hideUser;

      // Remove 'media' because we want to set it from the model
      // I don't know why this serializing is returning 'media { image: "" }'
      if (attributesFromForm.media) {
        delete attributesFromForm.media;
      }

      this.story.set(_.extend({ visible: true }, this.story.toJSON(), attributesFromForm));

      if (this.validate()) {
        this.story.save()
          .then(function(story){
            var id = story.data.id;
            this.router.navigateTo('stories/' + id, {
              newStory: !this.id ? true : false
            });
          }.bind(this));
      } else {
        this.updateForm();
        mps.publish('Notification/open', ['story-new-form-error']);
        $(document).scrollTop(0);
      }
    },

    validate: function(e) {
      e && e.preventDefault();
      var attributes = this.story.toJSON();

      // Validate form, if is valid the response will be undefined
      this.errors = validate(attributes, constraints);
      return ! !!this.errors;
    },

    render: function() {
      var story = this.story.toJSON();

      this.$el.html(this.template({
        user: this.user.toJSON(),
        story: this.story.toJSON(),
        edition: this.id,
        alreadyLoggedIn: this.alreadyLoggedIn,
        formatted_date: moment(this.story.date).format('YYYY-MM-DD'),
        hideUser: story.hideUser === false ? true : false
      }));

      this.renderMap();
      this.renderFileUploader();

      var latestStoriesView = new LatestStoriesView();
      this.$('#latestStories').html(latestStoriesView.render().el);

      $('#submitAStory').addClass('current');
      document.title = 'Submit a story | Global Forest Watch';

      return this;
    },

    renderPlaceHolder: function() {
      this.$el.html(this.template({
        alreadyLoggedIn: this.alreadyLoggedIn,
        apiHost: window.gfw.config.GFW_API
      }));
      return this;
    },

    renderMedia: function() {
      var mediaList = this.story.get('media');

      _.each(mediaList.models, function(media) {
        if (media.attributes.embedUrl) {
          this._addVideoThumbnail(media);
        }
        if (media.attributes.previewUrl) {
          this._addImageThumbnail(media);
        }
      }.bind(this));
    },

    updateForm: function() {
      this.$form.find('input, textarea, select').removeClass('-error');
      this.$form.find('label').removeClass('-error');
      for (var key in this.errors) {
        var $input = this.$form.find('#'+key);
        var $label = this.$form.find('label[for='+key+']');
        $input.addClass('-error');
        $label.addClass('-error');
      }
    },

    /**
     * UI EVENTS
     */
    onChangeHideUser: function(e) {
      var is_checked = $(e.currentTarget).is(':checked');
      this.$personalInfo.toggleClass('-hidden', !is_checked);
    }


  });

  return StoriesNewView;

});
