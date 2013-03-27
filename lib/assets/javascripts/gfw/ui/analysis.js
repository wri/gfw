gfw.ui.model.Analysis = Backbone.Model.extend({
  defaults: {
  },


});

gfw.ui.view.Analysis = gfw.core.View.extend({

  className: 'analysis',

  events: {

  },

  initialize: function() {

  },

  render: function() {
    var that = this;

    this.$el.append(this.template.render( this.model.toJSON() ));

    return this.$el;

  }

});
