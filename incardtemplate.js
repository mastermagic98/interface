(function () {
    'use strict';

    // --- Мова ---
    Lampa.Lang.add({
        incard_buttons_mode: {
            uk: 'Кнопки в картці',
            ru: 'Кнопки в карточке',
            en: 'Card buttons'
        },
        incard_mode_all: {
            uk: 'Показувати всі кнопки',
            ru: 'Показывать все кнопки',
            en: 'Show all buttons'
        },
        incard_mode_icons: {
            uk: 'Показувати тільки іконки',
            ru: 'Показывать только иконки',
            en: 'Show icons only'
        }
    });

    var STORAGE_KEY = 'incard_buttons_mode';
    var STYLE_ID = 'incard-buttons-mode-style';

    function getMode() {
        return Lampa.Storage.get(STORAGE_KEY, 'all');
    }

    function setMode(v) {
        Lampa.Storage.set(STORAGE_KEY, v);
    }

    function updateStyle(mode) {
        var style = document.getElementById(STYLE_ID);
        if (!style) {
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        var selectors = [
            '.full-start__button span',
            '.full-start-new__button span',
            '.full-start-new__buttons .full-start__button span',
            '.full-start-new__buttons .full-start-new__button span'
        ].join(', ');

        if (mode === 'icons') {
            style.innerHTML = selectors + ' { display: none !important; }';
        } else {
            style.innerHTML = selectors + ' { display: inline-block !important; }';
        }
    }

    function restoreButtons() {
        var btns = document.querySelectorAll('.full-start__button, .full-start-new__button');
        btns.forEach(function (b) {
            b.classList.remove('hide', 'hidden');
            b.style.display = '';
            b.style.visibility = '';
            var spans = b.querySelectorAll('span');
            spans.forEach(function (s) {
                s.style.display = '';
            });
        });
    }

    function applyToOpenCard() {
        restoreButtons();
        updateStyle(getMode());
    }

    function addSettings() {
        // чекаємо доки з’явиться accent_color_plugin
        if (!Lampa.SettingsApi.components || !Lampa.SettingsApi.components.accent_color_plugin) {
            setTimeout(addSettings, 500);
            return;
        }

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: STORAGE_KEY,
                type: 'list',
                default: 'all'
            },
            field: {
                name: Lampa.Lang.translate('incard_buttons_mode'),
                description: '',
                values: [
                    { id: 'all', name: Lampa.Lang.translate('incard_mode_all') },
                    { id: 'icons', name: Lampa.Lang.translate('incard_mode_icons') }
                ]
            },
            onChange: function (v) {
                setMode(v);
                applyToOpenCard();
            }
        });
    }

    function hookFullRender() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'render') {
                setTimeout(applyToOpenCard, 100);
                setTimeout(applyToOpenCard, 500);
                setTimeout(applyToOpenCard, 1000);
            }
        });
    }

    function init() {
        addSettings();
        applyToOpenCard();
        hookFullRender();
    }

    if (window.appready) init();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') init();
    });

})();
