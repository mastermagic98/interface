(function () {
    'use strict';

    function main() {
        // --- Переклади ---
        Lampa.Lang.add({
            showbutton_desc: {
                ru: "Показывает большие кнопки действий в карточке",
                en: "Shows large action buttons in the card",
                uk: "Показує великі кнопки дій у картці"
            },
            showbuttonwn_desc: {
                ru: "Оставить только иконки",
                en: "Show only icons",
                uk: "Залишити тільки іконки"
            },
            showall_desc: {
                ru: "Показать все кнопки, включая скрытые под «Смотреть»",
                en: "Show all buttons including hidden under 'Watch'",
                uk: "Показувати всі кнопки, включно з прихованими під «Дивитись»"
            },
            showbutton_title: {
                ru: "Показывать большие кнопки",
                en: "Show large buttons",
                uk: "Показувати великі кнопки"
            },
            showall_title: {
                ru: "Показывать все кнопки",
                en: "Show all buttons",
                uk: "Показувати всі кнопки"
            }
        });

        var style_id = 'buttons-style';

        // --- Основна функція застосування стилів ---
        function applyButtonMode() {
            var showLarge = Lampa.Storage.get('showbutton', false);
            var onlyIcons = Lampa.Storage.get('showbuttonwn', false);
            var showAll = Lampa.Storage.get('showall', false);

            var style = document.getElementById(style_id);
            if (!style) {
                style = document.createElement('style');
                style.id = style_id;
                document.head.appendChild(style);
            }

            var css = '';

            // Показувати великі кнопки
            if (showLarge) {
                css += '.full-start__button, .full-start-new__button { display: flex !important; visibility: visible !important; opacity: 1 !important; }';
            } else {
                css += '.full-start__button, .full-start-new__button { display: flex; visibility: visible; opacity: 1; }';
            }

            // Показувати тільки іконки
            if (onlyIcons) {
                css += '.full-start__button span, .full-start-new__button span { display: none !important; }';
            } else {
                css += '.full-start__button span, .full-start-new__button span { display: inline-block !important; }';
            }

            // Показувати всі кнопки (включно з прихованими)
            if (showAll) {
                css += '.full-start__button.hide, .full-start-new__button.hide { display: flex !important; }';
            }

            style.innerHTML = css;
        }

        // --- Повна логіка розгортання картки ---
        function showAllButtonsLogic() {
            Lampa.Listener.follow('full', function (e) {
                if ((e.type === 'render' || e.type === 'complite')) {
                    setTimeout(function () {
                        if (!Lampa.Storage.get('showbutton')) return;

                        var fullContainer = e.object.activity.render();
                        var targetContainer = fullContainer.find('.full-start-new__buttons');
                        fullContainer.find('.button--play').remove();

                        var allButtons = fullContainer.find('.buttons--container .full-start__button')
                            .add(targetContainer.find('.full-start__button'));

                        var categories = { online: [], torrent: [], trailer: [], other: [] };

                        allButtons.each(function () {
                            var $button = $(this);
                            var className = $button.attr('class');
                            if (className.includes('online')) categories.online.push($button);
                            else if (className.includes('torrent')) categories.torrent.push($button);
                            else if (className.includes('trailer')) categories.trailer.push($button);
                            else categories.other.push($button.clone(true));
                        });

                        var buttonSortOrder = Lampa.Storage.get('buttonsort') || ['torrent', 'online', 'trailer', 'other'];
                        targetContainer.empty();

                        buttonSortOrder.forEach(function (category) {
                            categories[category].forEach(function ($button) {
                                targetContainer.append($button);
                            });
                        });

                        // Якщо активовано "Залишити тільки іконки"
                        if (Lampa.Storage.get('showbuttonwn')) {
                            targetContainer.find("span").remove();
                        }

                        // Розміщення кнопок у рядках
                        targetContainer.css({
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px'
                        });

                        Lampa.Controller.toggle("full_start");
                        applyButtonMode(); // одразу оновлюємо стилі
                    }, 100);
                }
            });
        }

        // --- Параметри в accent_color_plugin ---
        function addSettings() {
            if (!Lampa.SettingsApi || !Lampa.SettingsApi.addParam) {
                setTimeout(addSettings, 500);
                return;
            }

            // 1️⃣ Показувати великі кнопки
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: { name: 'showbutton', type: 'trigger', default: false },
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
                param: { name: 'showbuttonwn', type: 'trigger', default: false },
                field: {
                    name: Lampa.Lang.translate('showbuttonwn_desc'),
                    description: Lampa.Lang.translate('showbuttonwn_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('showbuttonwn', value);
                    applyButtonMode();
                }
            });

            // 3️⃣ Показувати всі кнопки (включно з прихованими)
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: { name: 'showall', type: 'trigger', default: false },
                field: {
                    name: Lampa.Lang.translate('showall_title'),
                    description: Lampa.Lang.translate('showall_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('showall', value);
                    applyButtonMode();
                }
            });
        }

        // --- Ініціалізація ---
        function init() {
            addSettings();
            showAllButtonsLogic();
            applyButtonMode();
        }

        if (window.appready) init();
        else Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }

    main();
})();
