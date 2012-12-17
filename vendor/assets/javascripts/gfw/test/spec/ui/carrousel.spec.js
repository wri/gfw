/*
* common.ui.view.Carrousel
*
*/
describe("common.ui.view.Carrousel", function() {

  var widget;

  beforeEach(function() {

    widget = new gfw.ui.view.Carrousel();
    //$("body").append(widget.render());

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

});
