(function () {
    'use strict';

    function main() {
        // --- Переклади ---
        Lampa.Lang.add({ 
            lme_showbutton_desc: {
                ru: "Выводит все кнопки действий в карточке",
                en: "Show all action buttons in card",
                uk: "Виводить усі кнопки дій у картці"
            },
            lme_showbuttonwn_desc: {
                ru: "Показывать только иконки",
                en: "Show only icons",
                uk: "Відображати тільки іконки"
            },
            lme_showbutton_title: {
                ru: "Показ кнопок у карточке",
                en: "Card buttons display",
                uk: "Відображення кнопок у картці"
            }
        });

        var style_id = 'lme-buttons-style';

        function applyButtonMode() {
            var showAll = Lampa.Storage.get('lme_showbutton', false);
            var hideText = Lampa.Storage.get('lme_showbuttonwn', false);

            // Створюємо або оновлюємо <style>
            var style = document.getElementById(style_id);
            if (!style) {
                style = document.createElement('style');
                style.id = style_id;
                document.head.appendChild(style);
            }

            var css = '';

            if (showAll) {
                css += '.full-start__button, .full-start-new__button { display: flex !important; visibility: visible !important; opacity: 1 !important; }';
                css += '.full-start__button.hide, .full-start-new__button.hide { display: flex !important; }';
            }

            if (hideText) {
                css += '.full-start__button span, .full-start-new__button span { display: none !important; }';
            } else {
                css += '.full-start__button span, .full-start-new__button span { display: inline-block !important; }';
            }

            style.innerHTML = css;
        }

        // --- Додаємо параметри до accent_color_plugin ---
        function addSettings() {
            if (!Lampa.SettingsApi || !Lampa.SettingsApi.addParam) {
                setTimeout(addSettings, 500);
                return;
            }

            // 1️⃣ Показати всі кнопки
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

                    // Якщо активовано — додаємо другу опцію
                    if (value) addHideTextOption();
                }
            });

            // Якщо увімкнено — додаємо другу одразу
            if (Lampa.Storage.get('lme_showbutton') == true) addHideTextOption();
        }

        // 2️⃣ Показувати тільки іконки (якщо активовано першу)
        function addHideTextOption() {
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
