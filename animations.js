(function () {
    'use strict';

    Lampa.Lang.add({
        themes_animations: {
            ru: 'Анимации интерфейса',
            en: 'Interface animations',
            uk: 'Анімації інтерфейсу'
        }
    });

    const STYLE_ID = 'themes_animations';
    const BODY_CLASS = 'no-animations';
    let observer = null;

    function createStyle(enabled) {
        if (enabled) return `<style id="${STYLE_ID}"></style>`;

        return `
<style id="${STYLE_ID}">
/* Вимикаємо декоративні анімації, не зачіпаючи системні */
body.${BODY_CLASS} .card,
body.${BODY_CLASS} .torrent-item,
body.${BODY_CLASS} .online-prestige,
body.${BODY_CLASS} .extensions__item,
body.${BODY_CLASS} .extensions__block-add,
body.${BODY_CLASS} .full-review,
body.${BODY_CLASS} .full-review-add,
body.${BODY_CLASS} .tag-count,
body.${BODY_CLASS} .full-person,
body.${BODY_CLASS} .full-episode,
body.${BODY_CLASS} .simple-button,
body.${BODY_CLASS} .full-start__button,
body.${BODY_CLASS} .items-cards .selector,
body.${BODY_CLASS} .card-more,
body.${BODY_CLASS} .explorer-card__head-img.selector,
body.${BODY_CLASS} .card-episode,
body.${BODY_CLASS} .menu__item,
body.${BODY_CLASS} .settings-folder,
body.${BODY_CLASS} .settings-param {
  transition: none !important;
  animation: none !important;
}

/* Не вимикаємо системні елементи прокрутки */
body.${BODY_CLASS} .scroll__body,
body.${BODY_CLASS} .scroll__content,
body.${BODY_CLASS} .scrollbar,
body.${BODY_CLASS} .scroll__bar {
  transition: all 0.3s ease !important;
}

/* Вимикаємо фокус-анімації */
body.${BODY_CLASS} .focus,
body.${BODY_CLASS} :focus,
body.${BODY_CLASS} :focus-visible {
  transition: none !important;
  animation: none !important;
}
</style>`;
    }

    function applyAnimations() {
        const raw = localStorage.getItem('themes_animations');
        const enabled = (raw === null) ? true : (raw === 'true' || raw === true);

        document.getElementById(STYLE_ID)?.remove();
        document.head.insertAdjacentHTML('beforeend', createStyle(enabled));

        if (!enabled) {
            document.body.classList.add(BODY_CLASS);
        } else {
            document.body.classList.remove(BODY_CLASS);
        }
    }

    function initAnimationsSetting() {
        if (localStorage.getItem('themes_animations') === null)
            localStorage.setItem('themes_animations', 'true');

        const saved = localStorage.getItem('themes_animations') === 'true';

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'themes_animations',
                type: 'trigger',
                default: saved
            },
            field: {
                name: Lampa.Lang.translate('themes_animations'),
                description: Lampa.Lang.translate('Увімкнути або вимкнути декоративні анімації (без впливу на скрол і підвантаження контенту).')
            },
            onChange: value => {
                localStorage.setItem('themes_animations', value ? 'true' : 'false');
                setTimeout(applyAnimations, 50);
            }
        });

        setTimeout(applyAnimations, 100);
    }

    if (window.appready) {
        initAnimationsSetting();
    } else {
        Lampa.Listener.follow('app', event => {
            if (event.type === 'ready') initAnimationsSetting();
        });
    }
})();
