/*
* common.ui.view.GOD
*
*/

describe("common.ui.view.GOD", function() {

  var toggleSpy, tooltip;

  beforeEach(function() {

    toggleSpy = spyOn(gfw.ui.view.Widget.prototype, 'toggle').andCallThrough();

    tooltip = new gfw.ui.view.Tooltip({
      model: new gfw.ui.model.Tooltip(),
      template: $("#tooltip-template").html()
    });

  });

  afterEach(function() {

    GOD.items = [];
    tooltip.clean();

  });

  it("should exist", function() {

    expect(GOD).toBeDefined();

  });

  it("should have a collection of items", function() {

    expect(GOD.items).toBeDefined();
    expect(GOD.items instanceof Array).toEqual(true);

  });

  it("should allow to add a new view to the collection", function() {

    var tooltip2 = new gfw.ui.view.Tooltip({
      model: new gfw.ui.model.Tooltip(),
      template: $("#tooltip-template").html()
    });

    var callback = function() { return true; };

    GOD.add(tooltip, callback);
    GOD.add(tooltip2, callback);

    expect(GOD.items.length).toEqual(2);

  });

  it("should allow to trigger the callbacks", function() {

    var tooltip2 = new gfw.ui.view.Tooltip({
      model: new gfw.ui.model.Tooltip(),
      template: $("#tooltip-template").html()
    });

    var callback = function() { return true; };

    GOD.add(tooltip, callback);
    GOD.add(tooltip2, callback);

    GOD.triggerCallbacks();

    expect(GOD.items.length).toEqual(0);

  });
});

