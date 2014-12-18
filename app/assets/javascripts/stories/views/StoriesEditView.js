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
    MAXZOOM: 17,
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
    panControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: true,
    scaleControlOptions: {
        position: google.maps.ControlPosition.TOP_LEFT,
    },
    streetViewControl: false,
    overviewMapControl: false,
    scrollwheel: false,
    layers: [596],
    analysis: ''
  };

  config.OVERLAYSTYLES = {
    strokeWeight: 2,
    fillOpacity: 0.45,
    fillColor: "#FFF",
    strokeColor: "#A2BC28",
    editable: true,
    icon: new google.maps.MarkerImage(
      '/assets/icons/marker_exclamation.png',
      new google.maps.Size(36, 36), // size
      new google.maps.Point(0, 0), // offset
      new google.maps.Point(18, 18) // anchor
    )
  };

  config.MAPSTYLES = {};

  config.MAPSTYLES.grayscale = {
    type: 'style',
    style: [ { "featureType": "water" }, { "featureType": "transit", "stylers": [ { "saturation": -100 } ] }, { "featureType": "road", "stylers": [ { "saturation": -100 } ] }, { "featureType": "poi", "stylers": [ { "saturation": -100 } ] }, { "featureType": "landscape", "stylers": [ { "saturation": -100 } ] }, { "featureType": "administrative", "stylers": [ { "saturation": -100 } ] },{ "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "visibility": 'off' } ] } ]
  }

  config.MAPSTYLES.terrain = {
    type: 'mapType',
    style: google.maps.MapTypeId.TERRAIN,
    title: "Terrain"
  }

  config.MAPSTYLES.satellite = {
    type: 'mapType',
    style: google.maps.MapTypeId.SATELLITE,
    title: "Satellite"
  }

  config.MAPSTYLES.roads = {
    type: 'mapType',
    style: google.maps.MapTypeId.HYBRID,
    title: "Roads"
  }

  config.MAPSTYLES.treeheight = {
    type: 'customMapType',
    style: new google.maps.ImageMapType({
      getTileUrl: function(ll, z) {
        var X = Math.abs(ll.x % (1 << z)); // wrap
        return "//gfw-apis.appspot.com/gee/simple_green_coverage/" + z + "/" + X + "/" + ll.y + ".png";
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: true,
      maxZoom: 17,
      name: "Forest Height",
      alt: "Global forest height"
    })
  }

  config.MAPSTYLES.landsat = [];

  for(var i = 1999; i < 2013; i++) {
    (function(year) {
      config.MAPSTYLES.landsat[i] = new google.maps.ImageMapType({
        getTileUrl: function(ll, z) {
          var X = Math.abs(ll.x % (1 << z));  // wrap
          return "//gfw-apis.appspot.com/gee/landsat_composites/" + z + "/" + X + "/" + ll.y + ".png?year="+year;
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        maxZoom: 17,
        name: "Landsat "+i
      });
    })(i);
  }






  var StoriesEditView = Backbone.View.extend({

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
          var filename = that.prettifyFilename(file.name);
          var $thumbnail = $("<li class='thumbnail preview' data-name='"+that.prettifyFilename(filename)+"' />");

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

          var filename = that.prettifyFilename(file.basename);

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
        var center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
    prettifyFilename: function (filename) {
      return filename.toLowerCase().replace(/ /g,"_");
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


  return StoriesEditView;

});


