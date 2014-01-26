
var Result = Backbone.Model.extend({
});

var SearchResults = Backbone.Collection.extend({
  model: Result,

  initialize: function() {
    this.geocoder = new google.maps.Geocoder();
  },

  fetch: function() {
    var self = this;

    this.geocoder.geocode( { 'address': this.to_search }, function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        self.reset(results);
      }
    });
  }
});

gfw.ui.model.SearchBox = Backbone.Model.extend({
  defaults: {
    hidden: true
  }
});

gfw.ui.view.SearchBox = gfw.ui.view.Widget.extend({
  id: 'searchbox',
  className: 'searchbox',

  events: {
    'click button': 'typing'
  },

  initialize: function() {
    _.bindAll(this, "toggle", "toggleDraggable", "onStopDragging", 'typing', 'goto', 'keyPress');

    this.options = _.extend(this.options, this.defaults);

    this.model = new gfw.ui.model.SearchBox;

    this.model.bind("change:hidden",    this.toggle);
    this.model.bind("change:draggable", this.toggleDraggable);

    this.model.set("containment", "#map-container .map");

    var self = this;

    this.results = new SearchResults();

    this.results.bind('reset', function() {
      var r = this.first().get('geometry').location;
      var bounds = this.first().get('geometry').bounds;
      console.log(r, bounds);
      self.trigger('goto', r, bounds);
    });

    $(document).bind('keydown', this.keyPress);

    var template = $("#searchbox-template").html();

    this.template = new cdb.core.Template({
      template: template,
      type: 'mustache'
    });
  },

  typing: function(e) {
    if(e) e.preventDefault();

    this.results.to_search = this.$el.find("input").val();
    this.results.fetch();
  },

  goto: function(e) {
    e.preventDefault();
  },

  keyPress: function(e) {
    if (e.keyCode == 13 || e.which == 13) {
      this.typing();
    }
  },

  render: function() {
    // this.$el.append(this.template.render( this.model.toJSON() ));

    return this.$el;
  }
});