(function () {
    'use strict';

    Lampa.Lang.add({
        animations: {
            ru: 'Анимации',
            en: 'Animations',
            uk: 'Анімації'
        }
    });

    function animations() {
        var enabled = Lampa.Storage.get('animations', 'true') === 'true';
        var $style = $('#animations_style');

        if (enabled) {
            // Додаємо стиль ТІЛЬКИ якщо його ще немає
            if ($style.length === 0) {
                var css = '<style id="animations_style">' +
                    '.card { transform: scale(1); transition: transform 0.3s ease; }' +
                    '.card.focus { transform: scale(1.03); }' +
                    '.torrent-item, .online-prestige { transform: scale(1); transition: transform 0.3s ease; }' +
                    '.torrent-item.focus, .online-prestige.focus { transform: scale(1.01); }' +
                    '.extensions__item, .extensions__block-add, .full-review-add, .full-review, .tag-count, .full-person, .full-episode, .simple-button, .full-start__button, .items-cards .selector, .card-more, .explorer-card__head-img.selector, .card-episode { transform: scale(1); transition: transform 0.3s ease; }' +
                    '.extensions__item.focus, .extensions__block-add.focus, .full-review-add.focus, .full-review.focus, .tag-count.focus, .full-person.focus, .full-episode.focus, .simple-button.focus, .full-start__button.focus, .items-cards .selector.focus, .card-more.focus, .explorer-card__head-img.selector.focus, .card-episode.focus { transform: scale(1.03); }' +
                    '.menu__item { transition: transform 0.3s ease; }' +
                    '.menu__item.focus { transform: translateX(-0.2em); }' +
                    '.selectbox-item, .settings-folder, .settings-param { transition: transform 0.3s ease; }' +
                    '.selectbox-item.focus, .settings-folder.focus, .settings-param.focus { transform: translateX(0.2em); }' +
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
            // Оновлюємо при зміні перемикача
            animations();
        }
    });

    // Головний слухач: реагує на будь-яку зміну в Storage (навіть з інших місць)
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'animations') {
            animations();
        }
    });

    // Застосовуємо при запуску Lampa
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

    // Додатково: викликаємо при першому завантаженні (на випадок, якщо appready вже true)
    animations();
})();
