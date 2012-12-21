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

  it("should have a previous button", function() {
    expect(widget.$previous).toBeDefined();
  });

  it("should have a next button", function() {
    expect(widget.$next).toBeDefined();
  });

});
