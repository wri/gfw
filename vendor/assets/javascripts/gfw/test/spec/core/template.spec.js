describe("core.template", function() {

  describe("gfw.core.Template", function() {
    var tmpl;
    beforeEach(function() {
      tmpl = new gfw.core.Template({
        template: "hi, my name is {{ name }}"
      });
    });

    it("should render", function() {
      expect(tmpl.render({name: 'rambo'})).toEqual("hi, my name is rambo");
    });

    it("should accept compiled templates", function() {
      tmpl = new gfw.core.Template({
        compiled: function(vars) { return 'hola ' + vars.name; }
      });
      expect(tmpl.render({name: 'rambo'})).toEqual("hola rambo");
    });

    it("should render using mustache", function() {
      tmpl = new gfw.core.Template({
        template: "hi, my name is {{ name }}",
        type: 'mustache'
      });

      expect(tmpl.render({name: 'rambo'})).toEqual("hi, my name is rambo");
    });
  });

  describe("gfw.core.TemplateList", function() {
    var tmpl;
    beforeEach(function() {
      tmpl = new gfw.core.TemplateList();
      tmpl.reset([
        {name: 't1', template: "hi, my name is {{ name }}"},
        {name: 't2', template: "byee!! {{ name }}"}
      ]);
    });

    it("should get template by name", function() {
      expect(tmpl.getTemplate('t1')).toBeTruthy();
      expect(tmpl.getTemplate('t2')({name:'rambo'})).toEqual('byee!! rambo');
      expect(tmpl.getTemplate('nononon')).toBeFalsy();
    });
  });

});

