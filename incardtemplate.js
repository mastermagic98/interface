(function () {
    'use strict';

    // --- Ідентифікатор плагіну ---
    var plugin_id = 'buttons_visibility_plugin';

    // --- Ініціалізація Storage ---
    if (Lampa.Storage.get('show_big_buttons') === undefined) Lampa.Storage.set('show_big_buttons', false);
    if (Lampa.Storage.get('show_hidden_buttons') === undefined) Lampa.Storage.set('show_hidden_buttons', false);
    if (Lampa.Storage.get('icons_only') === undefined) Lampa.Storage.set('icons_only', false);
    if (Lampa.Storage.get('show_text_on_hover') === undefined) Lampa.Storage.set('show_text_on_hover', true);

    /**
     * Оновлює стан кнопок згідно з налаштуваннями користувача
     */
    function updateButtonsState() {
        var showBig = Lampa.Storage.get('show_big_buttons');
        var showHidden = Lampa.Storage.get('show_hidden_buttons');
        var iconsOnly = Lampa.Storage.get('icons_only');
        var textOnHover = Lampa.Storage.get('show_text_on_hover');

        var container = $('.full-start-new__buttons, .buttons--container');

        container.find('.full-start__button').each(function () {
            var $btn = $(this);

            // --- Показувати великі кнопки ---
            if (showBig) {
                $btn.addClass('big');
                $btn.show();
            } else {
                $btn.removeClass('big');
            }

            // --- Залишити тільки іконки ---
            if (iconsOnly) {
                $btn.find('span').hide();
            } else {
                $btn.find('span').show();
            }

            // --- Показувати текст на кнопках при наведенні ---
            if (textOnHover) {
                $btn.removeClass('always-text');
            } else {
                $btn.addClass('always-text');
            }
        });

        // --- Не приховувати кнопки (відкрити панель джерел) ---
        if (showHidden) {
            var moreButton = $('.button--more');
            if (moreButton.length) {
                moreButton.each(function () {
                    if (!$(this).hasClass('active')) $(this).trigger('hover:enter');
                });
            }
        }
    }

    /**
     * Основна функція, що спрацьовує при відкритті сторінки фільму/серіалу
     */
    function initButtonControl() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') {
                setTimeout(updateButtonsState, 200);
            }
        });
    }

    /**
     * Реєстрація опцій у меню «Налаштування кольору акценту»
     */
    function addPluginSettings() {
        var params = [
            {
                name: 'show_big_buttons',
                type: 'toggle',
                default: false,
                values: ['Ні', 'Так'],
                title: 'Показувати великі кнопки',
                description: 'Відображає всі основні кнопки, які не приховані під «Дивитись».'
            },
            {
                name: 'show_hidden_buttons',
                type: 'toggle',
                default: false,
                values: ['Ні', 'Так'],
                title: 'Не приховувати кнопки',
                description: 'Показує кнопки, що зазвичай ховаються під «Дивитись».'
            },
            {
                name: 'icons_only',
                type: 'toggle',
                default: false,
                values: ['Ні', 'Так'],
                title: 'Залишити тільки іконки',
                description: 'Прибирає текст із кнопок.'
            },
            {
                name: 'show_text_on_hover',
                type: 'toggle',
                default: true,
                values: ['Ні', 'Так'],
                title: 'Показувати текст на кнопках при наведенні',
                description: 'Відновлює стандартну поведінку Лампи: текст видно лише при фокусі.'
            }
        ];

        Lampa.Settings.add({
            component: 'accent_color_plugin',
            name: plugin_id,
            type: 'button_visibility',
            params: params
        });

        // --- Реакція на зміну параметрів без перезапуску ---
        Lampa.Settings.listener.follow('change', function (event) {
            if (event.name === 'show_big_buttons' ||
                event.name === 'show_hidden_buttons' ||
                event.name === 'icons_only' ||
                event.name === 'show_text_on_hover') {
                updateButtonsState();
            }
        });
    }

    /**
     * Ініціалізація плагіну
     */
    function start() {
        addPluginSettings();
        initButtonControl();

        // CSS для керування текстом на кнопках
        var style = document.createElement('style');
        style.textContent = `
            .full-start__button.always-text span {
                display: inline !important;
            }
            .full-start__button:not(.always-text) span {
                opacity: 0;
                transition: opacity 0.2s;
            }
            .full-start__button:not(.always-text):hover span,
            .full-start__button:not(.always-text):focus span {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);
    }

    start();
})();
