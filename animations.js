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
        $('#animations_style').remove();
        if (!enabled) return;

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

    function init() {
        Lampa.SettingsApi.addParam({
            component: 'animations_plugin',
            param: {
                name: 'animations',
                type: 'trigger',
                default: true
            },
            field: {
                name: Lampa.Lang.translate('animations'),
                description: ''
            },
            onChange: animations
        });

        animations();
    }

    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                init();
            }
        });
    }
})();
