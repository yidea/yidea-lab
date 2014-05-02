// Model
var app = app || {};

(function () {
  // Attribute: {title, completed, order}
  app.Todo = Backbone.Model.extend({
    default: {
      title: "",
      completed: false
    },
    // model listener
    initialize: function () {
      this.on("change", function () { //change:title
        $.log("model changed");
      })
    },
    toggle: function () {
      this.save({completed: !this.get("completed")});
    }
  });
})();
