define([
  'Class', 'jquery', 'backbone', 'mps', 'handlebars', 'jquery_fileupload', 'backbone.syphon', 'moment', 'underscore',
  'stories/models/StoryModel', 'stories/models/MediaModel',
  'stories/views/LatestStoriesView',
  'text!stories/templates/new_story.handlebars'
], function(
  Class, $, Backbone, mps, Handlebars, jquery_fileupload, BackboneSyphon, moment, _,
  Story, Media,
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

  var StoryFormValidator = Class.extend({
    validations: {
      title: {
        message: 'Please enter a title for your story',
        validator: function(story) {
          return !_.isEmpty(story.get('title'));
        }
      },

      location: {
        message: 'Please enter a title for your story',
        validator: function(story) {
          return story.hasLocation();
        }
      }
    },

    isValid: function(story) {
      this.messages = {};

      _.each(this.validations, function(attribute, attributeName) {
        if (attribute.validator(story) === false) {
          this.messages[attributeName] = attribute.message;
        }
      }.bind(this));

      return _.isEmpty(this.messages);
    }
  });

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
      'click .upload_picture': 'showFileSelector'
    },

    initialize: function() {
      this.sourceDrag = undefined;

      this.story = new Story();
      this.validator = new StoryFormValidator();

      this.render();
    },

    videoInput: function(e) {
      if ($(e.target).val().length == 0) {
        var removable = document.getElementById('videothumbnail');
        if (removable) {
          removable.parentNode.removeChild(removable);  
        }
      } else {
        this._addVideoThumbnail($(e.target).val());
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

    _addVideoThumbnail: function(url) {
      var media = new Media({embedUrl: url});
      this.story.addMedia(media);

      var vidID  = this._getVideoID(url),
          $thumb = $('#videothumbnail');
      if ($thumb.length > 0) {
        if (!!vidID) {
          $thumb.find('.inner_box').css('background-image','url('+ vidID +')');
          $thumb.data('uploadId', 'VID-'+vidID);          
        } else {
          this.uploadsIds = _.without(this.uploadsIds, 'VID-'+this.oldvID);
          $("#story_uploads_ids").val(this.uploadsIds.join(","));
          $thumb.fadeOut(250, function() {
            $thumb.remove();
          });
        }
      } else {
        if (!!vidID) {
          $('.thumbnails').append('<li class="sortable thumbnail" draggable="true" id="videothumbnail"><div class="inner_box" style=" background-image: url('+ vidID +');"></div><a href="#" class="destroy"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shape-close"></use></svg></a></li>');
          this.uploadsIds.push('VID-'+vidID);
          $("#story_uploads_ids").val(this.uploadsIds.join(","));
          $thumb = $('#videothumbnail');
          $thumb.data('uploadId', 'VID-'+vidID);
          $thumb.find('.destroy').on('click', function(e) {
              e.preventDefault();

              var confirmation = confirm('Are you sure?')

              if (confirmation == true) {
                this.uploadsIds = _.without(this.uploadsIds, 'VID-'+this.oldvID);
                $("#story_uploads_ids").val(this.uploadsIds.join(","));
                $("#story_video").val('');
                $thumb.fadeOut(250, function() {
                  $thumb.remove();
                });
              }
            }.bind(this));          
        }
      }
      this.oldvID = vidID;
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
      }).on('fileuploadadd', function (e, data) {
        data.context = $('<div/>').appendTo('#files');

        remainingFiles += _.size(data.files);
        _.each(data.files, function(file) {
          if (file && file.size > 4000000) {
            mps.publish('Notification/open', ['notif-limit-exceed']);
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
      }).on('fileuploaddone', function (e, data) {
        var files = [data.result];

        $.each(files, function (index, file) {
          remainingFiles -= 1;

          var media = new Media({previewUrl: file.basename});
          that.story.addMedia(media);

          var url = file.url.replace('https', 'http');
          var $thumb = $("<li class='sortable thumbnail' draggable='true' data-id='"+file.basename+"'><div class='inner_box' style=' background-image: url("+url+");'></div><a href='#' class='destroy'><svg><use xlink:href='#shape-close'></use></svg></a></li>");

          var filename = that.prettifyFilename(file.basename).substring(45);

          $(".thumbnail[data-name='"+filename+"']").fadeOut(250, function() {
            $(this).remove();

            $(".thumbnails").append($thumb);
            $thumb.fadeIn(250);
          });

          $thumb.find('.destroy').on('click', function(e) {
            e.preventDefault();

            var confirmation = confirm('Are you sure?')

            if (confirmation == true) {
              $thumb.fadeOut(250, function() {
                $thumb.remove();
              });
            }
          });
        });

        if (remainingFiles <= 0) {
          var $submitButton = $("form input[type='submit']");
          $submitButton.val('Submit story');
          $submitButton.removeClass('disabled');
          $submitButton.attr('disabled', false);
        }

        ga('send', 'event', 'Stories', 'New story', 'submit');
      }).on('fileuploadfail', function (e, data){
        mps.publish('Notification/open', ['upload-error-server']);
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
            mps.publish('Notification/open', ['notif-enable-location']);
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

      var currentOrder = this.$('.sortable').index(this.sourceDrag);

      if (this.isbefore(this.sourceDrag, target)) {
        target.parentNode.insertBefore(this.sourceDrag, target);
      } else {
        target.parentNode.insertBefore(this.sourceDrag, target.nextSibling);
      }

      var newOrder = this.$('.sortable').index(this.sourceDrag);
      this.story.get('media').move(currentOrder, newOrder);
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

      var attributesFromForm = Backbone.Syphon.serialize(
        this.$('form#new_story'));
      this.story.set(attributesFromForm);

      if (this.validator.isValid(this.story)) {
        this.story.save().then(function(result) {
          var id = result.data.id;
          window.location = '/stories/'+id;
        });
      } else {
        this.render(this.validator.messages);
        mps.publish('Notification/open', ['story-new-form-error']);
        $(document).scrollTop(0);
      }
    },

    render: function(errors) {
      errors = errors || {};

      this.$el.html(this.template({
        errors: errors,
        story: this.story.toJSON(),
        formatted_date: moment(this.story.date).format('YYYY-MM-DD')
      }));

      this.renderMap();
      this.renderFileUploader();

      var latestStoriesView = new LatestStoriesView();
      this.$('#latestStories').html(latestStoriesView.render().el);

      $('#submitAStory').addClass('current');
      document.title = 'Submit a story | Global Forest Watch';

      return this;
    }
  });

  return StoriesNewView;

});
