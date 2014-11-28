//= require jquery/dist/jquery
//= require jquery-migrate-1.2.1.min
//= require jquery-ui-1.10.4.custom.min
//= require load-image.min
//= require jquery.iframe-transport
//= require jquery.fileupload
//= require jquery.fileupload-process
//= require jquery.fileupload-image
//= require jquery_ujs
//= require geojson

//= require gfw
//= require gfw/helpers
//= require gfw/ui/carrousel

gfw.ui.view.StoriesEdit = cdb.core.View.extend({

  el: document.body,

  events: {
    'click .remove_story-link': '_clickRemove'
  },

  initialize: function() {
    _.bindAll(this, '_clickRemove');

    this.model = new cdb.core.Model();

    this.model.bind('change:the_geom', this._toggleButton, this);

    this.selectedMarker = {};

    this.uploadsIds = [];
    this.filesAdded = 0;

    this._initViews();
    this._initBindings();

    this.render();
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
        maxFileSize: 5000000, // 5 MB
        // Enable image resizing, except for Android and Opera,
        // which actually support image resizing, but fail to
        // send Blob objects via XHR requests:
        disableImageResize: /Android(?!.*Chrome)|Opera/
          .test(window.navigator.userAgent),
        previewMaxWidth: 132,
        previewMaxHeight: 76,
        previewCrop: true
    }).on('fileuploadadd', function (e, data) {
      data.context = $('<div/>').appendTo('#files');

      that.filesAdded += _.size(data.files);

      _.each(data.files, function(file) {
        var filename = prettifyFilename(file.name);
        var $thumbnail = $("<li class='thumbnail preview' data-name='"+prettifyFilename(filename)+"' />");

        $('.thumbnails').append($thumbnail);
        $thumbnail.fadeIn(250);

        var opts = {
          lines: 11, // The number of lines to draw
          length: 0, // The length of each line
          width: 4, // The line thickness
          radius: 9, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          color: '#9EB741', // #rgb or #rrggbb
          speed: 1, // Rounds per second
          trail: 60, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: 'auto', // Top position relative to parent in px
          left: 'auto' // Left position relative to parent in px
        };

        var spinner = new Spinner(opts).spin();
        $thumbnail.append($(spinner.el));
        $thumbnail.append("<div class='filename'>"+ file.name +"</div>");
      });

      $("form input[type='submit']").addClass('disabled');
      $("form input[type='submit']").attr('disabled', 'disabled');
      $("form input[type='submit']").val('Please wait...');

      // data.submit();
    }).on('fileuploadprocessalways', function (e, data) {
      var index = data.index,
          file = data.files[index],
          node = $(data.context.children()[index]);

      var $thumb = $("<li class='thumbnail'><div class='inner_box'><img src='"+file.preview.toDataURL()+"' /></div><a href='#' class='destroy'></a></li>");
    }).on('fileuploaddone', function (e, data) {
      var files = [data.result]

      $.each(files, function (index, file) {
        that.filesAdded--;

        that.uploadsIds.push(file.basename);

        var url = file.url.replace('https', 'http');
        var $thumb = $("<li class='sortable thumbnail'><div class='inner_box'><img src='"+url+"' /></div><a href='#' class='destroy'></a></li>");

        var filename = prettifyFilename(file.basename);

        $(".thumbnail[data-name='"+filename+"']").fadeOut(250, function() {
          $(this).remove();

          $(".thumbnails").append($thumb);
          $thumb.fadeIn(250);
        });

        $thumb.find('.destroy').on('click', function(e) {
          e.preventDefault();

          var confirmation = confirm('Are you sure?')

          if (confirmation == true) {
            uploadsIds = _.without(that.uploadsIds, file.basename);
            $("#story_uploads_ids").val(uploadsIds.join(","));

            $thumb.fadeOut(250, function() {
              $thumb.remove();
            });
          }
        });
      });

      if (that.filesAdded <= 0) {
        $("form input[type='submit']").val('Submit story');
        $("form input[type='submit']").removeClass('disabled');
        $("form input[type='submit']").attr('disabled', false);
      }

      $('#story_uploads_ids').val(that.uploadsIds.join(','));
      ga('send', 'event', 'Stories', 'New story', 'submit');
    });
  },

  _initViews: function() {
    var that = this;
    var $searchInput = $('.map-search-input');

    var success = function(position) {
      center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      that.map.panTo(center);
      that.map.setZoom(15);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success);
    } else {
      error('not supported');
    }

    // Load map
    this.map = new google.maps.Map(document.getElementById('stories_map'),
      _.extend({}, config.MAPOPTIONS, { zoomControl: true }));

    // Listen to map loaded
    google.maps.event.addListenerOnce(this.map, 'idle', function(){
      $searchInput.show();
    });

    // Set drawingManager
    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER
        ]
      },
      markerOptions: {
        icon: config.OVERLAYSTYLES.icon
      }
    });

    this.drawingManager.setMap(this.map);
    // Listen to drawing changes
    google.maps.event.addListener(this.drawingManager, 'markercomplete', function(marker) {
      that._onOverlayComplete(marker);
    });

    // Set autocomplete search input
    this.autocomplete = new google.maps.places.Autocomplete(
      $searchInput[0], {types: ['geocode']});

    // Listen to selected areas (search)
    google.maps.event.addListener(
      this.autocomplete, 'place_changed', function() {
        var place = this.autocomplete.getPlace();

        if (place && place.geometry) {
          this.map.fitBounds(place.geometry.viewport)
        }
      }.bind(this));

      google.maps.event.addDomListener($searchInput[0], 'keydown', function(e) {
        if (e.keyCode == 13) {
          e.preventDefault();
        }
      });
    },

  _loadMarker: function(the_geom) {
    var that = this;

    var marker = this.selectedMarker = new GeoJSON(the_geom, config.OVERLAYSTYLES);

    if (marker.type && marker.type === 'Error') return;

    var bounds = new google.maps.LatLngBounds();

    marker.setMap(this.map);
    bounds.extend(marker.position);
    this.map.fitBounds(bounds);

    setTimeout(function() {
      that.map.setZoom(2);
    }, 250);
  },

  _onOverlayComplete: function(marker) {
    if (this.selectedMarker.visible) this.selectedMarker.setMap(null);
    var marker = this.selectedMarker = marker;

    var the_geom = JSON.stringify({
      'type': 'Point',
      'coordinates': [ marker.position.lng(), marker.position.lat() ]
    });

    this.model.set('the_geom', the_geom);
  },

  _clickRemove: function(e) {
    e.preventDefault();
    this.selectedMarker.setMap(null);
    this.model.set('the_geom', '');
  },

  _toggleButton: function() {
    if (this.model.get('the_geom') !== '') {
      this.$the_geom.val(this.model.get('the_geom'));
      this.$remove.fadeIn(250);
    } else {
      this.$the_geom.val('');
      this.$remove.fadeOut(250);
    }
  },

  render: function() {
    this.$the_geom = this.$('#story_the_geom');
    this.$remove = this.$('.remove_story-link');

    var the_geom = this.$the_geom.val()
    this.model.set('the_geom', the_geom);

    if(the_geom) {
      this._loadMarker(JSON.parse(the_geom));
    }

    return this;
  }
});

$(document).ready(function() {

  if ($('.is-show-action').length > 0) {
    window.carrousel = new gfw.ui.view.Carrousel();
  }
  if ($('.is-new-action').length > 0 || $('.is-edit-action').length > 0) {
    window.stories_edit = new gfw.ui.view.StoriesEdit();
  }
});
