define([], function() {
  describe('Simple object', function() {
    var foo;

    beforeEach(function() {
      foo = 'John';
    });

    it('should be John', function() {
      expect(foo).toEqual('John');
    });
  });
});
