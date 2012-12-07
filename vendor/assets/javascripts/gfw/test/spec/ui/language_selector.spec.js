/*
* common.ui.model.Language
*
*/
describe("common.ui.model.Language", function() {

  var widget;

  beforeEach(function() {

    model = new gfw.ui.model.Language();

  });

  afterEach(function() {

  });

  it("should have a selected status", function() {
    expect(model.get("selected")).toBeDefined();
  });

});

/*
* common.ui.view.LanguageSelector
*
*/
describe("common.ui.view.LanguageSelector", function() {

  var widget;

  beforeEach(function() {

    var map = new google.maps.Map(document.getElementById("map"));
    widget = new gfw.ui.view.LanguageSelector({ map : map });

    $("body").append(widget.render());

  });

  afterEach(function() {

    $("body").find(".language_selector").remove();
    widget.clean();

  });

  it("should be hidden by default", function() {
    expect(widget.model.get("hidden")).toEqual(true);
  });

});
