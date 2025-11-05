(function () {
    'use strict';

    Lampa.Lang.add({
        themes_animations: {
            ru: 'Анимации интерфейса',
            en: 'Interface animations',
            uk: 'Анімації інтерфейсу'
        },
        themes_animations_descr: {
            ru: 'Увімкнути або вимкнути анімації елементів інтерфейсу',
            en: 'Enable or disable UI element animations',
            uk: 'Увімкнути або вимкнути анімації елементів інтерфейсу'
        }
    });

    function applyAnimations() {
        const enabled = localStorage.getItem('themes_animations') === 'true';
        $('#themes_animations_style').remove();

        if (enabled) {
            const css = `
                <style id="themes_animations_style">
                .card,
                .torrent-item,
                .online-prestige,
                .extensions__item,
                .extensions__block-add,
                .full-review-add,
                .full-review,
                .tag-count,
                .full-person,
                .full-episode,
                .simple-button,
                .full-start__button,
                .items-cards .selector,
                .card-more,
                .explorer-card__head-img.selector,
                .card-episode,
                .menu__item,
                .selectbox-item,
                .settings-folder,
                .settings-param {
                    transition: transform 0.3s ease !important;
                }
                .card.focus { transform: scale(1.03); }
                .torrent-item.focus,
                .online-prestige.focus { transform: scale(1.01); }
                .extensions__item.focus,
                .extensions__block-add.focus,
                .full-review-add.focus,
                .full-review.focus,
                .tag-count.focus,
                .full-person.focus,
                .full-episode.focus,
                .simple-button.focus,
                .full-start__button.focus,
                .items-cards .selector.focus,
                .card-more.focus,
                .explorer-card__head-img.selector.focus,
                .card-episode.focus {
                    transform: scale(1.03);
                }
                .menu__item.focus { transform: translateX(-0.2em); }
                .selectbox-item.focus,
                .settings-folder.focus,
                .settings-param.focus {
                    transform: translateX(0.2em);
                }
                </style>
            `;
            $('body').append(css);
        }
    }

    function initSettings() {
        Lampa.SettingsApi.addParam({
            component: 'themes_plugin',
            param: {
                name: 'themes_animations',
                type: 'trigger',
                default: true
            },
            field: {
                name: Lampa.Lang.translate('themes_animations'),
                description: Lampa.Lang.translate('themes_animations_descr')
            },
            onChange: function (value) {
                localStorage.setItem('themes_animations', value ? 'true' : 'false');
                applyAnimations(); // миттєве оновлення
            }
        });

        // застосувати при старті
        applyAnimations();
    }

    // ініціалізація
    if (window.appready) {
        initSettings();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') initSettings();
        });
    }
})();
