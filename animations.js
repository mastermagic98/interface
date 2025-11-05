(function () {
    'use strict';

    const STYLE_ID = 'themes_animations';
    const BODY_CLASS = 'no-animations';
    const STORAGE_KEY = 'themes_animations';

    Lampa.Lang.add({
        themes_animations: {
            ru: 'Анимации интерфейса',
            en: 'Interface animations',
            uk: 'Анімації інтерфейсу'
        },
        themes_animations_descr: {
            ru: 'Включить или выключить анимации интерфейса',
            en: 'Enable or disable interface animations',
            uk: 'Увімкнути або вимкнути анімації інтерфейсу'
        }
    });

    /** Додає або оновлює CSS */
    function createOrUpdateStyle(disableAnimations) {
        document.getElementById(STYLE_ID)?.remove();

        if (!disableAnimations) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
/* Вимкнення усіх анімацій */
body.${BODY_CLASS} *, 
body.${BODY_CLASS} *::before, 
body.${BODY_CLASS} *::after {
  transition: none !important;
  animation: none !important;
}

/* Окремо для карток, меню, кнопок */
body.${BODY_CLASS} .card,
body.${BODY_CLASS} .focus,
body.${BODY_CLASS} .selector,
body.${BODY_CLASS} .menu__item,
body.${BODY_CLASS} .settings-param,
body.${BODY_CLASS} .simple-button,
body.${BODY_CLASS} .full-person,
body.${BODY_CLASS} .explorer-card__head-img.selector {
  transition: none !important;
  animation: none !important;
}

/* Не блокуємо плавність скролу */
body.${BODY_CLASS} .scroll__body,
body.${BODY_CLASS} .scroll__content,
body.${BODY_CLASS} .scrollbar,
body.${BODY_CLASS} .scroll__bar {
  transition: all 0.3s ease !important;
}
        `;
        document.head.appendChild(style);
    }

    /** Застосування поточного стану */
    function applyAnimations() {
        const disable = localStorage.getItem(STORAGE_KEY) === 'false';
        const body = document.body;
        if (!body) return;

        body.classList.toggle(BODY_CLASS, disable);
        createOrUpdateStyle(disable);

        console.log('[Animations]', disable ? 'disabled' : 'enabled');
    }

    /** Ініціалізація налаштування */
    function initSetting() {
        if (localStorage.getItem(STORAGE_KEY) === null)
            localStorage.setItem(STORAGE_KEY, 'true');

        const current = localStorage.getItem(STORAGE_KEY) === 'true';

        Lampa.SettingsApi.addParam({
            component: 'more', // гарантовано існує в меню "Ще"
            param: {
                name: STORAGE_KEY,
                type: 'trigger',
                default: current
            },
            field: {
                name: Lampa.Lang.translate('themes_animations'),
                description: Lampa.Lang.translate('themes_animations_descr')
            },
            onChange: value => {
                localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
                setTimeout(applyAnimations, 100);
            }
        });

        setTimeout(applyAnimations, 300);
    }

    /** Запуск після готовності додатку */
    function ready(fn) {
        if (window.appready) fn();
        else Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') fn();
        });
    }

    ready(initSetting);
})();
