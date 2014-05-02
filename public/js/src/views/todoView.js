// View - sub
var app = app || {};

(function ($) {

  app.TodoView = Backbone.View.extend({
    tagName: "li",
    template: Handlebars.compile($("#template-item").html()),
    events: {},
    initialize: function () {
      this.listenTo(this.model, "change", this.render);
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

})(jQuery);

