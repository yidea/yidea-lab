/* underscore analysis
*
* TODO:
* - typeof options.symbol !== "undefined" vs. hasOwnProperty()
* - add unit tests, yeoman
*
* */

 (function () {
  var Util = window.Util = {};
  // Collection

  // type check
  /**
   * .isArray(list)
   */
  Util.isArray = function () {
    //ECMA5 native Array.isArray
    if (Array.isArray) {

    }
  };

  /**
   * .each(collection, callback, [context])
   * iterate/forEach collection and operate on each
   *
   * @param collection {Object|Array}
   * @param callback {Funciton}
   * @param context
   * @return {Null}
   *  .each([1, 2, 3], funciton(value, index, list){});
   *  .each({one: 1, two: 2, three: 3}, function(value, key, list){});
   */
  var each = Util.each = function (collection, callback, context) {
    //validate: null/undefined
    if (collection == null) {return;}

    var type = Object.prototype.toString.call(collection),
      i = 0;

    // problem: also need handle arrayLike html element; objectLike, so type detection is not sufficient

    if (type === "[object Array]" || collection.nodeType === 1) {
      //array || html elments
      if (Array.prototype.forEach) { //es5 forEach, IE9+
        collection.forEach(callback, context);
      } else { //fallback
        var len = collection.length;
        for ( ; i < len; i++) {
          callback.call(context, i, collection);
        }
      }

      //object
    } else if (type === "[object Object]") {
      for (i in collection) {
        if (collection.hasOwnProperty(i)) { //direct properties
          callback.call(context, collection[i], i, collection);
        }
      }
    }
  };

  Util.each([1, 2, 3], function (value, index) {
    $.log(value, index);
  });
  Util.each({one: 1, two: 2}, function (value, key) {
    $.log(value, key);
  });
  //each loop htmlcollection

  var list = document.querySelectorAll(".test");
  console.log(list); //TODO:debug
  Util.each(list, function (value, index) {
    $.log(value, index);
  });


  /* .map(list, iterator, [context])
   - map collection and return new array

   - .map([1,2,3], function (value) {return num +1})
   - .map({one: 1, two: 2}, function(value, key) {return})
   * */


})();


