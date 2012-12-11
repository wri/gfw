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

    widget  = new gfw.ui.view.LanguageSelector();

    $("body").append("<a href='#' class='handler'>xx</a>");
    $("body").append(widget.render());

  });

  afterEach(function() {

    $("body").find(".language_selector").remove();
    widget.clean();
    $("body").find(".handler").remove();

  });

  it("should be hidden by default", function() {
    expect(widget.model.get("hidden")).toEqual(true);
  });

  it("should have a list of languages", function() {
    expect(widget.languages).toBeDefined();
  });

  it("should trigger a click action when the user clicks in a language", function() {

    var spy = spyOn(widget, 'onLanguageClick');
    widget.delegateEvents();

    widget.addLanguage({ name: "english", title: "English", url: "" });
    widget.addLanguage({ name: "french",  title: "French",  url: "" });

    widget.open();

    waits(550);

    runs(function(){
      $(widget.$languages.find("li")[0]).find("a").click();
      expect(spy).toHaveBeenCalled();
    });

  });

  it("should allow to add languages", function() {
    widget.addLanguage({ name: "english", title: "English", url: "" });
    widget.addLanguage({ name: "french",  title: "French",  url: "" });
    widget.addLanguage({ name: "spanish", title: "Spanish", url: "" });

    expect(widget.languages.length).toEqual(3);
    expect(widget.$languages.find("li").length).toEqual(3);
  });

  it("should allow to add a handler", function() {

    var $handler = $(".handler");
    widget.addHandler($handler);

    expect(widget.$handler).toBeDefined();
  });

  it("should change the handler text on click", function() {

    var $handler = $(".handler");
    widget.addHandler($handler);

    widget.addLanguage({ code: "en", title: "English", url: "" });
    widget.addLanguage({ code: "fr", title: "French",  url: "" });

    $(widget.$languages.find("li")[0]).find("a").click();

    waits(250);

    runs(function(){
      expect(widget.$handler.text()).toEqual("en");
    });

  });

});
