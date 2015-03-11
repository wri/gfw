define([], function() {

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
    mapLoaded: false,
    canopy_choice: false,
    compression: 0.3,
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
    fillOpacity: 0.25,
    fillOpacity: 0.45,
    fillColor: "#FFF",
    strokeColor: "#A2BC28",
    editable: true,
    icon: new google.maps.MarkerImage(
      '<%= image_path "icons/marker_exclamation.png" %>',
      new google.maps.Size(36, 36), // size
      new google.maps.Point(0, 0), // offset
      new google.maps.Point(18, 18) // anchor
    )
  };

  config.MAPSTYLES = {
    grayscale : {
      type: 'style',
      style: [ { "featureType": "water" }, { "featureType": "transit", "stylers": [ { "saturation": -100 } ] }, { "featureType": "road", "stylers": [ { "saturation": -100 } ] }, { "featureType": "poi", "stylers": [ { "saturation": -100 } ] }, { "featureType": "landscape", "stylers": [ { "saturation": -100 },{ "lightness": 90 } ] }, { "featureType": "administrative", "stylers": [ { "saturation": -100 } ] },{ "featureType": "poi", "elementType": "geometry", "stylers": [ { "visibility": 'off' } ] } ]
    },

    terrain : {
      type: 'mapType',
      style: google.maps.MapTypeId.TERRAIN,
      title: "Terrain"
    },

    satellite : {
      type: 'mapType',
      style: google.maps.MapTypeId.SATELLITE,
      title: "Satellite"
    },

    roads : {
      type: 'mapType',
      style: google.maps.MapTypeId.HYBRID,
      title: "Roads"
    },
    treeheight : {
      type: 'customMapType',
      style: new google.maps.ImageMapType({
        getTileUrl: function(ll, z) {
          var X = Math.abs(ll.x % (1 << z)); // wrap
          return "//<%= ENV['GFW_API_HOST'] %>/gee/simple_green_coverage/" + z + "/" + X + "/" + ll.y + ".png";
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        maxZoom: 17,
        name: "Forest Height",
        alt: "Global forest height"
      })
    },
    landsat : []
  };

  for(var i = 1999; i < 2013; i++) {
    (function(year) {
      config.MAPSTYLES.landsat[i] = new google.maps.ImageMapType({
        getTileUrl: function(ll, z) {
          var X = Math.abs(ll.x % (1 << z));  // wrap
          return "//<%= ENV['GFW_API_HOST'] %>/gee/landsat_composites/" + z + "/" + X + "/" + ll.y + ".png?year="+year;
        },
        tileSize: new google.maps.Size(256, 256),
        isPng: true,
        maxZoom: 17,
        name: "Landsat "+i
      });
    })(i);
  }

  config.GRAPHS = {
    total_loss: {
      title: "Countries with greatest tree cover loss <sup>(2001-2013)</sup>",
      subtitle: "Global tree cover loss, 2001-2013<a href='#' class='info' data-source='total_loss'><i class='dark'></i></a>"
    },
    percent_loss: {
      title: "Countries with greatest tree cover gain <sup>(2001-2012)</sup>",
      subtitle: "Global tree cover gain, 2001-2012<a href='#' class='info' data-source='total_loss'><i class='dark'></i></a>"
    },
    total_extent: {
      title: "Countries with greatest tree cover extent <sup>(2000)</sup>",
      subtitle: "Global tree cover extent, 2000 <a href='#' class='info' data-source='total_loss'><i class='dark'></i></a>"
    },
    ratio: {
      title: "Countries with highest ratio of tree cover loss<br />to gain <sup>(2001-2012)</sup>",
      subtitle: "Tree cover loss relative to tree cover gain by country <sup>(2001-2012)</sup><a href='#' class='info' data-source='total_loss'><i class='dark'></i></a>"
    },
    domains: {
      title: "Climate domains ranked in order of<br />greatest tree cover loss",
      subtitle: "Tree cover loss per year by climate domain<a href='#' class='info' data-source='total_loss'><i class='dark'></i></a>"
    }
  };

  config.GRAPHCOLORS = {
    tropical: "#9BC000",
    subtropical: "#FFFF73",
    boreal: "#FFB973",
    temperate: "#73DCFF"
  };

  return config;
});
