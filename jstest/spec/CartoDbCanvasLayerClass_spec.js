/**
 * Unit tests for the CartoDbCanvasLayer class.
 */
define([
  'sinon', 'moment',
  'abstract/layer/CartoDbCanvasLayerClass',
  'map/services/CartoDbLayerService'
], function(sinon, moment, CartoDbCanvasLayer, CartoDbLayerService) {

  var RESPONSES = {
    as_it_happens: {
      cartodb: {
        map: { "layergroupid": "b92e0fecd7d27e8114973cf095c9d3f0:1444468359441.9302", "metadata": { "layers": [ { "type": "mapnik", "meta": {} } ] }, "cdn_url": { "http": "ashbu.cartocdn.com", "https": "cartocdn-ashbu.global.ssl.fastly.net" }, "last_updated": "2015-10-10T09:12:39.441Z" }
      }
    }
  };

  describe('CartoDbCanvasLayer', function() {
    it('exists', function() {
      expect(CartoDbCanvasLayer).toBeDefined();
    });

    describe('init', function() {
      describe('given no current date', function() {
        var layer;

        beforeEach(function() {
          layer = new CartoDbCanvasLayer({
            mindate: '2015-01-01'
          });
        });

        it('assigns the mindate from the layer', function() {
          var date = layer.currentDate[0];

          expect(moment.isMoment(date)).toBe(true);
          expect(date.format('YYYY-MM-DD')).toEqual('2015-01-01');
        });

        it('assigns the maxdate as today', function() {
          var date = layer.currentDate[1],
              today = new Date().toISOString().slice(0, 10);

          expect(moment.isMoment(date)).toBe(true);
          expect(date.format('YYYY-MM-DD')).toEqual(today);
        });
      });

      describe('given a current date', function() {
        var layer;

        beforeEach(function() {
          layer = new CartoDbCanvasLayer({}, {
            currentDate: [1,2]
          });
        });

        it('assigns the mindate from the options', function() {
          var date = layer.currentDate[0];
          expect(date).toEqual(1);
        });

        it('assigns the maxdate as today', function() {
          var date = layer.currentDate[1];
          expect(date).toEqual(2);
        });
      });
    });

    describe('._getLayer', function() {
      var layer;
      var layerOptions = {slug: 'escargo'};

      beforeEach(function() {
        sinon.stub(CartoDbLayerService.prototype, 'fetchLayerConfig', function() {
          var deferred = new $.Deferred();
          deferred.resolve(RESPONSES.as_it_happens.cartodb.map);
          return deferred.promise();
        });

        layer = new CartoDbCanvasLayer(layerOptions);

        sinon.stub(layer, '_getCartoCSS', function() { return "#layer { marker-width: 0; }" });
        sinon.stub(layer, '_getSQL', function() { return "SELECT * FROM an_table" });
      });

      it('constructs the tile URL from CartoDB', function(done) {
        layer._getLayer().then(function() {
          var url = layer.options.urlTemplate;
          var expectedUrl = 'https://cartocdn-ashbu.global.ssl.fastly.net/wri-01/api/v1/map/b92e0fecd7d27e8114973cf095c9d3f0:1444468359441.9302{/z}{/x}{/y}.png32';
          expect(url).toBe(expectedUrl);

          done();
        });
      });
    });
  });

});
