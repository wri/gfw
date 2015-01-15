gfw.ui.view.CountriesIndex = cdb.core.View.extend({
  el: document.body,

  events : {
    'keyup #searchCountry' : '_searchCountries'
  },

  initialize: function() {
    this._getCountries();
    this._drawCountries();
    this._searchCountries();
    this._checkDialogs();
  },

  _getCountries : function(){
    this.$searchBox = $('#searchCountry')
    this.$countries = $('.country');
    this.countries_list = _.map($('.country-name'),function(el){
      return $(el).text();
    });
  },

  _searchCountries : function(e){
    var searchText = this.$searchBox.val(),
        val = $.trim(searchText).replace(/ +/g, ' ').toLowerCase(),
        count = [];

    this.$countries.show().filter(function() {
        var text = $(this).find('.country-name').text().replace(/\s+/g, ' ').toLowerCase();
        (text.indexOf(val) != -1) ? count.push($(this)) : null;
        return !~text.indexOf(val);
    }).hide();

    (count.length == 1) ? this.$searchBox.addClass('is-active') : this.$searchBox.removeClass('is-active');

    if (e) {
      if (e.keyCode == 13 && count.length == 1) {
        var href = $(count[0]).find('.country-href').attr('href');
        window.location = href;
      };
    };
  },

  _checkDialogs: function() {
    this.sourceWindow = new gfw.ui.view.SourceWindow();
    this.$el.append(this.sourceWindow.render());
    var selfo = this;

    function start(parameter)
    {
      return function()
      {
        if (!sessionStorage.getItem('DIALOG')) return;
        var dialog = JSON.parse(sessionStorage.getItem('DIALOG'));

        if (!dialog.display) return;
        ga('send', 'event', 'SourceWindow', 'Open', dialog.type);
        selfo.sourceWindow.show(dialog.type);
        $('.backdrop').hide();
        sessionStorage.removeItem('DIALOG');
      }
    }

    $(document).ready(start(selfo));

  },

  _drawCountries: function() {
    var that = this;

    var sql = ['SELECT c.iso, c.enabled, m.the_geom',
               'FROM ne_50m_admin_0_countries m, gfw2_countries c',
               'WHERE c.iso = m.adm0_a3 AND c.enabled',
               '&format=topojson'].join(' ');

    var sql_ = ['SELECT c.iso, m.the_geom',
                'FROM ne_50m_admin_0_countries m, gfw2_countries c',
                'WHERE c.iso = m.adm0_a3',
                "AND c.iso = 'TWN'&format=topojson"].join(' ');

    d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql, function(error, topology) {
      for (var i = 0; i < Object.keys(topology.objects).length; i++) {
        var iso = topology.objects[i].properties.iso;

        var bounds = draw(topology, i, iso, { alerts: false });

        if (iso === 'CHN') {
          that.bounds = bounds;

          d3.json('https://wri-01.cartodb.com/api/v2/sql?q='+sql_, function(error, topology) {
            draw(topology, 0, 'CHN', { alerts: false, bounds: that.bounds});
          });
        }
      }
    });
  },
});
