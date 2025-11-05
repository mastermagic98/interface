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

    function createStyle(enabled) {
        if (enabled) return `<style id="${STYLE_ID}"></style>`;

        return `
<style id="${STYLE_ID}">
/* Повне вимкнення декоративних transition і animation */
body.${BODY_CLASS} *:not(.scroll__body):not(.scroll__content):not(.scrollbar):not(.scroll__bar):not(.controller__focus):not(.layer__body):not(.items-line) {
  transition: none !important;
  animation: none !important;
}

/* Фокус без анімації */
body.${BODY_CLASS} .focus,
body.${BODY_CLASS} :focus,
body.${BODY_CLASS} :focus-visible {
  transition: none !important;
  animation: none !important;
}

/* Картки, кнопки, плашки */
body.${BODY_CLASS} .card,
body.${BODY_CLASS} .torrent-item,
body.${BODY_CLASS} .simple-button,
body.${BODY_CLASS} .settings-param,
body.${BODY_CLASS} .menu__item,
body.${BODY_CLASS} .full-person,
body.${BODY_CLASS} .explorer-card__head-img.selector,
body.${BODY_CLASS} .items-cards .selector {
  transition: none !important;
  animation: none !important;
}

/* Не чіпаємо скрол */
body.${BODY_CLASS} .scroll__body,
body.${BODY_CLASS} .scroll__content,
body.${BODY_CLASS} .scrollbar,
body.${BODY_CLASS} .scroll__bar {
  transition: all 0.3s ease !important;
}
</style>`;
    }

    function applyAnimations() {
        const raw = localStorage.getItem('themes_animations');
        const enabled = (raw === null) ? true : (raw === 'true' || raw === true);

        document.getElementById(STYLE_ID)?.remove();
        document.head.insertAdjacentHTML('beforeend', createStyle(enabled));

        document.body.classList.toggle(BODY_CLASS, !enabled);
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
                description: Lampa.Lang.translate('Увімкнути або вимкнути декоративні анімації (без впливу на прокрутку та підвантаження контенту).')
            },
            onChange: value => {
                localStorage.setItem('themes_animations', value ? 'true' : 'false');
                setTimeout(applyAnimations, 100);
            }
        });

        setTimeout(applyAnimations, 200);
    }

    if (window.appready) {
        initAnimationsSetting();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') initAnimationsSetting();
        });
    }
})();
