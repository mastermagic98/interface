(function () {
    'use strict';

    Lampa.Lang.add({
        maxsm_themes_bigbuttons: {
            ru: 'Большие кнопки в карточке',
            en: 'Large buttons in card',
            uk: 'Великі кнопки в картці'
        }
    });

    function bigbuttons() {
        var bigbuttons = Lampa.Storage.get('maxsm_themes_bigbuttons', 'false') === 'true';
        $('#accent_color_bigbuttons').remove();
        if (bigbuttons) {
            var bigbuttons_style = '<style id="accent_color_bigbuttons">' +
                '.full-start-new__buttons .full-start__button:not(.focus) span { display: inline; }' +
                '@media screen and (max-width: 580px) { .full-start-new__buttons { overflow: auto; } .full-start-new__buttons .full-start__button:not(.focus) span { display: none; } }' +
                '</style>';
            $('body').append(bigbuttons_style);
        }
    }

    function initBigButtons() {
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'maxsm_themes_bigbuttons',
                type: 'trigger',
                default: false
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_bigbuttons'),
                description: ''
            },
            onChange: function () {
                bigbuttons();
            }
        });
        bigbuttons();
    }

    if (window.appready) {
        initBigButtons();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initBigButtons();
            }
        });
    }
})();
