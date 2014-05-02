// View - main
//http://todomvc.com/architecture-examples/backbone/
var app = app || {};

(function ($) {

  app.AppView = Backbone.View.extend({
    el: "#app",
    templateHeader: Handlebars.compile($("#template-header").html()),

    // Dom events
    events: {
      "keypress #new-todo": "createOnEnter"
    },

    initialize: function () {
      // Dom ref & cache
      this.$header = this.$("#header");
      this.$footer = this.$("#footer");
      this.$input = this.$("#new-todo");
      this.$todoList = this.$("#todo-list");

      // View listenTo collection/model events, avoid zombie view - view.remove() will call stopListening()
      this.listenTo(app.Todos, "add", this.addOne);
      this.listenTo(app.Todos, "all", this.render);

      // fetch collection/model data
      app.Todos.fetch();
    },
    render: function () {
      // UI assemble & template load
//      this.$header.html(this.templateHeader({title: "Testing Preso category service..."}));
//      if (app.Todos.length) {}

      return this; //enable chain
    },

    //key enter in input to create new model
    createOnEnter: function (ev) {
      // validate: empty input, enter key
      if (ev.which !== ENTER_KEY || !$.trim(this.$input.val())) {
        return;
      }
      // create new model
      app.todos.create()


    },
    addOne: function (todo) {
      var view = new app.TodoView({model: todo});
      this.$todoList.append(view.render().el);
    }

  });

})(jQuery);
