/**
 * The StoriesEdit view.
 */
define([
  'jquery',
  'backbone',
  'mps'
], function($,Backbone,mps) {

  'use strict';


  var config = {
    ZOOM: 3,
    MINZOOM: 3,
    MAXZOOM: 20,
    LAT: 15,
    LNG: 27,
    ISO: 'ALL',
    BASEMAP: 'grayscale',
    BASELAYER: 'loss',
    MONTHNAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    MONTHNAMES_SHORT: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
    QUARTERNAMES: ["JAN - MAR", "APR - JUN", "JUL - SEP", "OCT - DEC"],
    mapLoaded: false
  };

  config.MAPOPTIONS = {
    zoom: config.ZOOM,
    minZoom: config.MINZOOM,
    maxZoom: config.MAXZOOM,
    center: new google.maps.LatLng(config.LAT, config.LNG),
    mapTypeId: google.maps.MapTypeId.HYBRID,
    backgroundColor: '#99b3cc',
    disableDefaultUI: true,
  };

  var StoriesNewView = Backbone.View.extend({

    el: '#storiesNewView',

    events: {
      'click #controlZoomIn': '_zoomIn',
      'click #controlZoomOut': '_zoomOut',
      'click #autoLocate': '_autoLocate',
      'input #story_video' : '_videoInput',
      'dragenter .sortable' : '_dragenter',
      'dragstart .sortable' : '_dragstart'
    },

    model: new (Backbone.Model.extend({
      defaults: {
        the_geom: null
      }
    })),

    initialize: function() {
      if (!this.$el.length) {
        return
      }

      this.uploadsIds = [];
      this.filesAdded = 0;
      this.sourceDrag = undefined;

      this._initViews();
      this._initBindings();

      this.render();
    },

    /**
     * UI EVENTS
     */

    _dragenter: function(e) {
      var target = e.target;
      if (! !!target.classList.contains('sortable')) {
        //check we're dropping the element in a proper draggable element
        target = target.closest('.sortable');
      }
      if (this.isbefore(this.sourceDrag, target)) {
        target.parentNode.insertBefore(this.sourceDrag, target);
      } else {
        target.parentNode.insertBefore(this.sourceDrag, target.nextSibling);
      }
      var sortables = document.getElementsByClassName('sortable');
      for (var i = 0; i < sortables.length; i++) {
        this.uploadsIds[i] = $(sortables[i]).data('uploadId');
      }
      $("#story_uploads_ids").val(this.uploadsIds.join(","));
    },

    _dragstart: function(e) {
      this.sourceDrag = e.target;
      (e.originalEvent || e).dataTransfer.effectAllowed = 'move';
    },


    _videoInput: function(e) {
      if ($(e.target).val().length == 0) {
        var removable = document.getElementById('videothumbnail');
        removable.parentNode.removeChild(removable);
      } else {
        this._addVideoThumbnail($(e.target).val());
      }
    },

    _getVideoID: function(url) {
      // template: http://img.youtube.com/vi/<video-id-here>/default.jpg
      // a Youtube video ID has a 11 characters legngth
      return 'http://img.youtube.com/vi/' + url.split('v=')[1].substring(0, 11) + '/default.jpg';
    },

    _addVideoThumbnail: function(url) {
      var vidID  = this._getVideoID(url),
          $thumb = $('#videothumbnail');
      if ($thumb.length > 0) {
        $thumb.find('.inner_box').css('background-image','url('+ vidID +')')
        $thumb.data('uploadId', 'VID-'+vidID);
      } else {
        $('.thumbnails').append('<li class="sortable thumbnail" draggable="true" id="videothumbnail"><div class="inner_box" style=" background-image: url('+ vidID +');"></div><a href="#" class="destroy"><svg><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shape-close"></use></svg></a></li>');
        this.uploadsIds.push('VID-'+vidID);
        $("#story_uploads_ids").val(this.uploadsIds.join(","));
        $thumb = $('#videothumbnail');
        $thumb.data('uploadId', 'VID-'+vidID);
        $thumb.find('.destroy').on('click', function(e) {
            e.preventDefault();

            var confirmation = confirm('Are you sure?')

            if (confirmation == true) {
              this.uploadsIds = _.without(this.uploadsIds, 'VID-'+vidID);
              $("#story_uploads_ids").val(this.uploadsIds.join(","));
              $("#story_video").val('');
              $thumb.fadeOut(250, function() {
                $thumb.remove();
              });
            }
          });
      }
    },

    _initBindings: function() {
      var that = this;

      $('.upload_picture').on('click', function(e) {
        e.preventDefault();

        $('#fileupload').click();
      });

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

        that.filesAdded += _.size(data.files);
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

        // data.submit();
      }).on('fileuploaddone', function (e, data) {
        var files = [data.result];

        $.each(files, function (index, file) {
          that.filesAdded--;
          that.uploadsIds.push(file.basename);

          var url = file.url.replace('https', 'http');
          var $thumb = $("<li class='sortable thumbnail' draggable='true'><div class='inner_box' style=' background-image: url("+url+");'></div><a href='#' class='destroy'><svg><use xlink:href='#shape-close'></use></svg></a></li>");
          $thumb.data('uploadId', file.basename);

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
              that.uploadsIds = _.without(that.uploadsIds, file.basename);
              $("#story_uploads_ids").val(that.uploadsIds.join(","));

              $thumb.fadeOut(250, function() {
                $thumb.remove();
              });
            }
          });
        });

        if (that.filesAdded <= 0) {
          var $submitButton = $("form input[type='submit']");
          $submitButton.val('Submit story');
          $submitButton.removeClass('disabled');
          $submitButton.attr('disabled', false);
        }

        $('#story_uploads_ids').val(that.uploadsIds.join(','));
        ga('send', 'event', 'Stories', 'New story', 'submit');
      }).on('fileuploadfail', function (e, data){
        mps.publish('Notification/open', ['notification-upload-error-server']);
        var $submitButton = $("form input[type='submit']");
        $submitButton.val('Submit story');
        $submitButton.removeClass('disabled');
        $submitButton.attr('disabled', false);
      });
    },

    _initViews: function() {
      var that = this;
      var $searchInput = $('.map-search-input');

      // Load map
      this.map = new google.maps.Map(document.getElementById('map'),config.MAPOPTIONS);

      // Listen to map loaded
      google.maps.event.addListenerOnce(this.map, 'idle', _.bind(function(){
        this._autoLocate();
      }, this ));

      // Set autocomplete search input
      this.autocomplete = new google.maps.places.Autocomplete($searchInput[0], {types: ['geocode']});

      // Listen to selected areas (search)
      google.maps.event.addListener(this.autocomplete, 'place_changed', _.bind(function() {
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
      }, this ));

      google.maps.event.addDomListener($searchInput[0], 'keydown', function(e) {
        if (e.keyCode == 13) {
          e.preventDefault();
        }
      });


      // Google Maps
      google.maps.event.addListener(this.map, 'zoom_changed', this.setCenter.bind(this));
      google.maps.event.addListener(this.map, 'dragend', this.setCenter.bind(this));
    },

    _autoLocate: function(e){
      this.$autoLocate.addClass('active');
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          _.bind(function(position) {
            this.$autoLocate.removeClass('active');
            var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            this.map.panTo(pos);
            this.map.setZoom(18);
            this.setCenter();
          }, this ),
          _.bind(function() {
            this.$autoLocate.removeClass('active');
            mps.publish('Notification/open', ['notification-enable-location']);
          }, this )
        );
      }else{
        this.$autoLocate.removeClass('active');
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

    //ZOOM
    _zoomIn: function() {
      this.map.setZoom(this.getZoom() + 1);
    },

    _zoomOut: function(){
      this.map.setZoom(this.getZoom() - 1);
    },

    getZoom: function(){
      return this.map.getZoom();
    },

    setCenter: function() {
      var center = this.map.getCenter();
      var the_geom = JSON.stringify({
        'type': 'Point',
        'coordinates': [ center.lng(), center.lat() ]
      });
      this.model.set('the_geom',the_geom);
      this.$the_geom.val(this.model.get('the_geom'));
    },

    prettifyFilename: function (filename) {
      var file = filename.substring(0,filename.length - 4);
      return file.toLowerCase().replace(/ /g,"_");
    },

    render: function() {
      this.$the_geom = this.$('#story_the_geom');
      this.$autoLocate = this.$('#autoLocate');

      var the_geom = this.$the_geom.val()
      this.model.set('the_geom', the_geom);

      return this;
    }
  });


  return StoriesNewView;

});


