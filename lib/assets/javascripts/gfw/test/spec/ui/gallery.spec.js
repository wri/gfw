/*
* common.ui.view.Gallery
*
*/
describe("common.ui.view.Gallery", function() {

  var widget;

  beforeEach(function() {

    widget = new gfw.ui.view.Gallery();
    $("body").append(widget.render());

  });

  afterEach(function() {

    widget.clean();

  });

  it("should have a left button", function() {
    expect(widget.$left).toBeDefined();
  });

  it("should have a right button", function() {
    expect(widget.$right).toBeDefined();
  });

  it("should have a list of sites", function() {
    expect(widget.sites).toBeDefined();
  });

  it("should allow to add a handler", function() {

    var $handler = $(".handler");
    widget.addHandler($handler);

    expect(widget.$handler).toBeDefined();
  });

});
