/**
* logging
*/

(function() {

  // Error management
  gfw.core.Error = Backbone.Model.extend({
    url: gfw.config.REPORT_ERROR_URL,
    initialize: function() {
      this.set({browser: JSON.stringify($.browser) });
    }
  });

  gfw.core.ErrorList = Backbone.Collection.extend({
    model: gfw.core.Error
  });

  /** contains all of the app errors */
  gfw.errors = new gfw.core.ErrorList();

  // error tracking!
  if(gfw.config.ERROR_TRACK_ENABLED) {
    window.onerror = function(msg, url, line) {
      gfw.errors.create({
        msg: msg,
        url: url,
        line: line
      });
    };
  }


  // logging
  var _fake_console = function() {};
  _fake_console.prototype.error = function(){};
  _fake_console.prototype.log= function(){};

  //IE7 love
  if(typeof console !== "undefined") {
    _console = console;
  } else {
    _console = new _fake_console();
  }

  gfw.core.Log = Backbone.Model.extend({

    error: function() {
      //_console.error.apply(_console, arguments);
      gfw.errors.create({
        msg: Array.prototype.slice.call(arguments).join('')
      });
    },

    log: function() {
      _console.log.apply(_console, arguments);
    },

    info: function() {
      _console.log.apply(_console, arguments);
    },

    debug: function() {
      _console.log.apply(_console, arguments);
    }
  });

})();

gfw.log = new gfw.core.Log({tag: 'gfw'});
