/**
 * @name cartodb-gmapsv3 for Google Maps V3 API
 * @version 0.45 [June 7, 2012]
 * @author: jmedina@vizzuality.com
 * @fileoverview <b>Author:</b> jmedina@vizzuality.com<br/> <b>Licence:</b>
 *               Licensed under <a
 *               href="http://opensource.org/licenses/mit-license.php">MIT</a>
 *               license.<br/> This library lets you use CartoDB with google
 *               maps v3.
 *
 */

// Namespace
var CartoDB = CartoDB || {};

if (typeof(google.maps.CartoDBLayer) === "undefined") {

  /**
   * Initialize CartoDB Layer
   * @params {Object}
   *    map               -     Your google map
   *    user_name         -     CartoDB user name
   *    table_name        -     CartoDB table name
   *    query             -     If you want to apply any sql sentence to the table...
   *    opacity           -     If you want to change the opacity of the CartoDB layer
   *    layer_order       -     If you want to change the position order of the CartoDB layer
   *    tile_style        -     If you want to add other style to the layer
   *    map_style         -     Show the same style as you defined in the CartoDB map
   *    interactivity     -     Get data from the feature clicked ( without any request :) )
   *    featureMouseOver  -     Callback when user hovers a feature (return mouse event, latlng and data)
   *    featureMouseOut   -     Callback when user hovers out a feature
   *    featureMouseClick -     Callback when user clicks a feature (return mouse event, latlng and data)
   *    debug             -     Get error messages from the library
   *    auto_bound        -     Let cartodb auto-bound-zoom in the map (opcional - default = false)
   *
   *    tiler_domain      -     Use your own tiler domain
   *    tiler_port        -     Use your current tiler port
   *    tiler_protocol    -     http or https?
   *    sql_domain        -     Use your own sql domain
   *    sql_port          -     Use your current sql port
   *    sql_protocol      -     http or https?
   */


  function CartoDBLayer(options) {
    this.extend(CartoDBLayer, google.maps.OverlayView);
    this.options = options;

    // Domains params
    this.options.tiler_domain = options.tiler_domain || "cartodb.com";
    this.options.tiler_port = options.tiler_port || "";
    this.options.tiler_protocol = options.tiler_protocol || "http";
    this.options.sql_domain = options.sql_domain || "cartodb.com";
    this.options.sql_port = options.sql_port || "";
    this.options.sql_protocol = options.sql_protocol || "http";

    // Custom params
    this.options.query = options.query || "SELECT * FROM {{table_name}}";
    this.options.visible = true;
    this.options.opacity = (!isNaN(options.opacity)) ? options.opacity : 1; // Hack to save 0 (false) from check of Javascript :S
    this.options.layer_order = options.layer_order || "top";

    // Some checks
    if (!this.options.table_name || !this.options.map) {
      if (this.options.debug) {
        throw('cartodb-gmapsv3 needs at least a CartoDB table name and the gmapsv3 map object :(');
      } else { return }
    }

    this.initialize();
    this.setMap(options.map);
  }

  CartoDBLayer.prototype.extend = function(obj1, obj2) {
    return (function(object) {
      for (var property in object.prototype) {
        this.prototype[property] = object.prototype[property];
      }
      return this;
    }).apply(obj1, [obj2]);
  };


  CartoDBLayer.prototype.initialize = function () {
    // Bounds? CartoDB does it
    if (this.options.auto_bound)
      this._setBounds();

    // Map style?
    if (this.options.map_style)
      this._setMapStyle();

    // Add cartodb logo, yes sir!
    // this._addWadus();
  }

  // Useless
  CartoDBLayer.prototype.draw = function() {};


  /**
   * When Google adds the layer... go!
   * @params {map}
   */
  CartoDBLayer.prototype.onAdd = function(map) {
    this._addInteraction();
  }


  /**
   * When removes the layer, destroy interactivity if exist
   */
  CartoDBLayer.prototype.onRemove = function(map) {
    this._remove();
  }


  /**
   * Change opacity of the layer
   * @params {Integer} New opacity
   */
  CartoDBLayer.prototype.setOpacity = function(opacity) {

    if (isNaN(opacity) || opacity>1 || opacity<0) {
      if (this.options.debug) {
        throw(opacity + ' is not a valid value');
      } else { return }
    }

    // Set the new value to the layer options
    this.options.opacity = opacity;
    this._update();
  }


  /**
   * Change query of the tiles
   * @params {str} New sql for the tiles
   */
  CartoDBLayer.prototype.setQuery = function(sql) {

    if (!isNaN(sql)) {
      if (this.options.debug) {
        throw(sql + ' is not a valid query');
      } else { return }
    }

    // Set the new value to the layer options
    this.options.query = sql;
    this._update();
  }


  /**
   * Change style of the tiles
   * @params {style} New carto for the tiles
   */
  CartoDBLayer.prototype.setStyle = function(style) {
    if (!isNaN(style)) {
      if (this.options.debug) {
        throw(style + ' is not a valid style');
      } else { return }
    }

    // Set the new value to the layer options
    this.options.tile_style = style;
    this._update();
  }


  /**
   * Change the query when clicks in a feature
   * @params { Boolean || String } New sql for the request
   */
  CartoDBLayer.prototype.setInteractivity = function(value) {
    if (!isNaN(value)) {
      if (this.options.debug) {
        throw(value + ' is not a valid setInteractivity value');
      } else { return }
    }

    // Set the new value to the layer options
    this.options.interactivity = value;
    // Update tiles
    this._update();
  }


  /**
   * Change layer index
   * @params { Integer || String } New position for the layer
   */
  CartoDBLayer.prototype.setLayerOrder = function(position) {

    if (isNaN(position) && position != "top" && position != "bottom") {
      if (this.options.debug) {
        throw(position + ' is not a valid layer position')
      } else { return }
    }

    // Remove gmaps position defined
    if (this.layer.gmaps_index)
      delete this.layer.gmaps_index;
    // Set new value
    this.options.layer_order = position;
    // Layer order time!
    this._setLayerOrder()
  }


  /**
   * Active or desactive interaction
   * @params {Boolean} Choose if wants interaction or not
   */
  CartoDBLayer.prototype.setInteraction = function(bool) {
    if (bool !== false && bool !== true) {
      if (this.options.debug) {
        throw(bool + ' is not a valid setInteraction value');
      } else { return }
    }

    if (this.interaction) {
      if (bool) {
        var self= this;
        this.interaction.on('on',function(o) {self._bindWaxEvents(self.options.map,o)})
      } else {
        this.interaction.off('on');
      }
    }
  }


  /**
   * Hide the CartoDB layer
   */
  CartoDBLayer.prototype.hide = function() {
    this.options.visible = false;
    // Save previous opacity
    this.options.before = this.options.opacity;
    // Hide it!
    this.setOpacity(0);
    this.setInteraction(false);
  }


  /**
   * Show the CartoDB layer
   */
  CartoDBLayer.prototype.show = function() {
    this.options.visible = true;
    this.setOpacity(this.options.before);
    // Remove before
    delete this.options.before;
    this.setInteraction(true);
  }


  /**
   * Return the visibility of the layer
   */
  CartoDBLayer.prototype.isVisible = function() {
    return this.options.visible
  }



  /*
   * PRIVATE METHODS
   */

  /**
   * Remove CartoDB layer
   */
  CartoDBLayer.prototype._remove =  function() {
    // Disable and remove interaction
    this.setInteraction(false);

    // // Remove layer
    var self = this;
    //debugger;
    //this.options.map.overlayMapTypes.clear();
    this.options.map.overlayMapTypes.forEach(
      function(layer,i) {
      if (layer == self.layer) {
        self.options.map.overlayMapTypes.removeAt(i);
        return;
      }
    });
  }


  /**
   * Update CartoDB layer
   */
  CartoDBLayer.prototype._update = function() {
    // First remove old layer
    this._remove();

    // Create the new updated one
    this._addInteraction();
  }


  /**
   * Zoom to cartodb geometries
   */
  CartoDBLayer.prototype._setBounds = function() {
    var self = this;

    reqwest({
url: this._generateUrl("sql") + '/api/v2/sql/?q='+escape('SELECT ST_XMin(ST_Extent(the_geom)) as minx,ST_YMin(ST_Extent(the_geom)) as miny,'+
       'ST_XMax(ST_Extent(the_geom)) as maxx,ST_YMax(ST_Extent(the_geom)) as maxy from ('+ this.options.query.replace(/\{\{table_name\}\}/g, this.options.table_name) + ') as subq'),
type: 'jsonp',
jsonpCallback: 'callback',
success: function(result) {
if (result.rows[0].maxx!=null) {
var coordinates = result.rows[0];
var lon0 = coordinates.maxx;
var lat0 = coordinates.maxy;
var lon1 = coordinates.minx;
var lat1 = coordinates.miny;

var minlat = -85.0511;
var maxlat =  85.0511;
var minlon = -179;
var maxlon =  179;

/* Clamp X to be between min and max (inclusive) */
var clampNum = function(x, min, max) {
return x < min ? min : x > max ? max : x;
}

lon0 = clampNum(lon0, minlon, maxlon);
lon1 = clampNum(lon1, minlon, maxlon);
lat0 = clampNum(lat0, minlat, maxlat);
lat1 = clampNum(lat1, minlat, maxlat);

var sw = new google.maps.LatLng(lat0, lon0);
var ne = new google.maps.LatLng(lat1, lon1);
var bounds = new google.maps.LatLngBounds(sw,ne);
self.options.map.fitBounds(bounds);
}
},
error: function(e,msg) {
         if (this.options.debug) throw('Error getting table bounds: ' + msg);
       }
});
}


/**
 * Add Wadus
 */
CartoDBLayer.prototype._addWadus =  function() {
  var self = this;
  setTimeout(function(){
      if (!document.getElementById('cartodb_logo')) {
      var cartodb_link = document.createElement("a");
      cartodb_link.setAttribute('id','cartodb_logo');
      cartodb_link.setAttribute('style',"position:absolute; bottom:3px; left:74px; display:block; border:none; z-index:100");
      cartodb_link.setAttribute('href','http://www.cartodb.com');
      cartodb_link.setAttribute('target','_blank');
      cartodb_link.innerHTML = "<img src='http://cartodb.s3.amazonaws.com/static/new_logo.png' alt='CartoDB' title='CartoDB' style='border:none;' />";
      self.options.map.getDiv().appendChild(cartodb_link)
      }
      },2000);
}


/**
 * Set the map styles of your CartoDB table/map
 */
CartoDBLayer.prototype._setMapStyle = function () {
  var self = this;
  reqwest({
url: this._generateUrl("tiler") + '/tiles/' + this.options.table_name + '/map_metadata?callback=?',
type: 'jsonp',
jsonpCallback: 'callback',
success: function(result) {
var map_style = json_parse(result.map_metadata);

if (!map_style || map_style.google_maps_base_type=="roadmap") {
self.map.setOptions({mapTypeId: google.maps.MapTypeId.ROADMAP});
} else if (map_style.google_maps_base_type=="satellite") {
self.map.setOptions({mapTypeId: google.maps.MapTypeId.SATELLITE});
} else if (map_style.google_maps_base_type=="terrain") {
self.map.setOptions({mapTypeId: google.maps.MapTypeId.TERRAIN});
} else {
var mapStyles = [ { stylers: [ { saturation: -65 }, { gamma: 1.52 } ] },{ featureType: "administrative", stylers: [ { saturation: -95 }, { gamma: 2.26 } ] },{ featureType: "water", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "administrative.locality", stylers: [ { visibility: "off" } ] },{ featureType: "road", stylers: [ { visibility: "simplified" }, { saturation: -99 }, { gamma: 2.22 } ] },{ featureType: "poi", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "road.arterial", stylers: [ { visibility: "off" } ] },{ featureType: "road.local", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "transit", stylers: [ { visibility: "off" } ] },{ featureType: "road", elementType: "labels", stylers: [ { visibility: "off" } ] },{ featureType: "poi", stylers: [ { saturation: -55 } ] } ];
map_style.google_maps_customization_style = mapStyles;
self.map.setOptions({mapTypeId: google.maps.MapTypeId.ROADMAP});
}

// Custom tiles
if (!map_style) {
  map_style = {google_maps_customization_style: []};
}

self.map.setOptions({styles: map_style.google_maps_customization_style});
},
error: function(e, msg) {
         if (params.debug) throw('Error getting map style: ' + msg);
       }
});
}


/**
 * Add interaction cartodb tiles to the map
 */
CartoDBLayer.prototype._addInteraction = function () {

  var self = this;

  // interaction placeholder
  this.tilejson = this._generateTileJson();

  // Layer created
  this.layer = new wax.g.connector(this.tilejson);

  // Setting its order
  this._setLayerOrder()


    if (this.options.interactivity) {
      this.interaction = wax.g.interaction().map(this.options.map).tilejson(this.tilejson);

      this.interaction
        .on('on',function(o) {self._bindWaxEvents(self.options.map,o)})
        .on('off', function(o){
            if (self.options.featureMouseOut) {
            return self.options.featureMouseOut && self.options.featureMouseOut();
            } else {
            if (self.options.debug) throw('featureMouseOut function not defined');
            }
            });
    }
}


/**
 * Bind events for wax interaction
 * @param {Object} Layer map object
 * @param {Event} Wax event
 */
CartoDBLayer.prototype._bindWaxEvents = function(map,o) {
  switch (o.e.type) {
    case 'mousemove': if (this.options.featureMouseOver) {
                        return this.options.featureMouseOver(o.e,latlng,o.data);
                      } else {
                        if (this.options.debug) throw('featureMouseOver function not defined');
                      }
                      break;
    case 'mouseup':   var offset = this._offset(map.getDiv());

                      // Get page y and x (IE?)
                      if (o.e.pageX || o.e.pageY) {
                        posx = o.e.pageX;
                        posy = o.e.pageY;
                      } else if (o.e.clientX || o.e.clientY) {
                        posx = o.e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                        posy = o.e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
                      }

                      var x = posx - offset.left
                        , y = posy - offset.top
                        , latlng = this.getProjection().fromContainerPixelToLatLng(new google.maps.Point(x,y))

                        if (this.options.featureMouseClick) {
                          this.options.featureMouseClick(o.e,latlng,o.data);
                        } else {
                          if (this.options.debug) throw('featureMouseClick function not defined');
                        }
                      break;
    default:          break;
  }
}


    /**
     * Generate tilejson for wax
     * @return {Object} Options for ImageMapType
     */
    CartoDBLayer.prototype._generateTileJson = function () {
      var core_url = this._generateUrl("tiler")
      , base_url = core_url + '/tiles/' + this.options.table_name + '/{z}/{x}/{y}'
      , tile_url = base_url + '.png'
      , grid_url = base_url + '.grid.json'

      // SQL?
      if (this.options.query) {
        var q = this.options.query.replace(/\{\{table_name\}\}/g,this.options.table_name);

        var query = 'sql=' + encodeURIComponent(q);
        tile_url = this._addUrlData(tile_url, query);
        grid_url = this._addUrlData(grid_url, query);
      }

      // STYLE?
      if (this.options.tile_style) {
        var style = 'style=' + encodeURIComponent(this.options.tile_style.replace(/\{\{table_name\}\}/g,this.options.table_name));
        tile_url = this._addUrlData(tile_url, style);
        grid_url = this._addUrlData(grid_url, style);
      }

      // INTERACTIVITY?
      if (this.options.interactivity) {
        var interactivity = 'interactivity=' + encodeURIComponent(this.options.interactivity.replace(/ /g,''));
        tile_url = this._addUrlData(tile_url, interactivity);
        grid_url = this._addUrlData(grid_url, interactivity);
      }

      // Build up the tileJSON
      return {
        blankImage: '../img/blank_tile.png',
        tilejson: '1.0.0',
        scheme: 'xyz',
        name: this.options.table_name,
        tiles: [tile_url],
        grids: [grid_url],
        tiles_base: tile_url,
        grids_base: grid_url,
        opacity: this.options.opacity,
        formatter: function(options, data) {
          return data
        }
      };
    }


    /**
     * Set the layer order
     */
    CartoDBLayer.prototype._setLayerOrder = function() {

      // Remove this layer from the order array if it is present
      var self = this;
      this.options.map.overlayMapTypes.forEach(function(l,i){
        if (l == self.layer) {
          self.options.map.overlayMapTypes.removeAt(i);
        }
      })

      // Was it previously attached?
      if (this.layer.gmaps_index) {
        this.options.map.overlayMapTypes.insertAt(this.layer.gmaps_index,this.layer)
        return;
      }

      // String positions
      if (this.options.layer_order == "top") {
        this.options.map.overlayMapTypes.push(this.layer);
        return;
      }
      if (this.options.layer_order == "bottom") {
        this.options.map.overlayMapTypes.insertAt(0,this.layer);
        return;
      }

      // Number positions
      var actual_length = this.options.map.overlayMapTypes.getLength()
      if (this.options.layer_order >= actual_length) {
        // Add it at the end
        this.options.map.overlayMapTypes.push(this.layer);
      } else if (this.options.layer_order <= 0) {
        // 0 dude!
        this.options.map.overlayMapTypes.insertAt(0,this.layer);
      } else {
        // Add in the correct index
        this.options.map.overlayMapTypes.insertAt(this.options.layer_order,this.layer);
      }

      // New layer, new indexes, let's check them!
      this.options.map.overlayMapTypes.forEach(function(l,i){
        l.gmaps_index = i
      })
    }


    /*
     * HELPER FUNCTIONS
     */

    /**
     * Generate a URL about sql api or tile api
     * @params {String} Type of url
     */
    CartoDBLayer.prototype._generateUrl = function(type) {
      if (type == "sql") {
        return this.options.sql_protocol +
          "://" + ((this.options.user_name)?this.options.user_name+".":"")  +
        this.options.sql_domain +
          ((this.options.sql_port != "") ? (":" + this.options.sql_port) : "");
      } else {
        return this.options.tiler_protocol +
          "://" + ((this.options.user_name)?this.options.user_name+".":"")  +
        this.options.tiler_domain +
          ((this.options.tiler_port != "") ? (":" + this.options.tiler_port) : "");
      }
    }

    /**
     * Parse URI
     * @params {String} Tile url
     * @return {String} URI parsed
     */
    CartoDBLayer.prototype._parseUri = function (str) {
      var o = {
        strictMode: false,
        key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
        q:   {
          name:   "queryKey",
          parser: /(?:^|&)([^&=]*)=?([^&]*)/g
        },
        parser: {
          strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
          loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
      },
      m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
      uri = {},
      i   = 14;

      while (i--) uri[o.key[i]] = m[i] || "";

      uri[o.q.name] = {};
      uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) uri[o.q.name][$1] = $2;
      });
      return uri;
    }


    /**
     * Appends callback onto urls regardless of existing query params
     * @params {String} Tile url
     * @params {String} Tile data
     * @return {String} Tile url parsed
     */
    CartoDBLayer.prototype._addUrlData = function (url, data) {
      url += (this._parseUri(url).query) ? '&' : '?';
      return url += data;
    }


    /**
     * Calculate the correct offset to get the latlng clicked
     * @params {obj} Map dom element
     */
    CartoDBLayer.prototype._offset = function (obj) {
      var ol = ot = 0;
      if (obj.offsetParent) {
        do {
          ol += obj.offsetLeft;
          ot += obj.offsetTop;
        }while (obj = obj.offsetParent);
      }
      return {left : ol, top : ot};
    }
                      }


/* json2.js - https://github.com/douglascrockford/JSON-js*/
var json_parse=(function(){var at,ch,escapee={'"':'"',"\\":"\\","/":"/",b:"\b",f:"\f",n:"\n",r:"\r",t:"\t"},text,error=function(m){throw {name:"SyntaxError",message:m,at:at,text:text}},next=function(c){if(c&&c!==ch){error("Expected '"+c+"' instead of '"+ch+"'")}ch=text.charAt(at);at+=1;return ch},number=function(){var number,string="";if(ch==="-"){string="-";next("-")}while(ch>="0"&&ch<="9"){string+=ch;next()}if(ch==="."){string+=".";while(next()&&ch>="0"&&ch<="9"){string+=ch}}if(ch==="e"||ch==="E"){string+=ch;next();if(ch==="-"||ch==="+"){string+=ch;next()}while(ch>="0"&&ch<="9"){string+=ch;next()}}number=+string;if(!isFinite(number)){error("Bad number")}else{return number}},string=function(){var hex,i,string="",uffff;if(ch==='"'){while(next()){if(ch==='"'){next();return string}else{if(ch==="\\"){next();if(ch==="u"){uffff=0;for(i=0;i<4;i+=1){hex=parseInt(next(),16);if(!isFinite(hex)){break}uffff=uffff*16+hex}string+=String.fromCharCode(uffff)}else{if(typeof escapee[ch]==="string"){string+=escapee[ch]}else{break}}}else{string+=ch}}}}error("Bad string")},white=function(){while(ch&&ch<=" "){next()}},word=function(){switch(ch){case"t":next("t");next("r");next("u");next("e");return true;case"f":next("f");next("a");next("l");next("s");next("e");return false;case"n":next("n");next("u");next("l");next("l");return null}error("Unexpected '"+ch+"'")},value,array=function(){var array=[];if(ch==="["){next("[");white();if(ch==="]"){next("]");return array}while(ch){array.push(value());white();if(ch==="]"){next("]");return array}next(",");white()}}error("Bad array")},object=function(){var key,object={};if(ch==="{"){next("{");white();if(ch==="}"){next("}");return object}while(ch){key=string();white();next(":");if(Object.hasOwnProperty.call(object,key)){error('Duplicate key "'+key+'"')}object[key]=value();white();if(ch==="}"){next("}");return object}next(",");white()}}error("Bad object")};value=function(){white();switch(ch){case"{":return object();case"[":return array();case'"':return string();case"-":return number();default:return ch>="0"&&ch<="9"?number():word()}};return function(source,reviver){var result;text=source;at=0;ch=" ";result=value();white();if(ch){error("Syntax error")}return typeof reviver==="function"?(function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}({"":result},"")):result}}());

/*!
 * Reqwest! A general purpose XHR connection manager
 * (c) Dustin Diaz 2011
 * https://github.com/ded/reqwest
 * license MIT
 */
!function(a,b){typeof module!="undefined"?module.exports=b():typeof define=="function"&&define.amd?define(a,b):this[a]=b()}("reqwest",function(){function handleReadyState(a,b,c){return function(){a&&a[readyState]==4&&(twoHundo.test(a.status)?b(a):c(a))}}function setHeaders(a,b){var c=b.headers||{},d;c.Accept=c.Accept||defaultHeaders.accept[b.type]||defaultHeaders.accept["*"],!b.crossOrigin&&!c[requestedWith]&&(c[requestedWith]=defaultHeaders.requestedWith),c[contentType]||(c[contentType]=b.contentType||defaultHeaders.contentType);for(d in c)c.hasOwnProperty(d)&&a.setRequestHeader(d,c[d])}function generalCallback(a){lastValue=a}function urlappend(a,b){return a+(/\?/.test(a)?"&":"?")+b}function handleJsonp(a,b,c,d){var e=uniqid++,f=a.jsonpCallback||"callback",g=a.jsonpCallbackName||"reqwest_"+e,h=new RegExp("((^|\\?|&)"+f+")=([^&]+)"),i=d.match(h),j=doc.createElement("script"),k=0;i?i[3]==="?"?d=d.replace(h,"$1="+g):g=i[3]:d=urlappend(d,f+"="+g),win[g]=generalCallback,j.type="text/javascript",j.src=d,j.async=!0,typeof j.onreadystatechange!="undefined"&&(j.event="onclick",j.htmlFor=j.id="_reqwest_"+e),j.onload=j.onreadystatechange=function(){if(j[readyState]&&j[readyState]!=="complete"&&j[readyState]!=="loaded"||k)return!1;j.onload=j.onreadystatechange=null,j.onclick&&j.onclick(),a.success&&a.success(lastValue),lastValue=undefined,head.removeChild(j),k=1},head.appendChild(j)}function getRequest(a,b,c){var d=(a.method||"GET").toUpperCase(),e=typeof a=="string"?a:a.url,f=a.processData!==!1&&a.data&&typeof a.data!="string"?reqwest.toQueryString(a.data):a.data||null,g;return(a.type=="jsonp"||d=="GET")&&f&&(e=urlappend(e,f),f=null),a.type=="jsonp"?handleJsonp(a,b,c,e):(g=xhr(),g.open(d,e,!0),setHeaders(g,a),g.onreadystatechange=handleReadyState(g,b,c),a.before&&a.before(g),g.send(f),g)}function Reqwest(a,b){this.o=a,this.fn=b,init.apply(this,arguments)}function setType(a){var b=a.match(/\.(json|jsonp|html|xml)(\?|$)/);return b?b[1]:"js"}function init(o,fn){function complete(a){o.timeout&&clearTimeout(self.timeout),self.timeout=null,o.complete&&o.complete(a)}function success(resp){var r=resp.responseText;if(r)switch(type){case"json":try{resp=win.JSON?win.JSON.parse(r):eval("("+r+")")}catch(err){return error(resp,"Could not parse JSON in response",err)}break;case"js":resp=eval(r);break;case"html":resp=r}fn(resp),o.success&&o.success(resp),complete(resp)}function error(a,b,c){o.error&&o.error(a,b,c),complete(a)}this.url=typeof o=="string"?o:o.url,this.timeout=null;var type=o.type||setType(this.url),self=this;fn=fn||function(){},o.timeout&&(this.timeout=setTimeout(function(){self.abort()},o.timeout)),this.request=getRequest(o,success,error)}function reqwest(a,b){return new Reqwest(a,b)}function normalize(a){return a?a.replace(/\r?\n/g,"\r\n"):""}function serial(a,b){var c=a.name,d=a.tagName.toLowerCase(),e=function(a){a&&!a.disabled&&b(c,normalize(a.attributes.value&&a.attributes.value.specified?a.value:a.text))};if(a.disabled||!c)return;switch(d){case"input":if(!/reset|button|image|file/i.test(a.type)){var f=/checkbox/i.test(a.type),g=/radio/i.test(a.type),h=a.value;(!f&&!g||a.checked)&&b(c,normalize(f&&h===""?"on":h))}break;case"textarea":b(c,normalize(a.value));break;case"select":if(a.type.toLowerCase()==="select-one")e(a.selectedIndex>=0?a.options[a.selectedIndex]:null);else for(var i=0;a.length&&i<a.length;i++)a.options[i].selected&&e(a.options[i])}}function eachFormElement(){var a=this,b,c,d,e=function(b,c){for(var e=0;e<c.length;e++){var f=b[byTag](c[e]);for(d=0;d<f.length;d++)serial(f[d],a)}};for(c=0;c<arguments.length;c++)b=arguments[c],/input|select|textarea/i.test(b.tagName)&&serial(b,a),e(b,["input","select","textarea"])}function serializeQueryString(){return reqwest.toQueryString(reqwest.serializeArray.apply(null,arguments))}function serializeHash(){var a={};return eachFormElement.apply(function(b,c){b in a?(a[b]&&!isArray(a[b])&&(a[b]=[a[b]]),a[b].push(c)):a[b]=c},arguments),a}var context=this,win=window,doc=document,old=context.reqwest,twoHundo=/^20\d$/,byTag="getElementsByTagName",readyState="readyState",contentType="Content-Type",requestedWith="X-Requested-With",head=doc[byTag]("head")[0],uniqid=0,lastValue,xmlHttpRequest="XMLHttpRequest",isArray=typeof Array.isArray=="function"?Array.isArray:function(a){return a instanceof Array},defaultHeaders={contentType:"application/x-www-form-urlencoded",accept:{"*":"text/javascript, text/html, application/xml, text/xml, */*",xml:"application/xml, text/xml",html:"text/html",text:"text/plain",json:"application/json, text/javascript",js:"application/javascript, text/javascript"},requestedWith:xmlHttpRequest},xhr=win[xmlHttpRequest]?function(){return new XMLHttpRequest}:function(){return new ActiveXObject("Microsoft.XMLHTTP")};return Reqwest.prototype={abort:function(){this.request.abort()},retry:function(){init.call(this,this.o,this.fn)}},reqwest.serializeArray=function(){var a=[];return eachFormElement.apply(function(b,c){a.push({name:b,value:c})},arguments),a},reqwest.serialize=function(){if(arguments.length===0)return"";var a,b,c=Array.prototype.slice.call(arguments,0);return a=c.pop(),a&&a.nodeType&&c.push(a)&&(a=null),a&&(a=a.type),a=="map"?b=serializeHash:a=="array"?b=reqwest.serializeArray:b=serializeQueryString,b.apply(null,c)},reqwest.toQueryString=function(a){var b="",c,d=encodeURIComponent,e=function(a,c){b+=d(a)+"="+d(c)+"&"};if(isArray(a))for(c=0;a&&c<a.length;c++)e(a[c].name,a[c].value);else for(var f in a){if(!Object.hasOwnProperty.call(a,f))continue;var g=a[f];if(isArray(g))for(c=0;c<g.length;c++)e(f,g[c]);else e(f,a[f])}return b.replace(/&$/,"").replace(/%20/g,"+")},reqwest.compat=function(a,b){return a&&(a.type&&(a.method=a.type)&&delete a.type,a.dataType&&(a.type=a.dataType),a.jsonpCallback&&(a.jsonpCallbackName=a.jsonpCallback)&&delete a.jsonpCallback,a.jsonp&&(a.jsonpCallback=a.jsonp)),new Reqwest(a,b)},reqwest})
