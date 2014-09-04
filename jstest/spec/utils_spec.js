/**
 * Unit test coverage for the utils module.
 */
define([
  'underscore',
  'map/utils'
], function(_) {

  'use strict';

  describe('Utils', function() {

    describe('_toNumber()', function() {
      it('correctly returns numbers for numbers', function() {
        expect(_.toNumber('1')).toEqual(1);
        expect(_.toNumber(1)).toEqual(1);
        expect(_.toNumber('1.1')).toEqual(1.1);
      });

      it('correctly returns undefined for non-numbers', function() {
        expect(_.toNumber('a')).toEqual(undefined);
        expect(_.toNumber('')).toEqual(undefined);
        expect(_.toNumber(undefined)).toEqual(undefined);
        expect(_.toNumber(null)).toEqual(undefined);
      });
    });

    describe('String.format()', function() {
      it('correctly format multiple parameters', function() {
        expect('{0} {1}'.format('Hello','world')).toEqual('Hello world');
      });
    });

    describe('_extendNonNull()', function() {
      it('correctly doesn\'t returns null values', function() {
        expect(_.extendNonNull({a: 0}, {b: null, c: 2})).toEqual({a: 0, c: 2});
      });
    });

  });
});
