(function ($, window, document, undefined) {
    $(function () {

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
                var category_id = WALMART.util.getParameterByName('category_id') || '3944',
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


                //bbb
                /*@L: pda mvc io
                 * module preview: change body
                 * renaming bb model,view
                 * left_nav model: subview for modules
                 * rename view .hbs html
                 * */
                var $element = $('#category_modules');
                window.WALMART = window.WALMART || {};

                WALMART.CategoryPage = {};
                WALMART.CategoryPage.Model = Backbone.Model.extend({
                    urlRoot:url,
                    initialize: function () {
//                        this.on('change:title', function(){});
                    }
                });

                WALMART.CategoryPage.View = Backbone.View.extend({
                    template: 'tpl/cat_modules.hbs',
                    initialize: function () {
                        //@ dom cache
                        //@ ui init/template
                        $('body').spinner();
//                        $element.spinner();

                        //@ data: binding, fetch
                        this.listenTo(this.model, 'change', this.render);
//                        this.model.bind('change:title', this.changeTitle);
                        this.model.fetch({
                            'type': IS_LOCAL_TEST? 'GET':'POST',
                            data:{},
                            success: function () {
//                                $element.spinner('stop');
                                $('body').spinner('stop');
                            }
                        });
                    },
                    render: function () {
                        //assign template with data
                        var self = this;

                        Handlebars.Templates.load(this.template, function () {
                            if(self.model.get('modules').length){
                                $.each(self.model.get('modules'), function (index, module) {
                                    self.$el.wmlCatModule({
                                        type:         module.type,
                                        templateType: module.template,
                                        dataSource:   module
                                    });
                                });
                            }
                        });
                        return this;
                    }
                });

                var view = new WALMART.CategoryPage.View({
                    el: $element,
                    model: new WALMART.CategoryPage.Model() 
                });
            }
        });
    });
}(jQuery, window, document));