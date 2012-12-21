/*
* common.ui.view.Legend
*
*/
describe("common.ui.view.Legend", function() {

  var widget;

  beforeEach(function() {

    widget = new gfw.ui.view.Legend({
      model: new gfw.ui.model.Legend
    });

    $("body").append(widget.render());

  });

  afterEach(function() {

    $("body").find(".legend").remove();
    widget.clean();

  });

  it("should be hidden by default", function() {
    expect(widget.model.get("hidden")).toBeTruthy();
  });

  it("should have a layerCount", function() {
    expect(widget.model.get("layerCount")).toEqual(0);
  });

  it("should allow to increase the layerCount", function() {
    widget.increaseLayerCount();
    widget.increaseLayerCount();
    widget.increaseLayerCount();
    expect(widget.model.get("layerCount")).toEqual(3);
  });

  it("should allow to decrease the layerCount", function() {
    widget.model.set("layerCount", 10);
    widget.decreaseLayerCount();
    widget.decreaseLayerCount();
    widget.decreaseLayerCount();
    expect(widget.model.get("layerCount")).toEqual(7);
  });

  it("should allow to add an item", function() {

    widget.add(1, "category", "Category Title", "title", "red");
    widget.add(2, "category", "Category Title", "title 2", "blue");
    widget.add(3, "category", "Category Title", "title 3", "blue");

    expect(_.size(widget.categories)).toEqual(1);
    expect(widget.categories.category.length).toEqual(3);
    expect(widget.model.get("layerCount")).toEqual(3);

    expect(widget.$el.find(".content ul.category").length).toEqual(1);
    expect(widget.$el.find(".content ul.category li").length).toEqual(4);

  });

  it("should allow to add items in different categories", function() {

    widget.add(1, "category", "Category Title", "title", "red");
    widget.add(2, "category_two", "Category Title 2", "title 2", "blue");

    expect(_.size(widget.categories)).toEqual(2);
    expect(widget.categories.category.length).toEqual(1);
    expect(widget.categories.category_two.length).toEqual(1);

    expect(widget.model.get("layerCount")).toEqual(2);

    expect(widget.$el.find(".content ul").length).toEqual(2);

  });

  it("shouldn't allow to add the same item twice", function() {

    widget.add(1, "category", "Category Title", "title", "red");
    widget.add(1, "category", "Category Title", "title", "red");
    widget.add(1, "category_two", "Category Title", "title", "red");

    expect(_.size(widget.categories)).toEqual(1);
    expect(widget.categories.category.length).toEqual(1);
    expect(widget.$el.find(".content ul").length).toEqual(1);
    expect(widget.$el.find(".content ul li").length).toEqual(2);

    expect(widget.model.get("layerCount")).toEqual(1);

  });

  it("should allow to remove an item", function() {

    widget.add(1, "category", "Category Title", "title", "red");
    widget.remove(1);
    expect(widget.model.get("layerCount")).toEqual(0);

    expect(_.size(widget.categories)).toEqual(0);

  });

  it("should allow to replace an item", function() {

    widget.add(1, "category", "Category Title", "title", "red");
    widget.replace(1, "category", "Category Title", "new_title", "red");

    expect(widget.model.get("layerCount")).toEqual(1);

    expect(_.size(widget.categories)).toEqual(1);
    expect(widget.categories["category"].models[0].get("title")).toEqual("new_title");

  });

  it("should allow to remove an item (2)", function() {

    widget.add(1, "category", "Category Title", "title", "red");
    widget.add(2, "category", "Category Title", "title 2", "blue");
    widget.remove(1);

    expect(_.size(widget.categories)).toEqual(1);

  });

  it("should allow to add and remove the same item", function() {

    widget.add(1, "category", "Category Title", "title", "red");
    widget.remove(1);
    widget.add(1, "category", "Category Title", "title", "red");

    expect(_.size(widget.categories)).toEqual(1);
    expect(widget.categories.category.length).toEqual(1);
    expect(widget.model.get("layerCount")).toEqual(1);

  });

  it("if there one items left the legend shouldn't be hidden", function() {

    widget.show();

    widget.add(1, "category", "Category Title", "title", "red");
    widget.add(2, "category", "Category Title", "title 2", "blue");
    widget.remove(1);

    expect(widget.model.get("hidden")).toEqual(false);

  });

  it("if there's no items left the legend should be hidden", function() {

    widget.add(1, "category", "Category Title", "title", "red");
    widget.add(2, "category", "Category Title", "title 2", "blue");

    widget.remove(1);
    widget.remove(2);

    expect(widget.model.get("layerCount")).toEqual(0);
    expect(widget.model.get("hidden")).toEqual(true);

  });

  it("should show the inner white shadow on open", function() {
    widget.open();
    expect(widget.$el.find(".shadow")).toBeVisible();
  });

  it("should hide the inner white shadow on close", function() {
    widget.open();
    widget.close();
    expect(widget.$el.find(".shadow")).toBeHidden();
  });

  it("should show the number of layers on close", function() {

    widget.add(1, "countries", "Countries", "Spain", "red")
    widget.add(2, "countries", "Countries", "Greece", "green")
    widget.add(3, "countries", "Countries", "Italy", "yellow")
    widget.add(4, "countries", "Countries", "France", "blue")
    widget.add(11, "colors", "Colors", "Red", "red")
    widget.add(12, "colors", "Colors", "Green", "green")
    widget.add(13, "colors", "Colors", "Yellow", "yellow")
    widget.add(14, "colors", "Colors", "Blue", "blue")

    expect(widget.model.get("layerCount")).toEqual(8);

    widget.close();
    expect(widget.$el.find(".layer_count").text()).toEqual("8 layers");

  });

  it("should allow to toggle an item", function() {

    widget.toggleItem(1, "countries", "Countries", "Spain", "red")
    widget.toggleItem(2, "countries", "Countries", "Greece", "green")
    widget.toggleItem(3, "countries", "Countries", "Italy", "yellow")
    widget.toggleItem(4, "countries", "Countries", "France", "blue")

    expect(widget.model.get("layerCount")).toEqual(4);

    widget.toggleItem(1, "countries", "Countries", "Spain", "red")
    widget.toggleItem(4, "countries", "Countries", "France", "blue")

    expect(widget.model.get("layerCount")).toEqual(2);

  });

});
