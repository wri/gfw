define([
  'underscore', 'backbone', 'moment',
  'map/presenters/tabs/AnalysisPresenter',
], function(_, Backbone, moment, AnalysisPresenter) {

  describe('AnalysisPresenter', function() {

    describe('_buildResource', function() {

      beforeEach(function() {
        this.status = new (Backbone.Model.extend({
          defaults: {date: []}}))();

        var context = {
          status: this.status,
          datasets: {
            'loss': 'umd-loss-gain',
            'loss_by_driver': 'umd-loss-gain',
            'forestgain': 'umd-loss-gain',
            'forest2000': 'umd-loss-gain',
            'viirs_fires_alerts': 'viirs-active-fires',
            'afakelayer': 'fl'
          }
        };

        this.method = AnalysisPresenter.prototype._buildResource.bind(context);
      });

      describe('when there is no baselayer selected', function() {
        beforeEach(function() {
          this.status.unset('baselayer');
        });

        it('returns the resource unchanged', function() {
          expect(this.method({})).toEqual({});
        });
      });

      describe('when a baselayer is selected', function() {
        beforeEach(function() {
          this.status.set('baselayer', {
            slug: 'afakelayer'
          });
        });

        describe('given a geostore ID', function() {
          beforeEach(function() {
            this.status.set('geostore', '1234');
          });

          it('stores the geostore ID on the resource', function() {
            expect(this.method({}).geostore).toEqual('1234');
          });
        });

        describe('given a date', function() {
          beforeEach(function() {
            this.status.set('date', ['2002-02-02', '2003-03-03']);
          });

          it('formats the period as YYYY-MM-DD,YYYY-MM-DD', function() {
            expect(this.method({}).period).toEqual('2002-02-02,2003-03-03');
          });
        });

        describe('given no date', function() {
          it('formats the default period as YYYY-MM-DD,YYYY-MM-DD', function() {
            expect(this.method({}).period).toEqual('2001-01-01,2014-12-31');
          });
        });

        it('stores the dataset on the resource', function() {
          expect(this.method({}).dataset).toEqual('fl');
        });
      });

      describe('when the forestgain baselayer is selected', function() {
        beforeEach(function() {
          this.status.set('baselayer', {
            slug: 'forestgain'
          });
        });

        it('defaults to a fixed period', function() {
          expect(this.method({}).period).toEqual('2001-01-01,2013-12-31');
        });

        describe('with a threshold selected', function() {
          beforeEach(function() {
            this.status.set('threshold', 40);
          });

          it('stores the threshold on the resource', function() {
            expect(this.method({}).thresh).toEqual('?thresh=40');
          });
        });

        describe('with no threshold selected', function() {
          beforeEach(function() {
            this.status.set('threshold', null);
          });

          it('defaults to a threshold of 30', function() {
            expect(this.method({}).thresh).toEqual('?thresh=30');
          });
        });
      });

      describe('when the loss baselayer is selected', function() {
        beforeEach(function() {
          this.status.set('baselayer', {
            slug: 'loss'
          });
        });

        describe('with a threshold selected', function() {
          beforeEach(function() {
            this.status.set('threshold', 40);
          });

          it('stores the threshold on the resource', function() {
            expect(this.method({}).thresh).toEqual('?thresh=40');
          });
        });

        describe('with no threshold selected', function() {
          beforeEach(function() {
            this.status.set('threshold', null);
          });

          it('defaults to a threshold of 30', function() {
            expect(this.method({}).thresh).toEqual('?thresh=30');
          });
        });
      });

      describe('when the forest2000 baselayer is selected', function() {
        beforeEach(function() {
          this.status.set('baselayer', {
            slug: 'forest2000'
          });
        });

        describe('with a threshold selected', function() {
          beforeEach(function() {
            this.status.set('threshold', 40);
          });

          it('stores the threshold on the resource', function() {
            expect(this.method({}).thresh).toEqual('?thresh=40');
          });
        });

        describe('with no threshold selected', function() {
          beforeEach(function() {
            this.status.set('threshold', null);
          });

          it('defaults to a threshold of 30', function() {
            expect(this.method({}).thresh).toEqual('?thresh=30');
          });
        });
      });

      describe('when the viirs baselayer is selected', function() {
        beforeEach(function() {
          this.status.set('baselayer', {
            slug: 'viirs_fires_alerts'
          });
        });

        describe('with a date far in the past', function() {
          beforeEach(function() {
            this.status.set('date', ['2014-03-03', '2014-03-04']);
          });

          it('transforms the dates to the most recent valid range', function() {
            var expectedPeriod = [
              moment().subtract(1, 'days').utc().format('YYYY-MM-DD'),
              moment().utc().format('YYYY-MM-DD')].join(',');

            expect(this.method({}).period).toEqual(expectedPeriod);
          });
        });
      });

      describe('when a baselayer that is not loss, forestgain or forest2000 is selected', function() {
        beforeEach(function() {
          this.status.set('baselayer', {
            slug: 'afakelayer'
          });
        });

        it('does not set a threshold', function() {
          expect(this.method({}).thresh).toBeUndefined();
        });
      });

    });

  });

});
