var WALMART = window.WALMART || {};

(function ( $, window, document, undefined) {
    'use strict';

    //Unify ECMA5
    if(!String.prototype.trim) { // IE9+
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g,'');
        };
    }

    /*TODO:
    * namespace creator
    * extract html table/ul to json
    * */
    WALMART.util = {
        //url
        getParameterByName: function (name) {
            name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp(regexS);
            var results = regex.exec(window.location.search);
            if(results == null){
                return "";
            } else{
                return decodeURIComponent(results[1].replace(/\+/g, " "));
            }
        },

        //string
        truncate: function(str, len, suffix){ //var str = truncateStr($this.text(), 12, '..');
            if(typeof suffix === 'undefined'){
                suffix = '';
            }
            if(str.length > len){
                str = str.substr(0, len);
                str = str.trim() + suffix;
            }
            return str;
        },

        //number
        isNumber: function (num) {
            return !isNaN(parseFloat(num)) && isFinite(num);
        },
        toFixed: function (num, fixed) { //4.003 => 4.00 case
            fixed = fixed || 0;
            fixed = Math.pow(10, fixed);
            return (Math.floor(num * fixed) /fixed).toFixed(2);
        },
        getRandomNumber: function (from, to, decimal) {
            /*TODO:
            * add caching check to avoid repeated random
            * optimze code to min
            * */
            var power = 1,
                result;
            if(decimal && decimal>0){
                decimal = Math.ceil(decimal); //0.5
                power = Math.pow(10, decimal); //10
                from *= power;
                to *= power;
            }
            result = ((Math.floor(Math.random() * (to-from+1)) + from)/power);
            result = decimal ? result.toFixed(decimal): result;
            return result;
        },

        //date
        getTimestamp: function (time) {
            if(time && time.getTime){
                return time.getTime();
            }
            return new Date().getTime();
        },
        getTimeDiff: function(oldTime, latestTime, format){ //date or timestamp
            var _timediff = 0,
                _oDate = {};
            if(oldTime && latestTime ){ //if Date() obj -> getTime
                if(oldTime.getTime){
                    oldTime = oldTime.getTime();
                }
                if(latestTime.getTime){
                    latestTime = latestTime.getTime();
                }
                _timediff =  latestTime - oldTime;
            }
            _oDate.day = Math.floor(_timediff/1000/60/60/24);
            _timediff -= _oDate.day*1000*60*60*24;
            _oDate.hour = Math.floor(_timediff/1000/60/60);
            _timediff -= _oDate.hour*1000*60*60;
            _oDate.minute = Math.floor(_timediff/1000/60);
            _timediff -= _oDate.minute*1000*60;
            _oDate.second = Math.floor(_timediff/1000);

            switch(format){ //none, second, minute, hour, day
                case 'day':
                    return _oDate.day;
                case 'hour':
                    return _oDate.hour;
                case 'minute':
                    return _oDate.minute;
                case 'second':
                    return _oDate.second;
                default:
                    return _oDate; //obj
            }
        }
    };

}(jQuery, window, document));
