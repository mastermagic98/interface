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

        // видаляємо попередній стиль
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
        }
    }

    function initAnimationsSetting() {
        // встановлюємо значення за замовчуванням, якщо його ще немає
        if (localStorage.getItem('maxsm_themes_animations') === null) {
            localStorage.setItem('maxsm_themes_animations', 'true');
        }

        const isEnabled = localStorage.getItem('maxsm_themes_animations') === 'true';

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'maxsm_themes_animations',
                type: 'trigger',
                default: isEnabled
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_animations'),
                description: Lampa.Lang.translate('Увімкнути або вимкнути анімації при навігації в інтерфейсі.')
            },
            onChange: function (value) {
                // зберігаємо стан
                localStorage.setItem('maxsm_themes_animations', value ? 'true' : 'false');

                // оновлюємо Lampa (миттєве застосування)
                setTimeout(() => {
                    applyAnimations();
                    // оновлюємо відображення параметрів у налаштуваннях
                    if (Lampa.Settings) Lampa.Settings.update();
                }, 100);
            }
        });

        // застосовуємо поточний стан після ініціалізації
        setTimeout(applyAnimations, 150);
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
