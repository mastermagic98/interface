(function () {
    'use strict';

    Lampa.Lang.add({
        maxsm_themes_translate_tv: {
            ru: 'Переводить TV',
            en: 'Translate TV',
            uk: 'Перекладати TV'
        },
        maxsm_themes_tvcaption: {
            ru: 'СЕРИАЛ',
            en: 'SERIES',
            uk: 'СЕРІАЛ'
        }
    });

    function translate_tv() {
        var tv_caption = Lampa.Lang.translate('maxsm_themes_tvcaption');
        var translate_tv = Lampa.Storage.get('maxsm_themes_translate_tv', 'true') === 'true';
        $('#accent_color_translate_tv').remove();
        var translate_tv_style;
        if (!translate_tv) {
            translate_tv_style = '<style id="accent_color_translate_tv">' +
                '.card__type { position: absolute; bottom: auto; left: 0em; right: auto; top: 0em; background: rgba(0, 0, 0, 0.6); color: #fff; font-weight: 700; padding: 0.4em 0.6em; -webkit-border-radius: 0.4em 0 0.4em 0; -moz-border-radius: 0.4em 0 0.4em 0; border-radius: 0.4em 0 0.4em 0; line-height: 1.0; font-size: 1.0em; }' +
                '.card--tv .card__type { color: #fff; }' +
                '</style>';
        } else {
            translate_tv_style = '<style id="accent_color_translate_tv">' +
                '.card--tv .card__type, .card__type { font-size: 1em; background: transparent; color: transparent; left: 0; top: 0; }' +
                '.card__type::after { content: "' + tv_caption + '"; color: #fff; position: absolute; left: 0; top: 0; padding: 0.4em 0.6em; border-radius: 0.4em 0 0.4em 0; font-weight: 700; }' +
                '</style>';
        }
        $('body').append(translate_tv_style);
    }

    function initTranslateTv() {
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'maxsm_themes_translate_tv',
                type: 'trigger',
                default: true
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_translate_tv'),
                description: ''
            },
            onChange: function () {
                translate_tv();
            }
        });
        translate_tv();
    }

    if (window.appready) {
        initTranslateTv();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initTranslateTv();
            }
        });
    }
})();
