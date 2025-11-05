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
        }
    });

    /** Додає або видаляє CSS */
    function createOrUpdateStyle(disableAnimations) {
        document.getElementById(STYLE_ID)?.remove();

        if (!disableAnimations) {
            return; // якщо анімації дозволені — не додаємо CSS
        }

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
/* Вимкнення більшості transition/animation */
body.${BODY_CLASS} *,
body.${BODY_CLASS} *::before,
body.${BODY_CLASS} *::after {
  transition: none !important;
  animation: none !important;
}

/* Для карток, меню, кнопок */
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

/* Не чіпаємо елементи скролу */
body.${BODY_CLASS} .scroll__body,
body.${BODY_CLASS} .scroll__content,
body.${BODY_CLASS} .scrollbar,
body.${BODY_CLASS} .scroll__bar {
  transition: all 0.3s ease !important;
}
        `;
        document.head.appendChild(style);
    }

    /** Застосування стану */
    function applyAnimations() {
        const disable = localStorage.getItem(STORAGE_KEY) === 'false';
        const body = document.body;

        if (!body) return;

        body.classList.toggle(BODY_CLASS, disable);
        createOrUpdateStyle(disable);

        console.log('[Animations]', disable ? 'disabled' : 'enabled');
    }

    /** Ініціалізація пункту в налаштуваннях */
    function initSetting() {
        if (localStorage.getItem(STORAGE_KEY) === null)
            localStorage.setItem(STORAGE_KEY, 'true');

        const current = localStorage.getItem(STORAGE_KEY) === 'true';

        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: STORAGE_KEY,
                type: 'trigger',
                default: current
            },
            field: {
                name: Lampa.Lang.translate('themes_animations'),
                description: 'Увімкнути або вимкнути анімації інтерфейсу (без впливу на підвантаження контенту)'
            },
            onChange: value => {
                localStorage.setItem(STORAGE_KEY, value ? 'true' : 'false');
                setTimeout(applyAnimations, 200);
            }
        });

        setTimeout(applyAnimations, 500);
    }

    /** Запуск після повного завантаження Lampa */
    function ready(fn) {
        if (window.appready) fn();
        else Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') fn();
        });
    }

    ready(initSetting);
})();
