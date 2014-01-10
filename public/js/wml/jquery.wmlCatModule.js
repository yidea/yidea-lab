/* =============================================================
 * @ wmlCatModule.js  v1.0
 * =============================================================
 * Copyright 2013 @WalmartLabs
 *
 * Date: 6/17/2013
 * Author: Yi Cao ycao@walmartlabs.com
 * Dependency: jquery.js, modernizr.js, handlebars.js, jquery. hammer.js

 * TODO:
 * snap vs. scrollwheel naming
 * isIpad UA sniff
 * modernizr load refactor, $.support.events, hammer depency
 * integrate WALMART namespace and setup sass compass
 * backbone mvc intergrate, Walmartlab namespace handle
 * swipe gesture enhance native
 * lazy load img, img resize to exact
 * handlebar localstorage - basket.js
 * tab amz
 * word strip ..
 * return this & custom event trigger
 * touchstart tap ev.click (tap), fastbutton, unify touch&mouse event
 * handler no data situation
 * unify name convention + comment jsdoc
 * slider auto cycle
 * review num, shipping choice
 * item hover box-shadow effect?
 * js unit tests
 * ============================================================== */

;(function ($, Handlebars, window, document, undefined) {
    'use strict';

    var pluginName = 'wmlCatModule',
        defaults = {
            dataSource: {},
            template: {
                'carousel': 'hbs_wml_cat_carousel',
                'grid': 'hbs_wml_cat_grid',
                'pov': 'hbs_wml_cat_pov'
            },
            type: '',
            isCarouselInfinite: false,
            isCycle: false //todo
        };

    var Plugin = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, defaults, options) ;
        this._defaults = defaults;
        this._name = pluginName;

        this.template = {};
        this.currentPage = 0;
        this.isTouch = Modernizr.touch;
        this.isSliding = false;

        switch(this.options.templateType){
            case 'carousel':
                this.type = 'carousel';
                this.itemPerPage = 4;
                this.pageCount = Math.ceil(this.options.dataSource.items.length/this.itemPerPage);
                break;
            case 'grid':
                this.type = 'grid';
                this.itemPerPage = 8;
                this.pageCount = Math.ceil(this.options.dataSource.items.length/this.itemPerPage);
                break;
            default:
                this.type = 'pov';
        }

        this.init();
    };

    Plugin.prototype = {
        constructor:Plugin,
        init: function() {
            if(this.type){
                this.template = Handlebars.Templates.get(this.options.template[this.type]);
                this.render(this.type);
                this.bindEvents(this.type);
            }
        },
        render: function(type) {
            this.$element.append(this.template(this.options.dataSource));

            switch (type){
                case 'carousel':
                    this.renderCarousel();
                    break;
                case 'grid':
                    this.renderGrid();
                    break;
//                case 'pov':
            }
        },
        renderGrid: function () {
            this.$grids = this.$element.find('.slide');
            this.$indicators = this.$element.find('.wml-cat-indicator').find('a');
            //init ui
            this.$grids.first().addClass('active');
            this.$indicators.first().addClass('active');
        },
        renderCarousel: function () {
            this.scrollX = 0;

            this.$grids = this.$element.find('.slide');
            this.nGrids = this.$grids.length;
            this.$slideWrap = this.$element.find('.slide-wrap');
            this.wVpt = this.$element.find('.vpt').width();
            this.wSlide = this.$grids.first().width();
            this.wSlidesTotal = this.$grids.length * this.wSlide;

            this.$grids.first().addClass('active');
            this.$slideWrap.css({width: this.wSlidesTotal});

            this.$pagination = this.$element.find('.wml-cat-pagination');
            this.$pagination.html('');
//            if(this.isTouch){
//                this.$pagination.html('');
//            } else {
//                this.setPaginationUI(true);
//            }
        },
        bindEvents: function (type) {
            switch (type){
                case 'carousel':
                    this.bindEventsCarousel();
                    break;
                case 'grid':
                    this.bindEventsGrid();
                    break;
            }

            if(this.isTouch && window.Hammer){
                this.$element = this.$element.hammer({
                    drag_lock_to_axis: true
//                    drag_block_vertical: true
//                    swipe_velocity:this.events.swipeVelocity, //for swipe

                });
            }
        },
        bindEventsGrid: function () {
            var self = this;
            this.$element.on(WALMART.event.click, '.wml-cat-indicator a', function (e) {
                self.slideTo(parseInt($(this).attr('rel'),10), 'grid', e);
            });
            if(this.isTouch){
                this.$element.on(WALMART.event.swipeleft, '.slide', $.proxy(this.slideTo, this, 'next', 'grid'));
                this.$element.on(WALMART.event.swiperight, '.slide', $.proxy(this.slideTo, this, 'prev', 'grid'));
            }
        },
        bindEventsCarousel: function () {
            var self = this;
            this.wVpt;
            this.wSliderTotal = this.$slideWrap.width();
            this.maxScrollX = this.wVpt - this.wSliderTotal;

            function _momentum(dist, time, maxDistUpper, maxDistLower) {
                var friction = 2.5,
                    deceleration = 1.2,
                    speed = Math.abs(dist) / time * 1000,
                    newDist = speed * speed / friction / 1000,
                    newTime = 0;

                if (dist > 0 && newDist > maxDistUpper) {
                    speed = speed * maxDistUpper / newDist / friction;
                    newDist = maxDistUpper;
                } else if (dist < 0 && newDist > maxDistLower) {
                    speed = speed * maxDistLower / newDist / friction;
                    newDist = maxDistLower;
                }
                newDist = newDist * (dist < 0 ? -1 : 1);
                newTime = speed / deceleration;
                return {dist: Math.round(newDist),time: Math.round(newTime)};
            }
            function _momentum2(current, start, time, lowerMargin, wrapperSize) {
                var distance = current - start,
                    speed = Math.abs(distance) / time,
                    destination,
                    duration,
                    deceleration = 0.0006;

                destination = current + ( speed * speed ) / ( 2 * deceleration ) * ( distance < 0 ? -1 : 1 );
                duration = speed / deceleration;

                if ( destination < lowerMargin ) {
                    destination = wrapperSize ? lowerMargin - ( wrapperSize / 2.5 * ( speed / 8 ) ) : lowerMargin;
                    distance = Math.abs(destination - current);
                    duration = distance / speed;
                } else if ( destination > 0 ) {
                    destination = wrapperSize ? wrapperSize / 2.5 * ( speed / 8 ) : 0;
                    distance = Math.abs(current) + destination;
                    duration = distance / speed;
                }

                return {
                    destination: Math.round(destination),
                    duration: duration
                };
            }

            function _setPos(x, y) {
                //hr
                if(x>0){ x=0;}
                if(x<self.maxScrollX){ x=self.maxScrollX;}

                var cssTransform = {},
                    transform = Modernizr.prefixed('transform');
                if(Math.abs(x) > 10){  //5?
                    if(transform){
                        cssTransform[transform] = 'translate3d(' + x +'px, 0, 0)';
                    }
                    self.$slideWrap.css(cssTransform);
                }
            }

            if(this.isTouch){

                this.$element.find('.vpt').addClass('native-scroll').css({'overflow-x': 'scroll'});


//                this.$element.on('dragstart', function(e){
//                    e.preventDefault();
//                    e.stopPropagation();
//                    e.gesture.preventDefault();
//                    var cssTransform = {},
//                        transform = Modernizr.prefixed('transform');
//                    if(transform){
//                        cssTransform[Modernizr.prefixed('transition')] = '0ms';
//                    }
//                    self.$slideWrap.css(cssTransform);
//                    self.scrolling = true;
//                    self.scrollStartX = e.gesture.x;
//                });
//
//                this.$element.on('drag', function(e){
//                    if(!self.scrolling){return;}
//                    e.preventDefault(); //stop V scroll?
//                    e.stopPropagation();
//                    e.gesture.preventDefault();
//                    var newX = self.scrollX + e.gesture.deltaX;
//                    _setPos(newX, 0);
//                    console.log('touchmove', e.gesture.deltaX, newX, e); //TODO:debug
//                });
//
//                this.$element.on('dragend', function (e) {
//                    if(!self.scrolling){return;}
//                    e.preventDefault();
//                    e.stopPropagation();
//                    e.gesture.preventDefault();
//                    self.scrolling = false;
//
//                    if(e.gesture.deltaTime < 300){
//                        console.log('momentum'); //TODO:debug
//                        var momentumX = _momentum(e.gesture.deltaX, e.gesture.deltaTime, self.wVpt/5-self.scrollX, self.wVpt/5+ self.scrollX + self.wSlidesTotal);
//                        var newPositionX = self.scrollX + (-momentumX.dist);
//                        var newDuration = Math.max(momentumX.time, 1);
//
//                        var cssTransform = {},
//                            transform = Modernizr.prefixed('transform');
//                        if(transform){
//                            cssTransform[transform] = 'translate3d(' + newPositionX +'px, 0, 0)';
//                            cssTransform[Modernizr.prefixed('transition')] = newDuration +'ms';
//                        }
//                        self.$slideWrap.css(cssTransform);
//                        self.scrollX = newPositionX;
//                    } else {
//                        self.scrollX += e.gesture.deltaX;
//                    }
//                    console.log('touchend', self.scrollX, e.gesture); //TODO:debug
//                });

            } else {
                this.$element.on(WALMART.event.click, '.arr-next', $.proxy(this.slideTo, this, 'next', 'carousel'));
                this.$element.on(WALMART.event.click, '.arr-previous', $.proxy(this.slideTo, this, 'prev', 'carousel'));
            }
        },

        slideTo: function (mode, type, e) {
            
//            console.log(e.gesture.direction, e.gesture); //TODO:debug
            
            e.preventDefault();
            if(this.isTouch){ //swipe
                e.gesture.stopDetect();
                e.gesture.preventDefault();
                e.gesture.stopPropagation();
            }

            var self = this,
                $active = this.$grids.filter('.active'),
                activeIndex = parseInt($active.attr('rel'), 10),
                $target,
                targetIndex,
                dir,
                fallback;

            if(mode === 'prev' || mode === 'next'){ //slide 'prev'
                $target =  $active[mode]();
                fallback = mode === 'next' ? 'first' : 'last';
                $target = $target.length ? $target : this.$grids[fallback]();
                targetIndex = parseInt($target.attr('rel'),10);
            } else { //click #
                targetIndex = mode;
                $target = this.$grids.eq(targetIndex);
                mode = targetIndex>activeIndex ? 'next': 'prev';
            }
            dir = mode === 'next' ? 'left' : 'right';

            if(type === 'carousel'){
                /*@L: pda mvc io
                 * use translate3d
                 * solve slide to end issue
                  * */
                if(!this.options.isCarouselInfinite){
                    if((activeIndex === 0 && targetIndex === this.nGrids-1) || (activeIndex === this.nGrids-1) && targetIndex ===0){return;}
                }

                this.currentPage = targetIndex;
                var leftValue =  targetIndex * this.wVpt * (-1),
                    cssTransform = {},
                    tranform = Modernizr.prefixed('transform');
                
                if(tranform){
                    cssTransform[tranform] = 'translateX(' + leftValue +'px)';
                    cssTransform[Modernizr.prefixed('transition')] = '400ms';
                }else{
                    cssTransform['left'] =  leftValue +'px';
                }

                this.$slideWrap.css(cssTransform);
                $active.removeClass('active');
                $target.addClass('active');
                this.setPaginationUI();

            } else if(type === 'grid'){
                if(this.isSliding){ return;}
                this.isSliding = true;
                this.currentPage = targetIndex;

                if(targetIndex !== activeIndex){
                    if(Modernizr.csstransitions){
                        $target.addClass(mode);
                        $target[0].offsetWidth; //reflow
                        $active.addClass(dir);
                        $target.addClass(dir);
                        this.$grids.one(WALMART.event.transitionEnd, function () {
                            $target.removeClass([dir, mode].join(' ')).addClass('active');
                            $active.removeClass(['active', dir].join(' '));
                            self.isSliding = false;
                        });
                    } else { //fb
                        $active.removeClass('active');
                        $target.addClass('active');
                        this.isSliding = false;
                    }
                    this.$indicators.removeClass('active');
                    this.$indicators.filter('[rel='+ targetIndex +']').addClass('active');
                }
            }
        },

        setPaginationUI: function (isFirstLoad) {
            if(this.$pagination.length){
                if(isFirstLoad){
                    this.$pagination.find('.page-total').html(this.pageCount);
                }
                this.$pagination.find('.page-current').html(this.currentPage+1);
            }
        }
    };


    $.fn[pluginName] = function (options) {
        return this.each(function () {
            var _type = options.templateType || 'pov';
            var $widget = $('<div></div>', {
                'class': 'wml-cat wml-cat-' + _type,
                'id': 'wmlcat_' +  options.dataSource.id
            });
            $(this).append($widget);

            if(!$widget.data('plugin_' + pluginName)){
                $widget.data('plugin_' + pluginName, new Plugin($widget, options));
            }
        });
    };

    $.fn[pluginName].Constructor = Plugin;

})(jQuery, Handlebars, window, document);