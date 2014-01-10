(function() { // Avoid `console` errors in browsers that lack a console.
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());



var YI = window.WALMART || {};

YI.UTIL = {

};


// YC.UI Helper
YI.UI = {
    TippedPopup: function ($el, $content, options) { //tippedPopup($el, content, options)
        options = {
//            inline:true,
            containment: false,
            skin:'cloud',
            background: '#fff',
            radius:0,
            shadow:{blur:2,offset: { x: 0, y: 1 }},
//            stem:false,
            closeButton:true,
//            width:400,
            hook:'topmiddle',
            offset:{x:0, y:7},
//            border:{size:1,color:'#ccc'},
            showOn:'click',
            hideOn:[{element:'self',event:'click'}],
            hideOthers: true
//            hideOnClickOutside:true
//            onShow: function(content, element) {
////                $(element).addClass("open");
//            },
//            onHide: function(content, element) {
////                $(element).removeClass("open");
//            }
        };
        if(!($el instanceof jQuery)){
            $el = $($el);
        }
        if(!($content instanceof jQuery)){
            $content = $($content);
        }

        $el.each(function () {
            Tipped.create(this, $content[0], options);
        });
    }
};

(function ( $, window, document, undefined ) {
    'use strict';
    function SpriteAnimation(element, options){
        /*-------------------------------------------------------------------------
         @ PDA
         P: sprite animate based on a give image sprite (vertical/horizontal), no depend on css
         D: linear
         A: setInternal recursive
         -------------------------------------------------------------------------*/
        this.settings = {
            width: 32,
            height: 32,
            frames: 5,
            spriteUrl: '',
            direction: 'v', //vertical , h-horizontal
            interval:100,
            infinite: true,
            fnStop:$.noop
        };
        this.settings = $.extend(this.settings, options);
        this.$accessControl = $(element);
        this.intervalID = 0;
        this.init();
    }
    SpriteAnimation.prototype = {
        constructor: SpriteAnimation,
        init: function() { //setup element
            this.render();
            this.startAnimate();
        },
        render: function () { //render css
            this.$accessControl.css({
                'width': 32,
                'height': 32,
                'background-image': 'url('+ this.settings.spriteUrl + ')',
                'background-repeat': 'no-repeat',
                'background-position': '0px 32px'
            });
        },
        startAnimate: function () {
            var self = this;
            var i = 0,
                s = this.settings,
                height = this.settings.height,
                frames = this.settings.frames,
                bgOffset = 0,
                backgroundPosition = '';

            this.intervalID = setInterval(function () {
                if(i >= frames){
                    i = 0;
                    if(!s.infinite){
                        self.stopAnimate();
                    }
                } else{
                    bgOffset = i * height;
                    if(s.direction === 'v'){
                        backgroundPosition = '0px -' + bgOffset +'px';
                    }else{
                        backgroundPosition = '-' + bgOffset +'px 0px';
                    }
                    self.$el.css({
                        'background-position': backgroundPosition
                    });
                }
                i++;
            }, this.settings.interval);
        },
        stopAnimate: function () {
            clearInterval(this.intervalID);
            this.settings.fnStop();
        }
    };

    window.WALMART.UI.SpriteAnimation = SpriteAnimation;

}(jQuery, window, document));



/*-------------------------------------------------------------------------
 @ jQ plugin: Autocomplete input
 https://github.com/twitter/typeahead.js
 -------------------------------------------------------------------------*/
(function ($, window, document) {
    'use strict';

    //plugin constructor & prototype
    var pluginName = 'yi_autocomplete';
    function Plugin(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, $.fn[pluginName].defaults, options);
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            this.bindEvents();
        },
        bindEvents: function () {
            this.$element.on('keyup', $.proxy(this.eKeyup, this));
         },
        eKeyup: function (e) {
            /*@L: pda mvc io
             * input keyup:
             * if character
             * - getAjaxData(input.val(), url), showMenu
             if tab enter
             - select current item in Menu
             if up/down arrow
             - move highlight on item in menu
             if Esc
             * */

            e.preventDefault();
            e.stopPropagation();
            switch(e.keyCode){
                case 9: //tab
                case 13: //enter
                    break;
                case 27: //ESC
                    break;
                //up arrow 38 down arrow 40
                default :
                    this.lookup();
            }
        },
        lookup: function () {
            //pda json format -
            //a: if first time, get json file and  store in localstorage
            //a: based on current value, orgnize result and display the dropdown

            var value = $(event.target).val().toLowerCase().trim();
            var $dropdown = this.$element.next();
            if(value.length>0){
                if(!$dropdown.hasClass('dropdown-menu')){
                    $dropdown = $('<ul></ul>',{
                        class: 'dropdown-menu'
                    });
                    this.$element.after($dropdown);
                }
                if(!localStorage.getItem('json_countries')){
                    //first time get data + prep dropdown menu
                    $.getJSON(this.options.jsonUrl)
                        .done(function (data) {
                            localStorage.setItem('json_countries', JSON.stringify(data));
                        });
                }
                var arrCountries = JSON.parse(localStorage.getItem('json_countries'));
                var results = arrCountries.filter(function (item,index) {
                    return item.toLowerCase().indexOf(value)!== -1;
                });

                var $lis = $();
                $.each(results, function (index) {
                    var $li = $('<li>', {
                        text: results[index]
                    });
                    $lis = $lis.add($li);
                });
                if($lis.length){
                    $dropdown.html($lis).show();
                } else{
                    $dropdown.hide();
                }

            } else {
                if($dropdown.hasClass('dropdown-menu')){
                    $dropdown.hide();
                }
            }
        }
    };

    //jq hook
    $.fn[pluginName] = function (options) {
        return this.each(function () {
           var $this = $(this),
               data = $this.data(pluginName);
           if(!data){
               $this.data(pluginName, new Plugin(this, options));
           }
        });
    };
    $.fn[pluginName].defaults = {
        version: 0.1,
        jsonUrl: ''
    };
    $.fn[pluginName].Constructor = Plugin;

}(jQuery, window, document));