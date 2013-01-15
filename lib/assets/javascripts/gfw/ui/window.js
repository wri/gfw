gfw.ui.model.SourceWindow = Backbone.Model.extend({

  defaults: {
    hidden: true,
    layerCount: 0
  }

});

gfw.ui.view.SourceWindow = gfw.ui.view.Widget.extend({

  id: 'window',
  className: 'source_window',

  events: {

    'click .close': 'toggleHidden'

  },

  defaults: {
    speed: 250,
    minHeight: 15
  },

  initialize: function() {

    var that = this;

    _.bindAll( this );

    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        that.hide();
      } // esc
    });

    this.options = _.extend(this.options, this.defaults);

    this.model = this.options.model || new gfw.ui.model.SourceWindow();
    this.add_related_model(this.model);

    this.model.bind("change:hidden",    this.toggle);
    this.model.bind("change:closed",    this.toggleOpen);
    this.model.bind("change:draggable", this.toggleDraggable);

    this.model.set("containment", "#map-container .map");

    var template = $("#window-template").html();

    this.template = new gfw.core.Template({
      template: template,
      type: 'mustache'
    });

  },

  addScroll: function() {
    this.$content.jScrollPane( { showArrows: true });
    this.api = this.$content.data('jsp');
  },

  hide: function(callback) {
    this.model.set("hidden", true);

    $(".backdrop").fadeOut(250, function(){
      this.remove();
    });

    callback && callback();

    return this;
  },

  show: function(id) {

    var that = this;
    this.model.set("hidden", false);

    $("body").append("<div class='backdrop' />");

    $(".backdrop").css({opacity: 0 });
    $(".backdrop").show();
    $(".backdrop").animate({opacity: .50}, 250);

    $(".backdrop").click(function() {
      that.hide();
    });

    if (!this.model.get("addContent")) {
      this.$content.html($("#sources").html());
      //this.addScroll();
      this.model.set("addContent", true);
    }

    var $id = this.$content.find("#" + id);
    this.$content.find("article, ul, ul li").hide();

    this.$content.find("#" + id).show();

    this.$content.find("#" + id).parents("ul").show();
    this.$content.find("#" + id).parents("article").show();

    return this;
  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    this.$content = this.$el.find(".content");
    this.$close   = this.$el.find(".close");

    return this.$el;

  }

});
