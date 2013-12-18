/*
* CartoDBInfowindow
* v0.21
*/

function CartoDBInfowindow(map, opts) {

  this.latlng_ = null;
  this.offsetHorizontal_ = 0;
  this.offsetVertical_   = -10;
  this.width_ = 255;
  this.div_ = null;
  this.map_ = map;
  this.setMap(map);

  if (opts) {
    this.className         = opts.className;
    this.offsetHorizontal_ = ("offsetHorizontal" in opts) ? opts.offsetHorizontal : 0;
    this.offsetVertical_   = ("offsetVertical" in opts) ? opts.offsetVertical : 0;
    this.width_            = opts.width;
    this.template          = opts.template;
  }
}

CartoDBInfowindow.prototype = new google.maps.OverlayView();

CartoDBInfowindow.prototype.draw = function() {
  var me = this;

  var div = this.div_;
  if (!div) {
    div = this.div_ = document.createElement('DIV');

    div.className = this.className || "cartodb_infowindow";

    this.template_image = '<a href="#close" class="close"></a>'+
      '<div class="outer_top">'+
      '<div class="top">'+
      '<div class="header">' +
      '<h1></h1><div class="cover imgLiquidFill" style="width:295px; height:120px;"><img src="/assets/backgrounds/cover.png" /></div>'+
      '</div>' +
      '<div class="infowindow_content"></div>' +
      '</div>'+
      '</div>'+
      '<div class="shadow"></div>'+
      '<div class="bottom"></div>';

     this.template_base = '<a href="#close" class="close"></a>'+
      '<div class="outer_top">'+
      '<div class="top">'+
      '<div class="infowindow_content"></div>' +
      '</div>'+
      '</div>'+
      '<div class="shadow"></div>'+
      '<div class="bottom"></div>';

    div.innerHTML = this.template || this.template_base;

    var a = this.getElementsByClassName("close", div)[0];

    google.maps.event.addDomListener(a, 'click', function (ev) {
      //ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      //me._hide();
    });

    google.maps.event.addDomListener(div, 'click', function (ev) {
      //ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      //ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
    });

    google.maps.event.addDomListener(a, 'touchend', function (ev) {
      ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      //me._hide();
    });

    google.maps.event.addDomListener(div, 'touchstart', function (ev) {
      ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
    });

    google.maps.event.addDomListener(div, 'touchend', function (ev) {
      ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
    });

    google.maps.event.addDomListener(div, 'dblclick', function (ev) {
      ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
    });
    google.maps.event.addDomListener(div, 'mousedown', function (ev) {
      ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
      ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
    });
    google.maps.event.addDomListener(div, 'mouseup', function (ev) {
      ev.preventDefault ? ev.preventDefault() : ev.returnValue = false;
    });
    google.maps.event.addDomListener(div, 'mousewheel', function (ev) {
      ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
    });
    google.maps.event.addDomListener(div, 'DOMMouseScroll', function (ev) {
      ev.stopPropagation ? ev.stopPropagation() : window.event.cancelBubble = true;
    });

    var panes = this.getPanes();
    panes.floatPane.appendChild(div);

    div.style.opacity = 0;
  }

  this.setPosition();

};

CartoDBInfowindow.prototype.setVisibleColumns = function(columns){
  this.visible_columns = columns;
},

CartoDBInfowindow.prototype.setMode = function(mode){

  this.mode = mode;

  if (this.mode == "image") {
    this.template = this.template_image;
    this.div_.innerHTML = this.template;
    this.div_.className = "cartodb_infowindow with_image_2";
  } else {
    this.template = this.template_base;
    this.div_.innerHTML = this.template;
    this.div_.className = "cartodb_infowindow";
  }
};

CartoDBInfowindow.prototype.setTemplate = function(template){
  this.template_ = template;
};

CartoDBInfowindow.prototype.setOffset = function(offsetVertical, offsetHorizontal){
  this.offsetHorizontal_ = offsetHorizontal;
  this.offsetVertical_   = offsetVertical;
};

CartoDBInfowindow.prototype.setContent = function(content){

  if (this.div_) {

    var div = this.div_
    , top = this.getElementsByClassName("infowindow_content", div)[0];

    if (!content) { return; }

    if (typeof content === 'string') {
      top.innerHTML = content;
    } else {
      top.innerHTML = '';
      var html = '';

      function show_column(column, content, visible_columns) {

        if (!visible_columns) {
          return column != "slug" && content[column] != null && content[column] != '';
        } else {
          return column != "slug" && content[column] != null && content[column] != '' && _.contains(visible_columns, column);
        }

      }

      for(var column in content) {

        if (show_column(column, content, this.visible_columns)) {
          html += '<label>' + column + '</label>';
          html += '<p class="'+((content[column]!=null && content[column]!='')?'':'empty')+'">'+(content[column] || 'empty')+'</p>';
        }

      }

      top.innerHTML = html;

      var pane = $(".cartodb_infowindow .top").jScrollPane( { showArrows: true });
      var api = pane.data('jsp');
      api.scrollToY(0); // scroll to top

      if (this.mode == "image") {
        $(div).find("h1").html(content.name);
        $(div).find("img").attr("src", content.image.replace("square", "medium"));
        $(div).find("img").css("width", "295px");
      }

    }
  }

};

CartoDBInfowindow.prototype.setPosition = function(latlng) {
  if (latlng) {
    this.latlng_ = latlng;
    // Adjust pan
    //this._adjustPan();
  }

  if (this.div_) {
    var div = this.div_
    , pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
    if (pixPosition) {
      div.style.width = this.width_ + 'px';
      div.style.left = (pixPosition.x - this.width_ / 2 + this.offsetHorizontal_) + 'px';
      var actual_height = - div.clientHeight;
      div.style.top = (pixPosition.y + actual_height + this.offsetVertical_) + 'px';
    }
  }
};


CartoDBInfowindow.prototype.open = function(){
  this._show();
};


CartoDBInfowindow.prototype.close2 = function(){
  this._hide();
};
CartoDBInfowindow.prototype.close = function(){
  this._hide();
};


CartoDBInfowindow.prototype.destroy = function() {
  // Check if the overlay was on the map and needs to be removed.
  if (this.div_) {
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
  }
  this.setMap(null);
};


CartoDBInfowindow.prototype._hide = function() {

  if (this.div_) {

    var div = this.div_;

    emile(div,{
      opacity: 0,
      duration: 1,
      after: function(){
        div.style.visibility = "hidden";
      }
    });
  }
};


CartoDBInfowindow.prototype._show = function() {
  if (this.div_) {

    var div = this.div_;
    div.style.opacity = 0;
    div.style.top = (parseInt(div.style.top, 10) - 10) + 'px';

    div.style.visibility = "visible";

    if (this.mode == "image") {
      $(".imgLiquidFill").imgLiquid();
    }

    emile(div,{
      opacity: 1,
      duration: 250
    });
  }
};


CartoDBInfowindow.prototype._adjustPan = function() {
  var left = 0
  , top = 0
  , pixPosition = this.getProjection().fromLatLngToContainerPixel(this.latlng_)
  , container = this.map_.getDiv()
  , div_height = this.div_.clientHeight;

  if ((pixPosition.x - 65) < 0) {
    left = (pixPosition.x - 65);
  }

  if ((pixPosition.x + 180) >= container.clientWidth) {
    left = (pixPosition.x + 180 - container.clientWidth);
  }

  if ((pixPosition.y - div_height) < 0) {
    top = (pixPosition.y - div_height - 20);
  }

  this.map_.panBy(left,top);
};


CartoDBInfowindow.prototype.getElementsByClassName = function(classname, node)  {
  if(!node) node = document.getElementsByTagName("body")[0];
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = node.getElementsByTagName("*");
  for(var i=0,j=els.length; i<j; i++)
    if(re.test(els[i].className))a.push(els[i]);
  return a;
}



/*!
* emile.js (c) 2009 - 2011 Thomas Fuchs
* Licensed under the terms of the MIT license.
*/
!function(a){function A(a,b){a=typeof a=="string"?document.getElementById(a):a,b=z(b);var c={duration:b.duration,easing:b.easing,after:b.after};delete b.duration,delete b.easing,delete b.after;if(e&&typeof c.easing!="function")return y(a,b,c);var d=q(b,function(a,b){a=r(a);return p(a)in h&&g.test(b)?[a,b+"px"]:[a,b]});x(a,d,c)}function z(a){var b={};for(var c in a)b[c]=a[c],c=="after"&&delete a[c];return b}function y(a,b,c){var d=[],f=[],i=c.duration||1e3,j=c.easing||"ease-out",k="";i=i+"ms",a.addEventListener(l,function m(){a.setAttribute("style",k),c.after&&c.after(),a.removeEventListener(l,m,!0)},!0),setTimeout(function(){var c;for(c in b)b.hasOwnProperty(c)&&d.push(r(c)+" "+i+" "+j);for(c in b){var f=p(c)in h&&g.test(b[c])?b[c]+"px":b[c];b.hasOwnProperty(c)&&(a.style[p(c)]=f)}k=a.getAttribute("style"),d=d.join(","),a.style[e+"Transition"]=d},10)}function x(a,b,c,d){c=c||{};var e=w(b),f=a.currentStyle?a.currentStyle:getComputedStyle(a,null),g={},h=+(new Date),i,j=c.duration||200,k=h+j,l,m=c.easing||function(a){return-Math.cos(a*Math.PI)/2+.5};for(i in e)g[i]=v(f[i]);l=setInterval(function(){var b=+(new Date),f,i=b>k?1:(b-h)/j;for(f in e)a.style[f]=e[f].f(g[f].v,e[f].v,m(i))+e[f].u;b>k&&(clearInterval(l),c.after&&c.after(),d&&setTimeout(d,1))},10)}function w(a){var c,d={},e=k.length,f;b.innerHTML='<div style="'+a+'"></div>',c=b.childNodes[0].style;while(e--)(f=c[k[e]])&&(d[k[e]]=v(f));return d}function v(a){var b=parseFloat(a),c=a?a.replace(/^[\-\d\.]+/,""):a;return isNaN(b)?{v:c,f:u,u:""}:{v:b,f:s,u:c}}function u(a,b,c){var d=2,e,f,g,h=[],i=[];while((e=3)&&(f=arguments[d-1])&&d--)if(t(f,0)=="r"){f=f.match(/\d+/g);while(e--)h.push(~~f[e])}else{f.length==4&&(f="#"+t(f,1)+t(f,1)+t(f,2)+t(f,2)+t(f,3)+t(f,3));while(e--)h.push(parseInt(t(f,1+e*2,2),16))}while(e--)g=~~(h[e+3]+(h[e]-h[e+3])*c),i.push(g<0?0:g>255?255:g);return"rgb("+i.join(",")+")"}function t(a,b,c){return a.substr(b,c||1)}function s(a,b,c){return(a+(b-a)*c).toFixed(3)}function r(a){if(a.toUpperCase()===a)return a;return a.replace(/([a-zA-Z0-9])([A-Z])/g,function(a,b,c){return b+"-"+c}).toLowerCase()}function q(a,b){return o(a,function(a,c){var d=b?b(c,a):[c,a];return d[0]+":"+d[1]+";"}).join("")}function p(a){return a.replace(/-(.)/g,function(a,b){return b.toUpperCase()})}function o(a,b,c){var d=[],e;for(e in a)d.push(b.call(c,a[e],e,a));return d}var b=document.createElement("div"),c=["webkit","Moz","O"],d=3,e,f,g=/\d+$/,h={},i="backgroundColor borderBottomColor borderLeftColor borderRightColor borderTopColor color fontWeight lineHeight opacity outlineColor zIndex",j="top bottom left right borderWidth borderBottomWidth borderLeftWidth borderRightWidth borderTopWidth borderSpacing borderRadius marginBottom marginLeft marginRight marginTop width height maxHeight maxWidth minHeight minWidth paddingBottom paddingLeft paddingRight paddingTop fontSize wordSpacing textIndent letterSpacing outlineWidth outlineOffset",k=(i+" "+j).split(" ");while(d--)f=c[d],b.style.cssText="-"+f.toLowerCase()+"-transition-property:opacity;",typeof b.style[f+"TransitionProperty"]!="undefined"&&(e=f);var l=/^w/.test(e)?"webkitTransitionEnd":"transitionend";for(var m=j.split(" "),n=m.length;n--;)h[m[n]]=1;var B=a.emile;A.noConflict=function(){a.emile=B;return this},a.emile=A}(this)
