gfw.ui.view.CountriesIndex = cdb.core.View.extend({
  el: document.body,

  initialize: function() {
    this._drawCountries();
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
  }
});