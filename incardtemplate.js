(function () {
    'use strict';

    function main() {
        // --- Мовні переклади ---
        Lampa.Lang.add({
            show_big_buttons_desc: {
                ru: "Отображает все крупные кнопки в карточке",
                en: "Show all large buttons in card",
                uk: "Показує всі великі кнопки у картці"
            },
            show_hidden_buttons_desc: {
                ru: "Показывает кнопки, скрытые под «Смотреть»",
                en: "Show buttons hidden under 'Watch'",
                uk: "Показує кнопки, приховані під «Дивитись»"
            },
            icons_only_desc: {
                ru: "Оставить только иконки без текста",
                en: "Keep only icons, hide text",
                uk: "Залишити тільки іконки без тексту"
            },
            show_text_hover_desc: {
                ru: "Показывать текст кнопок при наведении",
                en: "Show button text on hover",
                uk: "Показувати текст на кнопках при наведенні"
            }
        });

        // --- Параметри ---
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'show_big_buttons',
                type: 'trigger',
                'default': false
            },
            field: {
                name: 'Показувати великі кнопки',
                description: Lampa.Lang.translate('show_big_buttons_desc')
            },
            onChange: function (value) {
                Lampa.Storage.set('show_big_buttons', value);
                applySettings();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'show_hidden_buttons',
                type: 'trigger',
                'default': false
            },
            field: {
                name: 'Не приховувати кнопки',
                description: Lampa.Lang.translate('show_hidden_buttons_desc')
            },
            onChange: function (value) {
                Lampa.Storage.set('show_hidden_buttons', value);
                applySettings();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'icons_only',
                type: 'trigger',
                'default': false
            },
            field: {
                name: 'Залишити тільки іконки',
                description: Lampa.Lang.translate('icons_only_desc')
            },
            onChange: function (value) {
                Lampa.Storage.set('icons_only', value);
                applySettings();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'show_text_hover',
                type: 'trigger',
                'default': true
            },
            field: {
                name: 'Показувати текст на кнопках при наведенні',
                description: Lampa.Lang.translate('show_text_hover_desc')
            },
            onChange: function (value) {
                Lampa.Storage.set('show_text_hover', value);
                applySettings();
            }
        });

        // --- Застосування налаштувань ---
        function applySettings() {
            var showBig = Lampa.Storage.get('show_big_buttons');
            var showHidden = Lampa.Storage.get('show_hidden_buttons');
            var iconsOnly = Lampa.Storage.get('icons_only');
            var hoverText = Lampa.Storage.get('show_text_hover');

            $('.full-start__button').each(function () {
                var btn = $(this);

                if (showBig) btn.addClass('big');
                else btn.removeClass('big');

                if (iconsOnly) btn.find('span').hide();
                else btn.find('span').show();

                if (!hoverText) btn.addClass('always-text');
                else btn.removeClass('always-text');
            });

            if (showHidden) {
                var moreBtn = $('.button--more');
                if (moreBtn.length) moreBtn.trigger('hover:enter');
            }
        }

        // --- Слухач для оновлення після відкриття картки ---
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                setTimeout(applySettings, 200);
            }
        });

        // --- CSS для тексту на кнопках ---
        var style = document.createElement('style');
        style.textContent = `
            .full-start__button.always-text span { display: inline !important; }
            .full-start__button:not(.always-text) span { opacity: 0; transition: opacity 0.2s; }
            .full-start__button:not(.always-text):hover span,
            .full-start__button:not(.always-text):focus span { opacity: 1; }
        `;
        document.head.appendChild(style);
    }

    main();
})();
