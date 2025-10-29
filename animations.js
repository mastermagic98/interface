(function () {
    'use strict';

    Lampa.Lang.add({
        animations: {
            ru: 'Анімації',
            en: 'Animations',
            uk: 'Анімації'
        }
    });

    var STYLE_ID = 'custom_animations_style';

    function animations() {
        var enabled = Lampa.Storage.get('animations', 'true') === 'true';
        var $style = $('#' + STYLE_ID);

        // Завжди видаляємо старий стиль
        $style.remove();

        if (enabled) {
            // Додаємо НОВИЙ стиль з !important і БАЗОВИМИ правилами для scale(1)
            var css = '<style id="' + STYLE_ID + '">' +
                // Базовий стан: scale(1) + transition тільки для transform
                '.card, .torrent-item, .online-prestige, .extensions__item, .extensions__block-add, .full-review-add, .full-review, .tag-count, .full-person, .full-episode, .simple-button, .full-start__button, .items-cards .selector, .card-more, .explorer-card__head-img.selector, .card-episode, .menu__item, .selectbox-item, .settings-folder, .settings-param {' +
                '  transform: scale(1) !important;' +
                '  transition: transform 0.3s ease !important;' +
                '}' +

                // Фокус: scale
                '.card.focus { transform: scale(1.03) !important; }' +
                '.torrent-item.focus, .online-prestige.focus { transform: scale(1.01) !important; }' +
                '.extensions__item.focus, .extensions__block-add.focus, .full-review-add.focus, .full-review.focus, .tag-count.focus, .full-person.focus, .full-episode.focus, .simple-button.focus, .full-start__button.focus, .items-cards .selector.focus, .card-more.focus, .explorer-card__head-img.selector.focus, .card-episode.focus { transform: scale(1.03) !important; }' +
                '.menu__item.focus { transform: translateX(-0.2em) !important; }' +
                '.selectbox-item.focus, .settings-folder.focus, .settings-param.focus { transform: translateX(0.2em) !important; }' +
                '</style>';

            $('body').append(css);
        }
        // Якщо !enabled — стиль вже видалений, нічого не додаємо
    }

    // Додаємо перемикач
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

    // Слухач на Storage
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'animations') {
            animations();
        }
    });

    // Функція запуску
    function init() {
        animations();
    }

    // Запуск при готовності
    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                init();
            }
        });
    }

    // Додатковий запуск (на випадок)
    setTimeout(animations, 500);
})();
