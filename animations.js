(function () {
    'use strict';

    const STORAGE_KEY = 'themes_animations';
    const STYLE_ID = 'themes_animations_style';
    const BODY_CLASS = 'no-animations';

    Lampa.Lang.add({
        themes_animations: {
            ru: 'Анимации интерфейса',
            en: 'Interface animations',
            uk: 'Анімації інтерфейсу'
        },
        themes_animations_descr: {
            ru: 'Включить или выключить все анимации интерфейса, кроме прокрутки.',
            en: 'Enable or disable all interface animations except scrolling.',
            uk: 'Увімкнути або вимкнути всі анімації інтерфейсу, крім прокрутки.'
        }
    });

    /** Видалення старого стилю і створення нового */
    function updateAnimationStyle(disable) {
        const old = document.getElementById(STYLE_ID);
        if (old) old.remove();

        if (!disable) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
/* Повне вимкнення анімацій, крім скролу */
body.${BODY_CLASS} *, 
body.${BODY_CLASS} *::before, 
body.${BODY_CLASS} *::after {
  transition: none !important;
  animation: none !important;
}

/* Окремо блокуємо фокусні ефекти карток, меню, кнопок */
body.${BODY_CLASS} .card,
body.${BODY_CLASS} .card.focus,
body.${BODY_CLASS} .selector,
body.${BODY_CLASS} .menu__item,
body.${BODY_CLASS} .menu__item.focus,
body.${BODY_CLASS} .settings-param,
body.${BODY_CLASS} .settings-param.focus,
body.${BODY_CLASS} .simple-button,
body.${BODY_CLASS} .simple-button.focus,
body.${BODY_CLASS} .full-person,
body.${BODY_CLASS} .explorer-card__head-img.selector,
body.${BODY_CLASS} .full-episode,
body.${BODY_CLASS} .torrent-item,
body.${BODY_CLASS} .torrent-item.focus,
body.${BODY_CLASS} .online-prestige,
body.${BODY_CLASS} .online-prestige.focus {
  transition: none !important;
  animation: none !important;
  transform: none !important;
}

/* Не чіпаємо плавність скролу, щоб підвантаження працювало */
body.${BODY_CLASS} .scroll__body,
body.${BODY_CLASS} .scroll__content,
body.${BODY_CLASS} .scrollbar,
body.${BODY_CLASS} .scroll__bar {
  transition: all 0.3s ease !important;
}
        `;
        document.head.appendChild(style);
    }

    /** Застосування налаштування */
    function applyAnimations() {
        const enabled = localStorage.getItem(STORAGE_KEY);
        const disable = enabled === 'false'; // false = вимкнено

        document.body.classList.toggle(BODY_CLASS, disable);
        updateAnimationStyle(disable);
    }

    /** Реєстрація параметра в меню кольору акценту */
    function initSettings() {
        if (localStorage.getItem(STORAGE_KEY) === null) {
            localStorage.setItem(STORAGE_KEY, 'true');
        }

        const current = localStorage.getItem(STORAGE_KEY) === 'true';

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
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
                const val = (value === true || value === 'true' || value === 1);
                localStorage.setItem(STORAGE_KEY, val ? 'true' : 'false');
                setTimeout(applyAnimations, 50);
            }
        });

        setTimeout(applyAnimations, 200);
    }

    /** Запуск після готовності Lampa */
    if (window.appready) {
        initSettings();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') {
                initSettings();
            }
        });
    }
})();
