/*
* common.ui.view.Dialog
*
*/
describe("common.ui.view.Dialog", function() {

  var widget;

  beforeEach(function() {

    widget = new gfw.ui.view.Dialog();
    $("body").append(widget.render());

  });

  afterEach(function() {

    widget.clean();

  });


  it("should have a close button", function() {
    expect(widget.$close).toBeDefined();
  });

  it("should have a accept button", function() {
    expect(widget.$accept).toBeDefined();
  });

  it("should have a cancel button", function() {
    expect(widget.$cancel).toBeDefined();
  });

  it("should trigger a change action when the user clicks in the close button", function() {

    var spy = spyOn(widget, 'onClose');

    widget.delegateEvents();

    widget.$close.click();

    waits(550);

    runs(function(){
      expect(spy).toHaveBeenCalled();
    });

  });

  it("should trigger a change action when the user clicks in the cancel button", function() {

    var spy = spyOn(widget, 'onCancel');

    widget.delegateEvents();

    widget.$cancel.click();

    waits(550);

    runs(function(){
      expect(spy).toHaveBeenCalled();
    });

  });

  it("should trigger a change action when the user clicks in the accept button", function() {

    var spy = spyOn(widget, 'onAccept');

    widget.delegateEvents();

    widget.$accept.click();

    waits(550);

    runs(function(){
      expect(spy).toHaveBeenCalled();
    });

  });


  it("should trigger the callback defined when the user clicks in the accept button", function() {


    var callback = function() { console.log('callback'); }

    var spy = spyOn(widget, 'callback');

    widget.model.set(widget, "callback");

    widget.$accept.click();

    waits(550);

    runs(function(){
      expect(spy).toHaveBeenCalled();
    });

  });

});
