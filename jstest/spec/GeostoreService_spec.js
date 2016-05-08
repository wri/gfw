/**
 * Unit tests for the CartoDbCanvasLayer class.
 */
define([
  'sinon',
  'map/services/GeostoreService'
], function(sinon, GeostoreService) {

  'use strict';

  var RESPONSES = {
    as_it_happens: {
      cartodb: {
        map: { }
      }
    }
  };

  describe('GeostoreService', function() {
    var requests,
        xhr;

    beforeEach(function() {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];

      xhr.onCreate = function (xhr) {
        requests.push(xhr);
      };
    });

    afterEach(function() {
      xhr.restore();
    });

    it('exists', function() {
      expect(GeostoreService).toBeDefined();
    });

    describe('.get', function() {
      it('gets geojson from the server for the given ID', function(done) {
        var expectedGeojson = {a: 'b'};

        GeostoreService.get('ABCD').then(function(geojson) {
          expect(geojson).toEqual(expectedGeojson);
          done();
        }).catch(done);

        var request = requests[0];
        request.respond(200, { 'Content-Type': 'application/json' },
          JSON.stringify(expectedGeojson));
      });
    });

    describe('.save', function() {
      it('saves the given geojson to the server', function(done) {
        GeostoreService.save({}).then(function(id) {
          expect(id).toEqual('ABCD');
          done();
        }).catch(done);

        var request = requests[0];
        request.respond(200, { 'Content-Type': 'application/json' },
          JSON.stringify({id: 'ABCD'}));
      });
    });
  });

});
