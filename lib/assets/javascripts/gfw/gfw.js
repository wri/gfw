
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

  gfw.files = [];

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

    var next = function() { };

    next();

  };
})();
