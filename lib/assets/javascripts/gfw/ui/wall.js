gfw.ui.model.Wall = Backbone.Model.extend({

  defaults: {
    title: "Sign in",
    subtitle: "Didn't receive your password?",
    hidden: true,
    placeholder: "Enter password",
    mode: "login",
    button_title: "Sign in here",
    help: "Please enter your email address and we will send you an email with the site password",
    input_type: "password"
  }

});

gfw.ui.view.Wall = gfw.ui.view.Widget.extend({

  className: 'wall',

  events: {

    "keyup input":   "_onKeyPress",
    "click .invite": "_gotoInvite",
    "click .send":   "_send"
  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    _.bindAll( this, "toggle", "_toggleMode", "_updateTitle", "_updateHelp", "_updateButtonTitle", "_updateSubtitle", "_updatePlaceholder", "_updateInputType" );

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.Wall();

    this.add_related_model(this.model);

    this.model.bind("change:hidden",        this.toggle);
    this.model.bind("change:title",         this._updateTitle);
    this.model.bind("change:button_title",  this._updateButtonTitle);
    this.model.bind("change:subtitle",      this._updateSubtitle);
    this.model.bind("change:help",          this._updateHelp);
    this.model.bind("change:placeholder",   this._updatePlaceholder);
    this.model.bind("change:input_type",    this._updateInputType);
    this.model.bind("change:mode",          this._toggleMode);

    //this.model.bind("change:closed",    this.toggleOpen);
    //this.model.bind("change:draggable", this.toggleDraggable);

    this.$splash = $(".splash");

    var template = $("#wall-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  _checkPass: function() {

    var that = this;

    setTimeout(function() {
      if (that.$el.find("input").val() == "WsxGAZi4TuazqFl") {
        that.createCookie("pass", "ok");

        window.location.replace("/");
      } else {
        that.$el.find(".input-field").addClass("error");
        that.$el.find(".input-field").find(".icon.error").fadeIn(250);
        that.$el.find(".input-field").find(".error_input_label").html("Password not valid");
        that.$el.find(".input-field").find(".error_input_label").fadeIn(250);
      }
    }, 2000);

  },

  hide: function() {
    $(".backdrop").fadeOut(250);
    this.model.set("hidden", true);
    this.$splash.fadeOut(250);
  },

  _onKeyPress: function(e) {

    if (e.keyCode == 13) {
      this._send(e);
    }

    this._clearErrors();
  },

  _clearErrors: function() {

    this.$el.find(".input-field .icon.error").fadeOut(250);
    this.$el.find(".input-field").removeClass("error");
    this.$el.find(".input-field .error_input_label").fadeOut(250);
    this.$el.find(".input-field .error_input_label").html("");

  },

  _send: function(e) {
    var that = this;

    e.preventDefault();
    e.stopPropagation();

    var mode = this.model.get("mode");
    var error = false;

    if (mode == "request") {

      this._clearErrors();

      if (!validateEmail(this.$el.find("input").val())) {
        this.$el.find(".input-field").addClass("error");
        this.$el.find(".input-field").find(".icon.error").fadeIn(250);
        this.$el.find(".input-field").find(".error_input_label").html("Please enter a valid email");
        this.$el.find(".input-field").find(".error_input_label").fadeIn(250);

        error = true;
      }

      if (!error) {
        $.ajax({ type: "post", url: "/register", data: { email: this.$el.find("input").val() }, success: function() {
          that._setMode("thanks");
        }});
      }

    } else {
      this._checkPass();
    }

  },

  _gotoInvite: function(e) {
    e.preventDefault();
    e.stopPropagation();

    this._setMode("request");
  },

  _setMode: function(mode) {

    this._clearErrors();

    if (mode == "login") {
      this.model.set({ title: "Sign in", subtitle: "Don’t you have a password? <a href='#' class='invite'>Request an invite</a>", button_title: "Sign in", placeholder: "Enter password", input_type: "password", mode: mode })
    } else if (mode == "request") {
      this.model.set({ title: "Request an invite", help: "Please enter your email address to request access to the site.<br />We will respond within one business day.", button_title: "Send", placeholder: "Enter your email", input_type: "email", mode: mode })
      this.$el.find("input").val("");
      this.$el.find("input").focus();
    } else if (mode == "thanks") {
      this.model.set({ title: "Thank you :-)", help: "We are reviewing your request and will respond within one business day.", placeholder: "Enter password", button_title: "Sign in", input_type: "password", mode: mode })
      this.$("input").val("");
    }

  },

  _toggleMode: function() {

    var mode = this.model.get("mode");

    if (mode == "login") {
      this.$(".subtitle").fadeIn(250);
      this.$(".help").fadeOut(250);;
    } else if (mode == "request") {
      this.$(".subtitle").fadeOut(250);;
      this.$(".help").fadeIn(250);
    } else if (mode == "thanks") {
      this.$(".subtitle").fadeOut(250);;
      this.$(".help").fadeIn(250);
    }

  },

  _updatePlaceholder: function() {
    this.$el.find(".holder").html(this.model.get("placeholder"));
  },

  _updateInputType: function() {
    this.$el.find(".field").prop("type", this.model.get("input_type"));
  },

  _updateHelp: function() {
    this.$el.find(".help").html(this.model.get("help"));
  },

  _updateSubtitle: function() {
    this.$el.find(".subtitle").html(this.model.get("subtitle"));
  },

  _updateButtonTitle: function() {
    this.$el.find(".send span").html(this.model.get("button_title"));
  },

  _updateTitle: function() {
    this.$el.find(".title").html(this.model.get("title"));
  },

  createCookie: function(name, value, days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = escape(name) + "=" + escape(value) + expires + "; path=/";
  },

  readCookie:function(name) {
    var nameEQ = escape(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
    }
    return null;
  },

  eraseCookie: function(name) {
    this.createCookie(name, "", -1);
  },

  open: function() {
    $(".backdrop").fadeIn(250);
    this.model.set("hidden", false);
  },

  register: function() {
    this._setMode("request");

    this.open();
  },

  login: function() {
    this._setMode("login");

    this.open();
  },

  close: function() {
    $(".backdrop").fadeOut(250);
    this.model.set("hidden", true);
  },

  toggle: function() {
    if (this.model.get("hidden")) {

      this.$el.fadeOut(250);

    } else {

      this.$el.fadeIn(250);

    }

  },

  _initBindings: function() {
    var self = this;

    $(".backdrop").on("click", function(e) {
      self.close();
    });

    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        self.close();
      } // esc
    });
  },

  render: function() {
    var that = this;

    if (this.readCookie("pass") == 'ok') {
      $("header").animate({ height: "230px" }, 250, function() {
        $("hgroup .title").show();
        $("hgroup .title").animate({ top: 29, opacity: 1 }, 250);
      }).removeClass("stuck");

      $(".big_numbers").fadeIn(250);

      this.hide();

      return;
    }

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$el.find(".input-field").smartPlaceholder();

    this.$splash.show();

    this._initBindings();

    return this.$el;
  }

});
