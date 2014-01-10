(function ($, window, document, undefined) {
    $(function () {
        /*@L: pda mvc io
         * QA:
         * cat url
         * validate cat, manul_facet non data
         * */

        Modernizr.load({
            test:     Modernizr.touch,
            yep:      {
                'yepCb': 'js/components/hammerjs/dist/jquery.hammer.js'
            },
            complete: function () {
                var url;

                switch(PIPELINE){ //for test
                  case 'leftnav':
                      url = IS_LOCAL_TEST ? 'json/items_leftnav.json' : 'http://srch-dev01.sv.walmartlabs.com:9897/preso/category_page?response_group=large&category_id=';
                        break;
                  case 'dev':
                      url = IS_LOCAL_TEST ? 'json/items7.json' : 'http://srch-dev03.sv.walmartlabs.com:9999/preso/category_page?category_id=';
                      break;
                  case 'production':
                      url = IS_LOCAL_TEST ? 'json/items7.json' : 'http://srch-dev03.sv.walmartlabs.com:9999/preso/category_page?category_id=';
                      break;
                  default:
                }

                var $target = $('#category_modules'),
                    category_id = WALMART.util.getParameterByName('category_id') || '3944',
                    preview = WALMART.util.getParameterByName('preview'),
                    module_id = WALMART.util.getParameterByName('module_id');

                if(!IS_LOCAL_TEST){
                    url += category_id;
                    if (module_id) {
                        url += '&module_id=' + module_id;
                    }
                    if (preview && preview === 'on') {
                        url += '&preview=on';
                    }
                }

                var jqxhr = $.ajax({
                    type:       'GET',
                    cache:      false,
                    dataType:   'json',
                    url:        url,
                    beforeSend: function () {
                        $target.spinner();
                    },
                    error: function (err) {
                        $.log(err); //TODO:debug
                    }
                }).done(function (json) {
                        $target.spinner('stop');

                        Handlebars.Templates.load('tpl/cat_modules.hbs', function () {
                            //1 setup modules
                            if (json['modules'].length) {
                                $.each(json.modules, function (index, module) {
                                    $target.wmlCatModule({
                                        type:         module.type,
                                        templateType: module.template,
                                        dataSource:   module
                                    });
                                });

                            } else {
                                $target.html('Ooops, nothing found.');
                            }
                        });


                        //2 set left_nav update - wait for indian team
                        if (json['left_nav']) {
                            Handlebars.Templates.load('tpl/cat_facets.hbs', function () {

                                var $el = $('#left_nav'),
                                    tplFacets = Handlebars.Templates.get('hbs_cat_facet'),
                                    tplCats =  Handlebars.Templates.get('hbs_cat_cat'),
                                    dFacets = json['left_nav']['manual_facets'],
                                    dCats = json['left_nav']['categories'];

                                $el.append(tplCats(dCats));
                                $el.append(tplFacets(dFacets));

                                //todo: hammer to body? {prevent_default: true}
                                if (Modernizr.touch) {
                                    $el = $el.hammer();
                                }

                                $('.lnav-fac').on(WALMART.event.click, '.lnav-h', function (e) {
                                    e.preventDefault();
                                    if (Modernizr.touch) {
                                        e.gesture.preventDefault();
                                        e.gesture.stopDetect();
                                    }

                                    var $acHead = $(this), $acBody = $acHead.next('.collapse');
                                    if (!$acHead.hasClass('close')) {//close it
                                        $acBody.addClass('close');
                                        if (Modernizr.csstransitions) {
                                            $acBody.one(WALMART.event.transitionEnd, function (e) {
                                                $acHead.addClass('close');
                                            });
                                        } else {
                                            $acHead.addClass('close');
                                        }
                                    } else { //open
                                        $acBody.removeClass('close');
                                        if (Modernizr.csstransitions) {
                                            $acBody.one(WALMART.event.transitionEnd, function (e) {
                                                $acHead.removeClass('close');
                                            });
                                        } else {
                                            $acHead.removeClass('close');
                                        }
                                    }
                                });

                            });
                        }
                    });
            }
        });

    });
}(jQuery, window, document));