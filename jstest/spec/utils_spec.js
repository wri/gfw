/**
 * Unit test coverage for the utils module.
 */
define([
  'utils',
  'underscore'
], function(utils, _) {

  'use strict';

  describe('utils module suite', function() {


    /**
     * Spec for testing _toNumber().
     */
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
  });
});