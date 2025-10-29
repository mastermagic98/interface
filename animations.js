(function () {
    'use strict';

    Lampa.Lang.add({
        animations: {
            ru: 'Анімації',
            en: 'Animations',
            uk: 'Анімації'
        }
    });

    // Унікальний ID, щоб не конфліктувати з іншими плагінами
    var STYLE_ID = 'custom_animations_style';

    function animations() {
        var enabled = Lampa.Storage.get('animations', 'true') === 'true';
        var $style = $('#' + STYLE_ID);

        if (enabled) {
            // Додаємо стиль ТІЛЬКИ якщо його ще немає
            if ($style.length === 0) {
                var css = '<style id="' + STYLE_ID + '">' +
                    '.card { transition: transform 0.3s ease !important; }' +
                    '.card.focus { transform: scale(1.03) !important; }' +
                    '.torrent-item, .online-prestige { transition: transform 0.3s ease !important; }' +
                    '.torrent-item.focus, .online-prestige.focus { transform: scale(1.01) !important; }' +
                    '.extensions__item, .extensions__block-add, .full-review-add, .full-review, .tag-count, .full-person, .full-episode, .simple-button, .full-start__button, .items-cards .selector, .card-more, .explorer-card__head-img.selector, .card-episode { transition: transform 0.3s ease !important; }' +
                    '.extensions__item.focus, .extensions__block-add.focus, .full-review-add.focus, .full-review.focus, .tag-count.focus, .full-person.focus, .full-episode.focus, .simple-button.focus, .full-start__button.focus, .items-cards .selector.focus, .card-more.focus, .explorer-card__head-img.selector.focus, .card-episode.focus { transform: scale(1.03) !important; }' +
                    '.menu__item { transition: transform 0.3s ease !important; }' +
                    '.menu__item.focus { transform: translateX(-0.2em) !important; }' +
                    '.selectbox-item, .settings-folder, .settings-param { transition: transform 0.3s ease !important; }' +
                    '.selectbox-item.focus, .settings-folder.focus, .settings-param.focus { transform: translateX(0.2em) !important; }' +
                    '</style>';
                $('body').append(css);
            }
        } else {
            // Повне видалення при вимкненні
            $style.remove();
        }
    }

    // Додаємо перемикач у існуючий компонент
    Lampa.SettingsApi.addParam({
        component: 'accent_color_plugin',
        param: {
            name: 'animations',
            type: 'trigger',
            default: true
        },
        field: {
            name: Lampa.Lang.translate('animations'),
            description: ''
        },
        onChange: function () {
            animations();
        }
    });

    // Головний слухач: реагує на зміну в Storage
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'animations') {
            animations();
        }
    });

    // Застосовуємо при запуску
    function applyOnReady() {
        animations();
    }

    if (window.appready) {
        applyOnReady();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                applyOnReady();
            }
        });
    }

    // Викликаємо одразу (на випадок, якщо appready вже true)
    animations();
})();
