function prettifyFilename(filename) {
  return filename.toLowerCase().replace(/ /g,"_")
}

function getFilename(url) {
  return url.replace(/^.*[\\\/]/, '')
}

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
  evaluate: /\[(.+?)\]/g
};

function isEmpty(str) {
  if (str) {
    return !str.match(/\S/)
  } else { return true; }
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

jQuery.fn.center = function () {
  this.css("position", "absolute");
  this.css("top",  Math.max(0, (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop()) + "px");
  this.css("left", Math.max(0, (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft()) + "px");
  return this;
}


/**
 * Hides/shows placeholders
 *
 * @param {Hash} [opt] Optional arguments (speed, timeOut)
*/

jQuery.fn.smartPlaceholder = function(opt){

  this.each(function(){
    var
    speed   = (opt && opt.speed)   || 150,
    timeOut = (opt && opt.timeOut) || 100,
    $span   = $(this).find("span.holder"),
    $input  = $(this).find(":input").not("input[type='hidden'], input[type='submit']");

    if ($input.val()) {
      $span.hide();
    }

    $input.keydown(function(e) {

      if (e.metaKey && e.keyCode == 88) { // command+x
        setTimeout(function() {
          isEmpty($input.val()) && $span.fadeIn(speed);
        }, timeOut);
      } else if (e.metaKey && e.keyCode == 86) { // command+v
        setTimeout(function() {
          !isEmpty($input.val()) && $span.fadeOut(speed);
        }, timeOut);
      } else {
        setTimeout(function() { ($input.val()) ?  $span.fadeOut(speed) : $span.fadeIn(speed); }, 0);
      }
    });

    $span.click(function() { $input.focus(); });
    $input.blur(function() { !$input.val() && $span.fadeIn(speed); });
  });
}


String.prototype.truncate = function(n) {
  return this.substr(0, n - 1 ) + ( this.length > n ? '...' : '' );
};

var config = {
  ZOOM:               3,
  MINZOOM:            3,
  MAXZOOM:            17,
  LAT:                15,
  LNG:                27,
  MONTHNAMES:         ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  MONTHNAMES_SHORT:   ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
  QUARTERNAMES:       ["JAN - MAR", "APR - JUN", "JUL - SEP", "OCT - DEC"],
  YEARS:              [2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014],
  DATE_FORMAT:        "yyyy-MM-dd",
  DATE_SUFFIXES:      ["th", "st", "nd", "rd"],
  MIN_PROJECT_RADIUS: 100,
  BASE_MAP_STYLE:     [ { "featureType": "water"  },{ "featureType": "transit", "stylers": [ { "saturation": -100 } ] },{ "featureType": "road", "stylers": [ { "saturation": -100 } ] },{ "featureType": "poi", "stylers": [ { "saturation": -100 } ] },{ "featureType": "landscape", "stylers": [ { "saturation": -100 } ] },{ "featureType": "administrative", "stylers": [ { "saturation": -100 } ] } ],
  pendingLayers: [],
  ANALYSIS_OVERLAYS_STYLE: {
    strokeWeight: 2,
    fillOpacity: 0.25,
    fillOpacity: 0.45,
    fillColor: "#FFF",
    strokeColor: "#A2BC28",
    editable: true
  },
  OVERLAYS_STYLE: {
    strokeWeight: 2,
    fillOpacity: 0.25,
    fillOpacity: 0.45,
    fillColor: "#75ADB5",
    strokeColor: "#75ADB5",
    icon: new google.maps.MarkerImage(
      '/assets/icons/marker_exclamation.png',
      new google.maps.Size(45, 45), // desired size
      new google.maps.Point(0, 0), // offset within the scaled sprite
      new google.maps.Point(20, 20) // anchor point is half of the desired size
    )
  }
};

config.mapLoaded = false;
config.iso       = "ALL";

config.mapOptions = {
  zoom:               config.ZOOM,
  minZoom:            config.MINZOOM,
  maxZoom:            config.MAXZOOM,
  center:             new google.maps.LatLng(config.LAT, config.LNG),
  mapTypeId:          google.maps.MapTypeId.TERRAIN,
  backgroundColor:    '#99b3cc',
  disableDefaultUI:   true,
  panControl:         false,
  zoomControl:        false,
  mapTypeControl:     false,
  scaleControl:       false,
  streetViewControl:  false,
  overviewMapControl: false,
  scrollwheel:        false,
  layers:             ""
};

config.mapStyles = {};

config.mapStyles.forestSoft = new google.maps.ImageMapType({
  getTileUrl: function(ll, z) {
    var X = ll.x % (1 << z);  // wrap
    return "http://api.tiles.mapbox.com/v3/cartodb.global-forest-height/" + z + "/" + X + "/" + ll.y + ".png";
  },
  tileSize: new google.maps.Size(256, 256),
  isPng: true,
  maxZoom: 7,
  name: "Forest Height",
  alt: "Global forest height"
});

config.mapStyles.TREEHEIGHT = new google.maps.ImageMapType({
  getTileUrl: function(ll, z) {
    var X = ll.x % (1 << z);  // wrap
    return "http://gfw-ee-tiles.appspot.com/gfw/simple_green_coverage/" + z + "/" + X + "/" + ll.y + ".png";
  },
  tileSize: new google.maps.Size(256, 256),
  isPng: true,
  maxZoom: 8,
  name: "Forest Height",
  alt: "Global forest height",
  alt: 'NASA JPL, California Institute of Technology, <a href="http://lidarradar.jpl.nasa.gov" target="_blank">3D Global Vegetation Map</a>'
});

config.mapStyles.LANDSAT = [];
window.landsat_year = [];

for(var i = 1999;i < 2013; i++) {
  window.landsat_year[i] = i;

  (function(year) {
    config.mapStyles.LANDSAT[i] = new google.maps.ImageMapType({
      getTileUrl: function(ll, z) {
        var X = ll.x % (1 << z);  // wrap
        return "http://gfw-ee-tiles.appspot.com/gfw/landsat_composites/" + z + "/" + X + "/" + ll.y + ".png?year="+year;
      },
      tileSize: new google.maps.Size(256, 256),
      isPng: true,
      maxZoom: 13,
      name: "Landsat "+i
    });
  })(i);
}

var Road = function(){
  this.Road = function(){
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    map.setOptions({styles: null});
  };
};

var Satellite = function(){
  this.Satellite = function(){
    map.setMapTypeId(google.maps.MapTypeId.SATELLITE);
    map.setOptions({styles: null});
  };
};

var Forest = function(){
  this.Forest = function(){
    map.setMapTypeId('forests');
    map.setOptions({styles: null});
  };
};

var ForestSoft = function(){
  this.ForestSoft = function(){
    map.setMapTypeId('forests_soft');
    map.setOptions({styles: null});
  };
};

var Soft = function(){
  this.Soft = function(){
    map.setMapTypeId(google.maps.MapTypeId.ROADMAP);
    map.setOptions({styles: map_style.google_maps_customization_style});
  };
};


function parseHash(hash) {

  var args = hash.split("/");

  if (args.length >= 3) {

    var zoom = parseInt(args[2], 10),
    lat = parseFloat(args[3]),
    lon = parseFloat(args[4]),
    filters = args[5];

    if (filters) {
      filters.substr(0, filters.indexOf("?"));
    }

    if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
      return false;
    } else {
      return {
        center: new google.maps.LatLng(lat, lon),
        zoom: zoom,
        filters: filters
      };
    }
  } else {
    return false;
  }
}

function monthDiff(d1, d2) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months;
}
