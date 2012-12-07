/*
* common.ui.model.Layer
*
*/
describe("common.ui.model.Layer", function() {

  var widget;

  beforeEach(function() {

    model = new gfw.ui.model.Layer();

  });

  afterEach(function() {

  });

  it("should have a selected status", function() {
    expect(model.get("selected")).toBeDefined();
  });

});

/*
* common.ui.view.LayerSelector
*
*/
describe("common.ui.view.LayerSelector", function() {

  var widget;

  beforeEach(function() {

    widget = new gfw.ui.view.LayerSelector();

    $("body").append(widget.render());

  });

  afterEach(function() {

    $("body").find(".layer_selector").remove();
    widget.clean();

  });

  it("should be hidden by default", function() {
    expect(widget.model.get("hidden")).toEqual(true);
  });

  it("should have a collection of layers", function() {
    expect(widget.layers).toBeDefined();
  });

  it("should have three layers", function() {
    expect(widget.layers.length).toEqual(3);
  });

  it("should have a layer list", function() {
    expect(widget.$layers).toBeDefined();
  });

  it("should have a selected layer div", function() {
    expect(widget.$selected_layer).toBeDefined();
  });



});
