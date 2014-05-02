var app = app || {};
var ENTER_KEY = 13;
var ESC_KEY = 27;

// View
$(function () {

  // App start
  new app.AppView();


  // Backbone.Events
  // - API: on/once/off, listenTo/listenToOnce/stopListening, trigger, bind/unbind
  var objCounter = {
    counterA: 0,
    counterB: 0
  };

  _.extend(objCounter, Backbone.Events);
  objCounter.once("add", incrA);
  objCounter.trigger("add");
  $.log(objCounter.counterA === 1 , "add only once");

  function incrA() {
    objCounter.counterA +=1;
    objCounter.trigger("add");
  }
});
