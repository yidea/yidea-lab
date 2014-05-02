define([
  "jquery",
  "underscore",
  "common/ellipsify",
  "common/plugins/flyout"
], function ($, _, ellipsify) {

  var HeaderDropdown = function (el) {
    // Validate
    if (!el) { return; }

    // Members
    this.$el = $(el);
    this.$flyout = this.$el.find(".js-flyout");
    this.$flyoutToggle = this.$flyout.find(".js-flyout-toggle");
    this.$flyoutModal = this.$flyout.find(".js-flyout-modal");
  };

  HeaderDropdown.prototype = {
    init: function () {
      // Binding context as this
      _.bindAll(this, "_setSelection", "_updateToggle");

      // Event handlers
      this._addHandlers();
    },

    _addHandlers: function () {
      var self = this;

      // Init $.flyout plugin
      self.$flyout.flyout();

      // Listen to flyout shown event
      self.$flyout.on("shown", function () {
        self.$el.addClass("selected");
      });

      self.$flyout.on("hidden", function () {
        self.$el.removeClass("selected");
      });

      // Listen to flyoutModal selection
      self.$flyoutModal.on("click", "a", self._setSelection);
    },


    _setSelection: function (ev) {
      ev.preventDefault();

      var $target = $(ev.currentTarget),
        catName = $target.text(),
        catId = $target.data("cat-id");

      this._updateToggle(catName, catId);
      this.$flyout.flyout("hide");
    },

    _updateToggle: function (catName, catId) {
      this.$flyoutToggle
        .attr("data-cat-id", catId)
        .attr("data-cat-name", catName)
        .text(catName);

      ellipsify.init(this.$flyoutToggle, 15, " ...");
    }
  };

  return HeaderDropdown;
});
