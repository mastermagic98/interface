(function () {
    'use strict';

    // Мовні ключі
    Lampa.Lang.add({
        themes_animations: {
            ru: 'Анимации интерфейса',
            en: 'Interface animations',
            uk: 'Анімації інтерфейсу'
        },
        themes_animations_descr: {
            ru: 'Включить или выключить все анимации в интерфейсе',
            en: 'Enable or disable all interface animations',
            uk: 'Увімкнути або вимкнути всі анімації в інтерфейсі'
        }
    });

    const STYLE_ID = 'themes_animations';
    const BODY_CLASS = 'no-animations';
    let observer = null;

    // Безпечне оголошення body
    const body = document.body || document.querySelector('body');

    // Створення стилю для вимкнення анімацій
    function createStyle(enabled) {
        let css;
        if (!enabled) {
            css = `
<style id="${STYLE_ID}">
/* Глобальне вимкнення анімацій */
body.${BODY_CLASS} *, 
body.${BODY_CLASS} *::before, 
body.${BODY_CLASS} *::after {
  transition: none !important;
  animation: none !important;
  -webkit-transition: none !important;
  -webkit-animation: none !important;
  will-change: auto !important;
}

/* Дозволяємо рух скролу (щоб працювало підвантаження) */
body.${BODY_CLASS} .scroll-body,
body.${BODY_CLASS} .scroll__content {
  transition: transform 0.1s !important;
}

/* Вимикаємо фокус-анімації */
body.${BODY_CLASS} .focus, 
body.${BODY_CLASS} :focus, 
body.${BODY_CLASS} :focus-visible {
  transition: none !important;
  animation: none !important;
}
</style>`;
        } else {
            css = `<style id="${STYLE_ID}"></style>`;
        }
        return css;
    }

    // Очищення інлайнових transition/animation
    function stripInlineAnimations(node) {
        if (!node || node.nodeType !== 1) return;
        try {
            const s = node.style;
            if (s) {
                if (s.transition && s.transition !== 'none') s.transition = 'none';
                if (s.animation && s.animation !== 'none') s.animation = 'none';
                s.webkitTransition = 'none';
                s.webkitAnimation = 'none';
            }
        } catch (e) {}
        let child = node.firstElementChild;
        while (child) {
            stripInlineAnimations(child);
            child = child.nextElementSibling;
        }
    }

    // Спостерігач DOM з винятками
    function startObserver() {
        stopObserver();
        observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'childList' && m.addedNodes) {
                    m.addedNodes.forEach(n => {
                        if (!n || n.nodeType !== 1) return;
                        // Пропускаємо динамічні елементи Lampa
                        if (n.classList && (
                            n.classList.contains('scroll-body') ||
                            n.classList.contains('scroll__content') ||
                            n.classList.contains('items-line') ||
                            n.classList.contains('card') ||
                            n.classList.contains('items-container')
                        )) return;

                        stripInlineAnimations(n);
                    });
                } else if (m.type === 'attributes' && m.attributeName === 'style' && m.target) {
                    stripInlineAnimations(m.target);
                }
            }
        });

        try {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style']
            });
        } catch (e) {}
    }

    function stopObserver() {
        if (observer) {
            try { observer.disconnect(); } catch (e) {}
            observer = null;
        }
    }

    // Застосування стану анімацій
    function applyAnimations() {
        const raw = localStorage.getItem('themes_animations');
        const enabled = (raw === null) ? true : (raw === 'true' || raw === true);

        const old = document.getElementById(STYLE_ID);
        if (old) old.remove();

        const css = createStyle(enabled);
        document.head.insertAdjacentHTML('beforeend', css);

        if (!enabled) {
            document.documentElement.classList.add(BODY_CLASS);
            body && stripInlineAnimations(body);
            startObserver();
        } else {
            document.documentElement.classList.remove(BODY_CLASS);
            stopObserver();
        }
    }

    // Ініціалізація параметра в меню
    function initAnimationsSetting() {
        if (localStorage.getItem('themes_animations') === null) {
            localStorage.setItem('themes_animations', 'true');
        }

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
                description: Lampa.Lang.translate('themes_animations_descr')
            },
            onChange: value => {
                const val = (value === true || value === 'true' || value === 1 || value === '1');
                localStorage.setItem('themes_animations', val ? 'true' : 'false');
                setTimeout(applyAnimations, 30);
            }
        });

        setTimeout(applyAnimations, 50);
    }

    // Запуск після готовності додатку
    if (window.appready) {
        initAnimationsSetting();
    } else {
        Lampa.Listener.follow('app', event => {
            if (event.type === 'ready') {
                initAnimationsSetting();
            }
        });
    }
})();
