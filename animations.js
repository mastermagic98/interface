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
        const styleId = '#maxsm_themes_animations';

        // прибираємо будь-які старі стилі
        $(styleId).remove();

        if (enabled) {
            const css = `
                <style id="maxsm_themes_animations">
                    .card, .torrent-item, .online-prestige, .extensions__item, .extensions__block-add,
                    .full-review-add, .full-review, .tag-count, .full-person, .full-episode,
                    .simple-button, .full-start__button, .items-cards .selector, .card-more,
                    .explorer-card__head-img.selector, .card-episode, .menu__item,
                    .selectbox-item, .settings-folder, .settings-param {
                        transform: scale(1);
                        transition: transform 0.3s ease;
                    }
                    .card.focus { transform: scale(1.03); }
                    .torrent-item.focus, .online-prestige.focus { transform: scale(1.01); }
                    .extensions__item.focus, .extensions__block-add.focus, .full-review-add.focus,
                    .full-review.focus, .tag-count.focus, .full-person.focus, .full-episode.focus,
                    .simple-button.focus, .full-start__button.focus, .items-cards .selector.focus,
                    .card-more.focus, .explorer-card__head-img.selector.focus, .card-episode.focus {
                        transform: scale(1.03);
                    }
                    .menu__item.focus { transform: translateX(-0.2em); }
                    .selectbox-item.focus, .settings-folder.focus, .settings-param.focus {
                        transform: translateX(0.2em);
                    }
                </style>
            `;
            $('body').append(css);
        } else {
            // Якщо вимкнено — додаємо стиль, який скасовує всі переходи
            const cssOff = `
                <style id="maxsm_themes_animations">
                    .card, .torrent-item, .online-prestige, .extensions__item, .extensions__block-add,
                    .full-review-add, .full-review, .tag-count, .full-person, .full-episode,
                    .simple-button, .full-start__button, .items-cards .selector, .card-more,
                    .explorer-card__head-img.selector, .card-episode, .menu__item,
                    .selectbox-item, .settings-folder, .settings-param {
                        transition: none !important;
                        transform: none !important;
                    }
                </style>
            `;
            $('body').append(cssOff);
        }
    }

    function initAnimationsSetting() {
        // якщо значення не встановлене, встановлюємо "true" за замовчуванням
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
                description: Lampa.Lang.translate('Увімкнути або вимкнути анімації інтерфейсу.')
            },
            onChange: function (value) {
                // 🔧 коректно приводимо тип
                const val = (value === true || value === 'true');
                localStorage.setItem('maxsm_themes_animations', val ? 'true' : 'false');

                // оновлення застосовується одразу
                setTimeout(() => {
                    applyAnimations();
                    if (Lampa.Settings) Lampa.Settings.update();
                }, 50);
            }
        });

        // застосовуємо поточний стан
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
