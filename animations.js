(function () {
    'use strict';

    Lampa.Lang.add({
        maxsm_themes_animations: {
            ru: 'Анимации',
            en: 'Animations',
            uk: 'Анімації'
        }
    });

    function animations() {
        var animations = Lampa.Storage.get('maxsm_themes_animations', 'true') === 'true';
        $('#accent_color_animations').remove();
        if (animations) {
            var animations_style = '<style id="accent_color_animations">' +
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
            $('body').append(animations_style);
        }
    }

    function initAnimations() {
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'maxsm_themes_animations',
                type: 'trigger',
                default: true
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_animations'),
                description: ''
            },
            onChange: function () {
                animations();
            }
        });
        animations();
    }

    if (window.appready) {
        initAnimations();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initAnimations();
            }
        });
    }
})();
