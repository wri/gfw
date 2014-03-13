//= require gfw/ui/widget
//= require gfw/ui/sourcewindow


var map = null;

gfw.ui.view.Terms = cdb.core.View.extend({
  el: document.body,

  events: {
    'click .continue': '_onClickContinue',
    'click .cancel': '_onClickCancel'
  },

  initialize: function() {
    this.sourceWindow  = new gfw.ui.view.SourceWindow();
    this.$el.append(this.sourceWindow.render());

    map = new google.maps.Map(document.getElementById('map'), config.MAPOPTIONS);

    var styledMap = new google.maps.StyledMapType(config.MAPSTYLES.grayscale, { name: 'grayscale' });
    map.mapTypes.set('grayscale', styledMap);
    map.setMapTypeId('grayscale');
  },

  _onClickContinue: function(e) {
    e.preventDefault();

    ga('send', 'event', 'Terms', 'Click', 'I agree');

    var source = $(e.target).closest('.continue').attr('data-source');

    this.sourceWindow.show(source).addScroll();
    this.sourceWindow.$el.find('.close').hide();

    this.sourceWindow.$el.find('.accept_btn').on('click', function() {
      ga('send', 'event', 'Terms', 'Click', 'I agree (Dialog)');
    });

    this.sourceWindow.$el.find('.cancel_btn').on('click', function() {
      ga('send', 'event', 'Terms', 'Click', 'I do not agree (Dialog)');
    });
  },

  _onClickCancel: function() {
    ga('send', 'event', 'Terms', 'Click', 'I do not agree');
  }
});
