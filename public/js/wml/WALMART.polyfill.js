/* =============================================================
 * @ WALMART.polyfill.js  v1.0
 * =============================================================
 * Copyright 2013 @WalmartLabs
 *
 * Date: 6/20/2013
 * Author: Yi Cao
 *
 * Dependency: modernizr, yepnope?, jQuery.browser?
 * Usage
 *
 * TODO:
 *
 * ============================================================== */
var WALMART = window.WALMART || {};

(function (Modernizr, window, document, undefined) {
    'use strict';

    //event namespace click/touch
    var dicTransitionEnd = {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition':    'transitionend',
        'OTransition':      'oTransitionEnd',
        'msTransition':     'MSTransitionEnd',
        'transition':       'transitionend'
    };

    WALMART.event = {
        'click':         Modernizr.touch ? 'tap' : 'click',
        'swipeleft':     'dragleft',
        'swiperight':    'dragright',
        'transitionEnd': dicTransitionEnd[Modernizr.prefixed('transition')]
    };

    //Todo: transit2(el, class, callback)


}(Modernizr, window, document));



