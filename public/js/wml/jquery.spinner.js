/* =============================================================
 * @ jquery.spinner.js  v1.0
 * =============================================================
 * Copyright 2013 @WalmartLabs
 *
 * Date: 6/17/2013
 * Author: Yi Cao ycao@walmartlabs.com
 * Dependency: jquery.js, spin.js
 * Usage:
 * $(el).spinner(); $(el).spinner('module') //start w preset
 * $(el).spinner({lines: 6, length: 9}); //start w self config
 * $(el).spinner('stop'); //stop & delete spinner from dom
 * TODO:
 * - more preset
 * - unit test
 * ============================================================== */


;(function ($, window, document, undefined) {
    'use strict';

    var pluginName = 'spinner',
        presetDefault = 'module';

    $.fn[pluginName] = function(options){
        return this.each(function () {
            var $this = $(this),
                spinner = $this.data('plugin_' + pluginName);

            if(!spinner){ //init
                options = options || presetDefault;
                if(typeof options !== 'object'){
                    options = $.fn[pluginName].presets[options] || $.fn[pluginName].presets[presetDefault];
                }
                $this.data('plugin_' + pluginName, new Spinner(options).spin(this));

            } else { //exist
                if(options === 'stop'){
                    spinner.stop();
                    $this.removeData('plugin_' + pluginName);
                }
            }
        });
    };

    $.fn[pluginName].presets = { //based on size? samll, medium, large
        'module': {
            lines: 6,
            length: 10,
            width: 6,
            radius: 10,
            rotate: 90,
            trail: 55,
            top: '300px',
            color: '#04369B'
        }
    };
}(jQuery, window, document));