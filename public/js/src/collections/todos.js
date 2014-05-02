// Collection
var app = app || {};

(function () {

  var Todos = Backbone.Collection.extend({
    // ref to model
    model: app.Todo,

    //localStorage adapter
    localStorage: new Backbone.LocalStorage("app_test"),

    // filter
    completed: function () {
      // return this.where({done: true});
      return this.filter(function (todo) {
        return todo.get("completed");
      })
    },
    remaining: function () {
      return this.without.apply(this, this.completed());
    },

    // sorted by insert order
    comparator: function (todo) {
      return  todo.get("order");
    }
  });

  app.Todos = new Todos();
})();
