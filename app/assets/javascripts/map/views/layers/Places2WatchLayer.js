/**
 * Places to watch layer module.
 *
 * @return MiningLayer class (extends CartoDBLayerClass)
 */
define(
  [
    'underscore',
    'abstract/layer/CartoDBLayerClass',
    'text!map/cartocss/Places2Watch.cartocss'
  ],
  function(_, CartoDBLayerClass, Places2WatchCartocss) {
    var Places2WatchLayer = CartoDBLayerClass.extend({
      options: {
        sql:
          "WITH pc as (SELECT * from ptw_config_table where published = TRUE), pg as ( select grid_id, st_symdifference(st_makevalid(ST_Buffer(st_centroid(the_geom_webmercator),5500, 'quad_segs=24')), st_makevalid(ST_Buffer(st_centroid(the_geom_webmercator),5100, 'quad_segs=24'))) as the_geom_webmercator from ptw_grid_may2018_score_gt_0 where grid_id in (select grid_id from pc)), ptw AS (SELECT pc.cartodb_id, pc.grid_id, pc.glad_count, pc.name, pc.LINK, pc.image, pc.image_source, pc.overlap_pa, pc.overlap_ifl, pc.description, 'ptw_grid_may2018_score_gt_0'::text AS tablename, 'ptw_top_10'::text AS LAYER, TRUE AS actions, TRUE AS analize, TRUE AS readmore, FALSE AS analysis FROM ptw_config_table pc WHERE pc.published = TRUE) SELECT ptw.*, FALSE AS marker, pg.the_geom_webmercator, st_asgeojson(ST_transform(ST_Envelope(pg.the_geom_webmercator),4326)) bbox FROM ptw INNER JOIN pg ON ptw.grid_id = pg.grid_id UNION ALL SELECT ptw.*, TRUE AS marker, St_centroid(pg.the_geom_webmercator) AS the_geom_webmercator,st_asgeojson(ST_transform(ST_Envelope(pg.the_geom_webmercator), 4326)) bbox FROM ptw INNER JOIN pg ON ptw.grid_id = pg.grid_id",
        infowindow: true,
        interactivity:
          'cartodb_id, tablename, name, link, image, image_source, analysis, description, overlap_pa, overlap_ifl, actions, analize, readmore, bbox',
        analysis: false,
        cartocss: Places2WatchCartocss,
        actions: 'analize, readmore'
      },

      changeInfowindow: function(model) {
        if (
          !!model.attributes.content &&
          (!this.infoWindowContent ||
            !_.isEqual(this.infoWindowContent, model.attributes.content))
        ) {
          this.infoWindowContent = model.attributes.content;
          ga(
            'send',
            'event',
            'Map',
            'Open Places to Watch',
            this.infoWindowContent.data.name
          );
        }

        this.infowindowsUIEvents();
        this.infowindowsUIState();
        this.ptwInfowindowsUIEvents(model);
      },

      ptwInfowindowsUIEvents: function(model) {
        var $map = $('#map');
        $map
          .find('.cartodb-popup')
          .on('click.infowindow', '.js-ptw-track', function (e) {
            var target = $(e.target);
            var ptwKey = target.attr('data-ptw-key');

            if (
              target.attr('data-zoom') === 'true' &&
              (!this.infoWindowButtonId || ptwKey !== this.infoWindowButtonId)
            ) {
              ga(
                'send',
                'event',
                'Map',
                'Zooms to a place to watch',
                model.attributes.content.data.name
              );
            } else if (
              target.attr('data-readmore') === 'true' &&
              (!this.infoWindowButtonId || ptwKey !== this.infoWindowButtonId)
            ) {
              ga(
                'send',
                'event',
                'Map',
                'Read more about a place to watch',
                model.attributes.content.data.name
              );
            }
            this.infoWindowButtonId = ptwKey;
          });
      }
    });

    return Places2WatchLayer;
  }
);