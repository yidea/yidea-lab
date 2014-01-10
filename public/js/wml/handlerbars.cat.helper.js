(function ($, Handlebars, window, document, undefined) {
    'use strict';

    //Templates load
    Handlebars.Templates = {
        type: 'text/x-handlebars-template',
        cache: {},
        load:  function (url, callback) {
            //todo: load .hbs url, compile and push into cache, localstorage?
            var jqxhr = $.ajax({
                url:   url,
                type:  'GET',
                cache: true
            }).done(function (html) {
                    $(html).filter('script[type="'+ Handlebars.Templates.type+'"]').each(function () {
                        Handlebars.Templates.cache[this.id] = Handlebars.compile($(this).html());
                    });
                    if(callback){callback();}
                });
        },
        get: function (id) { //todo with #test or not
            //check if in cache, otherwize search in dom
            var template = null;
            if(this.cache[id]){
                template = this.cache[id];
            } else{
                var $tpl = $('#'+id);
                if($tpl.length){
                    template = Handlebars.compile($tpl.html());
                    this.cache[id] = template;
                }
            }
            return template;
        }
    };

    //@ util
    //{{toFixedNum properties.num_reviews 0}}
    Handlebars.registerHelper('toFixedNum', function(num, digit) {
        num = parseFloat(num);
        digit = digit || 0;
        return num.toFixed(digit);
    });

    //{{#ifequal this.data_structure 'items'}} {{else}} {{/ifequal}}
    Handlebars.registerHelper('ifequal', function(a, b, opts) {
        if(a === b){
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });

    //{{getAttrOfFristArray images 'url'}}
    Handlebars.registerHelper('getAttrOfFristArray', function (context, attr) {
        return context[0][attr];
    });

    //{{#every this.items num='8' ds='groups'}}{{/every}}
    Handlebars.registerHelper('every', function (context, block) {
        var num = parseInt(block.hash.num, 10),
            ds = block.hash.ds,
            ret = '',
            items = this.items,
            classname = 'item';
        var i = 0, len = items.length;
        if(ds && ds==='groups'){
            classname += ' itemgp';
        }
        for(i=0; i<len; i++){
            if(i % num === 0){
                ret += '<div class="slide clearfix" rel="'+ i/num +'">';
            }
            ret += '<div class="'+ classname+' f-l d-b">'+ block.fn(context[i]) +'</div>';
            if(i % num === num -1){
                ret += '</div>';
            }
        }
        return ret;
    });

    //@ Custom
    Handlebars.registerHelper('generateIndicator', function (num) {
        var _len;
        if (num) {
            _len = Math.ceil(this.items.length / num);
        }
        var _s = '', _i = 0;
        for (_i = 0; _i < _len; _i++) {
            _s += '<a rel="' + _i + '"></a>';
        }
        return new Handlebars.SafeString(_s);
    });

    Handlebars.registerHelper('getItemRating', function (rate) {
        var _total = 5;
        return (rate / _total * 100).toFixed(1) + '%';
    });

    Handlebars.registerHelper('getItemPrice', function (prices, type) {
        var ret = '',
            currency = 'USD', //fixed for now currency = prices.base.currency
            base = prices.base ? parseFloat(prices.base.amount).toFixed(2): -1,
            current = parseFloat(prices.current.amount).toFixed(2);
        currency = currency === 'USD' ? '$' : currency;

        if(type === 'compare'){
            if(base !== -1){
                if(current < base){
                    ret += '<span class="item-price-base">' + currency + base + '</span> ';
                }
            }
            ret += '<span class="item-price-cur">' + currency + current + '</span>';
        } else if (type ==='single'){
            current = current.split('.');
            ret += '<span class="item-price-single">' + currency + current[0] +'.' + '<sup>'+ current[1]+'</sup>' +'</span>';
        }

        return new Handlebars.SafeString(ret);
    });

}(jQuery, Handlebars, window, document));