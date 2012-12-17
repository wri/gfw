
// entry point
(function() {

  var gfw = window.gfw = {};

  window.gfw.config          = {};
  window.gfw.core            = {};
  window.gfw.ui              = {};
  window.gfw.ui.model        = {};
  window.gfw.ui.view         = {};
  window.gfw.ui.collection   = {};
  window.gfw.ui.common       = {};

  /**
  * global variables
  */
  window.JST = window.JST || {};

  gfw.files = [

    //"vendor/jquery.mousewheel.min.js",
    //"vendor/jquery.imagesloaded.min.js",
    //"vendor/jquery.jscrollpane.js",
    //"vendor/spin.min.js",
    //"vendor/mustache.js",

    //// Core
    //'core/config.js',
    //'core/log.js',
    //'core/profiler.js',
    //'core/template.js',
    //'core/view.js',
    //'core/god.js',

    //// UI
    //'ui/widget.js',
    //'ui/timeline.js',
    //'ui/legend.js',
    //'ui/layer_selector.js',
    //'ui/language_selector.js',
    //'ui/gallery.js',
    //'ui/carrousel.js'

  ];


  gfw.init = function(ready) {
    // define a simple class
    var Class = gfw.Class = function() {};
    _.extend(Class.prototype, Backbone.Events);

    gfw._loadJST();
    window.gfw.god = new Backbone.Model();

    ready && ready();
  };

  /**
  * load all the javascript files. For testing, do not use in production
  */
  gfw.load = function(prefix, ready) {
    var c = 0;

    var next = function() {
      //var script = document.createElement('script');
      //script.src = prefix + gfw.files[c];
      //document.body.appendChild(script);
      //++c;

      //if (c == gfw.files.length) {
        //if(ready) {
          //script.onload = ready;
        //}
      //} else {
        //script.onload = next;
      //}

    };

    next();

  };
})();
