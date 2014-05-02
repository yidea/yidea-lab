// Router
var app = app || {};

(function () {
  // #/completed
  var TodoRouter = Backbone.Router.extend({
    routes: {
      "*filter": "setFilter" //pass string after #/
    },
    setFilter: function (param) {
      // set current filter
      app.TodoFilter = param || "";

      // trigger collection change
      app.Todos.trigger("fitler");
    }
  });

  app.TodoRouter = new TodoRouter();
  Backbone.history.start();
})();
