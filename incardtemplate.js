(function () {
    'use strict';

    function main() {
        // --- Переклади ---
        Lampa.Lang.add({
            showbutton_desc: {
                ru: "Показывает большие кнопки действий в карточке",
                en: "Show large action buttons in card",
                uk: "Показує великі кнопки дій у картці"
            },
            showbuttonwn_desc: {
                ru: "Оставить только иконки",
                en: "Keep only icons",
                uk: "Залишити тільки іконки"
            },
            showhidden_desc: {
                ru: "Показывает кнопки, которые скрыты под кнопкой Смотреть",
                en: "Show buttons hidden under 'Watch'",
                uk: "Показувати кнопки, які ховаються під кнопкою 'Дивитись'"
            },
            showbutton_title: {
                ru: "Показывать большие кнопки",
                en: "Show large buttons",
                uk: "Показувати великі кнопки"
            },
            showhidden_title: {
                ru: "Показывать скрытые кнопки",
                en: "Show hidden buttons",
                uk: "Показувати приховані кнопки"
            }
        });

        var style_id = 'buttons-style';

        function applyButtonMode() {
            var showBig = Lampa.Storage.get('showbutton', false);
            var onlyIcons = Lampa.Storage.get('showbuttonwn', false);
            var showHidden = Lampa.Storage.get('showhidden', false);

            var style = document.getElementById(style_id);
            if (!style) {
                style = document.createElement('style');
                style.id = style_id;
                document.head.appendChild(style);
            }

            var css = '';

            // 1️⃣ Великі кнопки (якщо вкл.)
            if (showBig) {
                css += '.full-start__button, .full-start-new__button { display: flex !important; visibility: visible !important; opacity: 1 !important; }';
                css += '.full-start__button.hide, .full-start-new__button.hide { display: flex !important; }';
            } else {
                css += '.full-start__button, .full-start-new__button { display: none !important; }';
                css += '.full-start__button.button--play, .full-start-new__button.button--play { display: flex !important; }';
            }

            // 2️⃣ Тільки іконки
            if (onlyIcons) {
                css += '.full-start__button span, .full-start-new__button span { display: none !important; }';
            } else {
                css += '.full-start__button span, .full-start-new__button span { display: inline-block !important; }';
            }

            // 3️⃣ Показати приховані під "Дивитись"
            if (showHidden) {
                css += '.full-start__buttons .hide, .full-start-new__buttons .hide { display: flex !important; visibility: visible !important; opacity: 1 !important; }';
            }

            style.innerHTML = css;
        }

        // --- Додаємо параметри до accent_color_plugin ---
        function addSettings() {
            if (!Lampa.SettingsApi || !Lampa.SettingsApi.addParam) {
                setTimeout(addSettings, 500);
                return;
            }

            // 1️⃣ Показувати великі кнопки
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'showbutton',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('showbutton_title'),
                    description: Lampa.Lang.translate('showbutton_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('showbutton', value);
                    applyButtonMode();
                }
            });

            // 2️⃣ Залишити тільки іконки
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'showbuttonwn',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('showbuttonwn_desc'),
                    description: Lampa.Lang.translate('showbuttonwn_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('showbuttonwn', value);
                    applyButtonMode();
                }
            });

            // 3️⃣ Показувати приховані кнопки з “Дивитись”
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'showhidden',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('showhidden_title'),
                    description: Lampa.Lang.translate('showhidden_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('showhidden', value);
                    applyButtonMode();
                }
            });
        }

        // --- Рендер картки ---
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'render') {
                setTimeout(applyButtonMode, 100);
                setTimeout(applyButtonMode, 500);
                setTimeout(applyButtonMode, 1000);
            }
        });

        // --- Ініціалізація ---
        function init() {
            addSettings();
            applyButtonMode();
        }

        if (window.appready) init();
        else Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }

    main();
})();
