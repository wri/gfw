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

    var map = new google.maps.Map(document.getElementById("map"));
    widget = new gfw.ui.view.LayerSelector({ map : map });

    $("body").append(widget.render());

  });

  afterEach(function() {

    $("body").find(".layer_selector").remove();
    widget.clean();

  });

  it("should be hidden by default", function() {
    expect(widget.model.get("hidden")).toEqual(true);
  });

  it("should be closed by default", function() {
    expect(widget.model.get("closed")).toEqual(true);
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

  it("should set the selected layer on init", function() {
    var layer = widget.layers.find(function(layer) { return layer.get("selected"); });
    expect(widget.$selected_layer.find("li").text().trim()).toEqual(layer.get("title"));
  });

  it("should set the layers on init", function() {
    expect(widget.$layers.find("li").length).toEqual(widget.layers.length);
  });

  it("should trigger a change action when the user clicks in a layer", function() {

    var spy = spyOn(widget, 'onLayerClick');
    widget.delegateEvents();

    widget.open();

    waits(550);

    runs(function(){
      $(widget.$layers.find("li")[0]).find("a").click();
      expect(spy).toHaveBeenCalled();
    });

  });

  it("should open the layer selector when the user clicks in the selected layer", function() {

    widget.open();

    waits(550);

    runs(function(){
      widget.$selected_layer.find("li a").click();
      expect(widget.model.get("closed")).toEqual(false);
    });

  });
  it("should allow to change layers", function() {

    widget.open();

    waits(550);

    runs(function(){
      $(widget.$layers.find("li")[1]).find("a").click();

      var layer = widget.layers.find(function(layer) { return layer.get("selected"); });

      expect(layer.get("title")).toEqual("Satellite");
      expect(widget.model.get("closed")).toEqual(true);

    });

  });

  /*it("should hide the list of layers on close", function() {

    waits(250);

    runs( function() {

      widget.close();

      waits(550);

      runs(function(){
        expect(widget.$layers).toBeHidden();
        expect(widget.$selected_layer).toBeVisible();
      });
    });

  });*/

  it("should hide the selected layer on open", function() {

    waits(250);

    runs( function() {

      widget.open();

      waits(550);

      runs(function(){
        expect(widget.$selected_layer).toBeHidden();
        //expect(widget.$layers).toBeVisible();
      });
    });

  });

});
