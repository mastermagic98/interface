(function () {
    'use strict';

    Lampa.Lang.add({
        maxsm_themes_animations: {
            ru: 'Анимации интерфейса',
            en: 'Interface animations',
            uk: 'Анімації інтерфейсу'
        }
    });

    function applyAnimations() {
        const enabled = localStorage.getItem('maxsm_themes_animations') === 'true';
        $('#maxsm_themes_animations').remove();

        if (enabled) {
            // --- Анімації УВІМКНЕНО ---
            const cssOn = `
                <style id="maxsm_themes_animations">
                    .card, .torrent-item, .online-prestige, .extensions__item, .extensions__block-add,
                    .full-review-add, .full-review, .tag-count, .full-person, .full-episode,
                    .simple-button, .full-start__button, .items-cards .selector, .card-more,
                    .explorer-card__head-img.selector, .card-episode, .menu__item,
                    .selectbox-item, .settings-folder, .settings-param, .icon, .button,
                    .menu__ico, .settings-param__name, .layer--card .card, .navigation-bar__item {
                        transform: scale(1);
                        transition: transform 0.3s ease, background 0.3s ease, opacity 0.3s ease;
                    }
                    .focus, :focus-visible {
                        transition: transform 0.3s ease, background 0.3s ease, opacity 0.3s ease;
                    }
                    .card.focus { transform: scale(1.03); }
                    .torrent-item.focus, .online-prestige.focus { transform: scale(1.01); }
                    .menu__item.focus, .settings-param.focus, .settings-folder.focus {
                        transform: translateX(0.2em);
                    }
                </style>
            `;
            $('body').append(cssOn);
        } else {
            // --- Анімації ВИМКНЕНО ---
            const cssOff = `
                <style id="maxsm_themes_animations">
                    * {
                        transition: none !important;
                        animation: none !important;
                    }
                    .card, .torrent-item, .online-prestige, .extensions__item, .extensions__block-add,
                    .full-review-add, .full-review, .tag-count, .full-person, .full-episode,
                    .simple-button, .full-start__button, .items-cards .selector, .card-more,
                    .explorer-card__head-img.selector, .card-episode, .menu__item,
                    .selectbox-item, .settings-folder, .settings-param, .icon, .button,
                    .menu__ico, .settings-param__name, .navigation-bar__item, .focus, :focus-visible {
                        transform: none !important;
                        transition: none !important;
                        animation: none !important;
                    }
                </style>
            `;
            $('body').append(cssOff);
        }
    }

    function initAnimationsSetting() {
        if (localStorage.getItem('maxsm_themes_animations') === null) {
            localStorage.setItem('maxsm_themes_animations', 'true');
        }

        const saved = localStorage.getItem('maxsm_themes_animations') === 'true';

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'maxsm_themes_animations',
                type: 'trigger',
                default: saved
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_animations'),
                description: Lampa.Lang.translate('Увімкнути або вимкнути всі анімації в інтерфейсі.')
            },
            onChange: function (value) {
                const val = (value === true || value === 'true');
                localStorage.setItem('maxsm_themes_animations', val ? 'true' : 'false');

                setTimeout(() => {
                    applyAnimations();
                    if (Lampa.Settings) Lampa.Settings.update();
                }, 50);
            }
        });

        applyAnimations();
    }

    if (window.appready) {
        initAnimationsSetting();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initAnimationsSetting();
            }
        });
    }
})();
