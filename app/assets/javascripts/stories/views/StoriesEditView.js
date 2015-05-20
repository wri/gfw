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
        return window.gfw.config.GFW_API_HOST + "/gee/simple_green_coverage/" + z + "/" + X + "/" + ll.y + ".png";
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
          return window.gfw.config.GFW_API_HOST + "/gee/landsat_composites/" + z + "/" + X + "/" + ll.y + ".png?year="+year;
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        maxZoom: 17,
        name: "Landsat "+i
      });
    })(i);
  }


  var StoriesEditModel = Backbone.Model.extend({
    defaults: {
      the_geom: null
    }
  })



  var StoriesEditView = Backbone.View.extend({

    el: '#storiesEditView',

    events: {
      'click #zoomIn': '_zoomIn',
      'click #zoomOut': '_zoomOut',
      'click #autoLocate': '_autoLocate'
    },

    initialize: function() {
      if (!this.$el.length) {
        return
      }

      this.model = new StoriesEditModel();

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
          console.log(filename);
          var $thumbnail = $("<li class='thumbnail preview' data-name='"+filename+"' ><div class='filename'>"+ file.name +"</div><div class='spinner'><svg><use xlink:href='#shape-spinner'></use></svg></div></li>");
          $('.thumbnails').append($thumbnail);
          $thumbnail.fadeIn(250);
        });

        $("form input[type='submit']").addClass('disabled');
        $("form input[type='submit']").attr('disabled', 'disabled');
        $("form input[type='submit']").val('Please wait...');
        // data.submit();
      }).on('fileuploaddone', function (e, data) {
        var files = [data.result]

        $.each(files, function (index, file) {
          that.filesAdded--;
          that.uploadsIds.push(file.basename);

          var url = file.url.replace('https', 'http');
          var $thumb = $("<li class='sortable thumbnail'><div class='inner_box' style=' background-image: url("+url+");'></div><a href='#' class='destroy'><svg><use xlink:href='#shape-close'></use></svg></a></li>");

          var filename = file.basename.substring(45);
          console.log(filename);

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

      // Load map
      this.map = new google.maps.Map(document.getElementById('stories_map'),config.MAPOPTIONS);

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


      // Listen to any change on center position
      google.maps.event.addListener(this.map, 'zoom_changed',
        _.bind(function() {
          this.setCenter();
        }, this)
      );
      google.maps.event.addListener(this.map, 'dragend',
        _.bind(function() {
          this.setCenter();
      }, this));

    },

    _autoLocate: function(e){
      this.$autoLocate.addClass('active');
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          _.bind(function(position) {
            this.$autoLocate.removeClass('active');
            var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
            this.map.setCenter(pos);
            this.setCenter();
            this.setZoom(18);
          }, this ),
          _.bind(function() {
            this.$autoLocate.removeClass('active');
            mps.publish('Notification/open', ['notif-enable-location']);
          }, this )
        );
      }else{
        this.$autoLocate.removeClass('active');
      }
    },



    //ZOOM
    _zoomIn: function() {
      this.setZoom(this.getZoom() + 1);
    },
    _zoomOut: function(){
      this.setZoom(this.getZoom() - 1);
    },
    getZoom: function(){
      return this.map.getZoom();
    },
    setZoom: function(zoom){
      this.map.setZoom(zoom);
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
      return filename.toLowerCase().replace(/ /g,"_");
    },

    render: function() {
      this.$the_geom = this.$('#story_the_geom');
      this.$autoLocate = this.$('#autoLocate');

      var the_geom = this.$the_geom.val()
      this.model.set('the_geom', the_geom);

      return this;
    }
  });


  return StoriesEditView;

});


