(function () {
    'use strict';

    function main() {
        // --- Переклади ---
        Lampa.Lang.add({
            lme_showbutton_desc: {
                ru: "Показывает большие кнопки действий в карточке",
                en: "Show large action buttons in card",
                uk: "Показує великі кнопки дій у картці"
            },
            lme_showbuttonwn_desc: {
                ru: "Оставить только иконки",
                en: "Keep only icons",
                uk: "Залишити тільки іконки"
            },
            lme_showhidden_desc: {
                ru: "Показывает кнопки, которые скрыты под кнопкой Смотреть",
                en: "Show buttons hidden under 'Watch'",
                uk: "Показувати кнопки, які ховаються під кнопкою 'Дивитись'"
            },
            lme_showbutton_title: {
                ru: "Показ больших кнопок",
                en: "Show large buttons",
                uk: "Показувати великі кнопки"
            },
            lme_showhidden_title: {
                ru: "Показ скрытых кнопок",
                en: "Show hidden buttons",
                uk: "Показувати приховані кнопки"
            }
        });

        var style_id = 'lme-buttons-style';

        function applyButtonMode() {
            var showBig = Lampa.Storage.get('lme_showbutton', false);
            var onlyIcons = Lampa.Storage.get('lme_showbuttonwn', false);
            var showHidden = Lampa.Storage.get('lme_showhidden', false);

            // Створюємо або оновлюємо <style>
            var style = document.getElementById(style_id);
            if (!style) {
                style = document.createElement('style');
                style.id = style_id;
                document.head.appendChild(style);
            }

            var css = '';

            // 1️⃣ Великі кнопки
            if (showBig) {
                css += '.full-start__button, .full-start-new__button { display: flex !important; visibility: visible !important; opacity: 1 !important; }';
                css += '.full-start__button.hide, .full-start-new__button.hide { display: flex !important; }';
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
                    name: 'lme_showbutton',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('lme_showbutton_title'),
                    description: Lampa.Lang.translate('lme_showbutton_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('lme_showbutton', value);
                    applyButtonMode();
                }
            });

            // 2️⃣ Залишити тільки іконки
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'lme_showbuttonwn',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('lme_showbuttonwn_desc'),
                    description: Lampa.Lang.translate('lme_showbuttonwn_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('lme_showbuttonwn', value);
                    applyButtonMode();
                }
            });

            // 3️⃣ Показувати кнопки з “Дивитись”
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'lme_showhidden',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('lme_showhidden_title'),
                    description: Lampa.Lang.translate('lme_showhidden_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('lme_showhidden', value);
                    applyButtonMode();
                }
            });
        }

        // --- Слухач рендеру картки ---
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
