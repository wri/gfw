/*
* common.ui.view.Widget
*
*/
describe("common.ui.view.Widget", function() {

  var widget;

  beforeEach(function() {

    widget = new gfw.ui.view.Widget({
      model: new gfw.ui.model.Widget()
    });

  });

  afterEach(function() {

    widget.clean();

  });

  it("should allow to show the widget", function() {

    widget.show();
    expect(widget.model.get("hidden")).toEqual(false);

  });

  it("should allow to hide the widget", function() {

    widget.hide();
    expect(widget.model.get("hidden")).toEqual(true);

  });

  it("should allow to set the position of the magnifier", function() {

    widget.setPosition(300, 200);
    widget.$el.css("position", "absolute");

    expect(widget.$el.css("left")).toEqual("300px");
    expect(widget.$el.css("top")).toEqual("200px");

  });

  it("should return the width of the widget", function() {

    widget.$el.css("width", 50);
    expect(widget.width()).toEqual(50);

    widget.setSize(200, 100);
    expect(widget.width()).toEqual(200);

  });

  it("should return the height of the widget", function() {

    widget.$el.css("height", 50);
    expect(widget.height()).toEqual(50);

    widget.setSize(100, 500);
    expect(widget.height()).toEqual(500);

  });

  it("should allow to set the top position of the widget", function() {

    widget.setPosition(100, 200);
    widget.setTop(500);

    expect(widget.$el.css("top")).toEqual("500px");
    expect(widget.$el.css("left")).toEqual("100px");
    expect(widget.getPosition()).toEqual({ y: 500, x: 100 });

  });

  it("should allow to set the left position of the widget", function() {

    widget.setPosition(100, 200);
    widget.setLeft(500);

    expect(widget.$el.css("top")).toEqual("200px");
    expect(widget.$el.css("left")).toEqual("500px");
    expect(widget.getPosition()).toEqual({ x: 500, y: 200 });

  });

  it("should allow to set the height of the widget", function() {

    widget.setSize(100, 200);
    widget.setHeight(500);

    expect(widget.$el.css("width")).toEqual("100px");
    expect(widget.$el.css("height")).toEqual("500px");
    expect(widget.getSize()).toEqual({ w: 100, h: 500 });

  });

  it("should allow to set the width of the widget", function() {

    widget.setSize(100, 200);
    widget.setWidth(300);

    expect(widget.$el.css("width")).toEqual("300px");
    expect(widget.$el.css("height")).toEqual("200px");
    expect(widget.getSize()).toEqual({ w: 300, h: 200 });

  });

  it("should allow to resize the widget", function() {

    widget.setSize(100, 200);

    expect(widget.$el.css("width")).toEqual("100px");
    expect(widget.$el.css("height")).toEqual("200px");
    expect(widget.getSize()).toEqual({ w: 100, h: 200 });

  });

  it("should allow to resize the widget", function() {

    widget.setSize(100, 200);

    expect(widget.$el.css("width")).toEqual("100px");
    expect(widget.$el.css("height")).toEqual("200px");
    expect(widget.getSize()).toEqual({ w: 100, h: 200 });

  });

  it("should allow to enable/disable the resizable status of the widget", function() {

    widget.setResizable(true);

    expect(widget.model.get("resizable")).toEqual(true);
    expect(widget.$el.hasClass("ui-resizable")).toEqual(true);
    expect(widget.$el.hasClass("ui-resizable-disabled")).toEqual(false);

    widget.setResizable(false);
    expect(widget.model.get("resizable")).toEqual(false);
    expect(widget.$el.hasClass("ui-resizable")).toEqual(false);
    expect(widget.$el.hasClass("ui-resizable-disabled")).toEqual(false);

  });

  it("should remove the handler when the widget is not resizable", function() {

    widget.setResizable(true);
    widget.setResizable(false);
    expect(widget.$el.find(".ui-resizable-handle").length).toEqual(0);

  });

  it("should allow to enable/disable the dragging of the widget", function() {

    widget.setDraggable(true);

    expect(widget.model.get("draggable")).toEqual(true);
    expect(widget.$el.hasClass("ui-draggable")).toEqual(true);
    expect(widget.$el.hasClass("ui-draggable-disabled")).toEqual(false);

    widget.setDraggable(false);

    expect(widget.model.get("draggable")).toEqual(false);
    expect(widget.$el.hasClass("ui-draggable")).toEqual(true);
    expect(widget.$el.hasClass("ui-draggable-disabled")).toEqual(true);

  });

});
