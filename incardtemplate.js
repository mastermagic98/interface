(function () {
    'use strict';

    function main() {
        // --- Переклади ---
        Lampa.Lang.add({
            showbutton_desc: {
                ru: "Отображает все кнопки действий в карточке",
                en: "Display all action buttons in the card",
                uk: "Відображає всі кнопки дій у картці"
            },
            showbuttonwn_desc: {
                ru: "Оставить только иконки",
                en: "Show only icons",
                uk: "Залишити тільки іконки"
            },
            showhidden_desc: {
                ru: "Показать кнопки, скрытые под 'Смотреть'",
                en: "Show buttons hidden under 'Watch'",
                uk: "Показувати кнопки, приховані під «Дивитись»"
            },
            showbutton_title: {
                ru: "Показывать большие кнопки",
                en: "Show large buttons",
                uk: "Показувати великі кнопки"
            }
        });

        var style_id = 'buttons-style';

        // --- Основна логіка відображення ---
        function applyButtonMode() {
            var showLarge = Lampa.Storage.get('showbutton', false);
            var onlyIcons = Lampa.Storage.get('showbuttonwn', false);
            var showHidden = Lampa.Storage.get('showhidden', false);

            var style = document.getElementById(style_id);
            if (!style) {
                style = document.createElement('style');
                style.id = style_id;
                document.head.appendChild(style);
            }

            var css = '';

            // Відображення великих кнопок
            if (showLarge) {
                css += '.full-start__button, .full-start-new__button { display: flex !important; visibility: visible !important; opacity: 1 !important; }';
            }

            // Приховати текст, залишити іконки
            if (onlyIcons) {
                css += '.full-start__button span, .full-start-new__button span { display: none !important; }';
            } else {
                css += '.full-start__button span, .full-start-new__button span { display: inline-block !important; }';
            }

            // Показати приховані кнопки під «Дивитись»
            if (showHidden) {
                css += '.full-start__button.hide, .full-start-new__button.hide { display: flex !important; }';
            }

            style.innerHTML = css;
        }

        // --- Розгортання всіх кнопок (адаптація вашого main$2) ---
        function showAllButtonsLogic() {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'complite' && Lampa.Storage.get('showbutton')) {
                    setTimeout(function () {
                        var fullContainer = e.object.activity.render();
                        var targetContainer = fullContainer.find('.full-start-new__buttons');
                        fullContainer.find('.button--play').remove();

                        var allButtons = fullContainer.find('.buttons--container .full-start__button')
                            .add(targetContainer.find('.full-start__button'));

                        var categories = { online: [], torrent: [], trailer: [], other: [] };

                        allButtons.each(function () {
                            var $button = $(this);
                            var className = $button.attr('class');
                            if (className.includes('online')) {
                                categories.online.push($button);
                            } else if (className.includes('torrent')) {
                                categories.torrent.push($button);
                            } else if (className.includes('trailer')) {
                                categories.trailer.push($button);
                            } else {
                                categories.other.push($button.clone(true));
                            }
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
                    }, 100);
                }
            });
        }

        // --- Додаємо параметри у accent_color_plugin ---
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

            // 3️⃣ Показувати кнопки, приховані під «Дивитись»
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'showhidden',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('showhidden_desc'),
                    description: Lampa.Lang.translate('showhidden_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('showhidden', value);
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
