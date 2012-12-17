/*
* common.ui.view.Timeline
*
*/
describe("common.ui.view.Timeline", function() {

  var widget;

  beforeEach(function() {

    widget = new gfw.ui.view.Timeline({
      model: new gfw.ui.model.Timeline()
    });

  });

  afterEach(function() {

    widget.clean();

  });

  it("should allow to show the widget", function() {

    widget.show();
    expect(widget.model.get("hidden")).toEqual(false);

  });


});
