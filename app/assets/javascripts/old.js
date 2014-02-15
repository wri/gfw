//= require gfw/ui/widget
//= require gfw/ui/sourcewindow


var map;

gfw.ui.view.Terms = cdb.core.View.extend({
  el: document.body,

  events: {
    'click .continue': '_onClickContinue'
  },

  initialize: function() {
    this.sourceWindow  = new gfw.ui.view.SourceWindow();
    this.$el.append(this.sourceWindow.render());

    map = new google.maps.Map(document.getElementById('map'), config.MAPOPTIONS);

    var styledMap = new google.maps.StyledMapType(config.BASE_MAP_STYLE, { name: 'terrain_style' });
    map.mapTypes.set('terrain_style', styledMap);
    map.setMapTypeId('terrain_style');
  },

  _onClickContinue: function(e) {
    e.preventDefault();

    var source = $(e.target).closest('.continue').attr('data-source');

    this.sourceWindow.show(source).addScroll();
  }
});
