(function () {
    'use strict';

    // --- локалізації ---
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

    // безпечне посилання на body
    const body = document.body || document.querySelector('body') || document.documentElement;

    // безпечний toggleClass (у випадку, якщо в середовищі немає jQuery)
    function safeToggleClass(el, cls, state) {
        if (!el || !cls) return;
        try {
            if (typeof state === 'boolean') {
                if (state) el.classList.add(cls); else el.classList.remove(cls);
            } else {
                el.classList.toggle(cls);
            }
        } catch (e) {}
    }

    // створює CSS (не відключає transform — щоб меню/скрол працювали)
    function createStyle(enabled) {
        if (!enabled) {
            return `
<style id="${STYLE_ID}">
/* Вимикаємо анімації та переходи, але не блокуючи transform/позиціювання */
body.${BODY_CLASS} *, 
body.${BODY_CLASS} *::before, 
body.${BODY_CLASS} *::after {
  transition: none !important;
  animation: none !important;
  -webkit-transition: none !important;
  -webkit-animation: none !important;
  will-change: auto !important;
}

/* Дозволяємо скрол-контенту працювати: даємо слабкий transition тільки для технічних рухів*/
body.${BODY_CLASS} .scroll-body,
body.${BODY_CLASS} .scroll__content,
body.${BODY_CLASS} .items-line,
body.${BODY_CLASS} .items-container {
  transition: transform 0.05s linear !important;
}

/* Вимикаємо анімації фокусу/hover для елементів UI */
body.${BODY_CLASS} .focus,
body.${BODY_CLASS} :focus,
body.${BODY_CLASS} :focus-visible {
  transition: none !important;
  animation: none !important;
}
</style>`;
        } else {
            return `<style id="${STYLE_ID}"></style>`;
        }
    }

    // очистити інлайн transition|animation (але пропускаємо скрол-елементи)
    function stripInlineAnimations(node) {
        if (!node || node.nodeType !== 1) return;
        // пропускаємо елементи, які відповідають за підвантаження/стрічки
        const skipClasses = ['scroll-body', 'scroll__content', 'items-line', 'items-container', 'card', 'items-line__item'];
        for (let c of skipClasses) {
            if (node.classList && node.classList.contains(c)) return;
        }

        try {
            const s = node.style;
            if (s) {
                if (s.transition && s.transition !== 'none') s.transition = 'none';
                if (s.animation && s.animation !== 'none') s.animation = 'none';
                s.webkitTransition = 'none';
                s.webkitAnimation = 'none';
                // НЕ чіпаємо transform (щоб не зламати позиціювання)
            }
        } catch (e) {}

        let child = node.firstElementChild;
        while (child) {
            stripInlineAnimations(child);
            child = child.nextElementSibling;
        }
    }

    // MutationObserver з винятками для динамічного контенту Lampa
    function startObserver() {
        stopObserver();
        observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'childList' && m.addedNodes) {
                    m.addedNodes.forEach(n => {
                        if (!n || n.nodeType !== 1) return;
                        // пропускаємо контейнерні/стрічкові елементи, щоб не перешкоджати підвантаженню
                        const skip = n.classList && (
                            n.classList.contains('scroll-body') ||
                            n.classList.contains('scroll__content') ||
                            n.classList.contains('items-line') ||
                            n.classList.contains('items-container') ||
                            n.classList.contains('card')
                        );
                        if (!skip) stripInlineAnimations(n);
                    });
                } else if (m.type === 'attributes' && m.attributeName === 'style' && m.target) {
                    // якщо inline-style змінюється на елементі, який НЕ в списку пропуску — очищуємо
                    const t = m.target;
                    const skip = t.classList && (
                        t.classList.contains('scroll-body') ||
                        t.classList.contains('scroll__content') ||
                        t.classList.contains('items-line') ||
                        t.classList.contains('items-container') ||
                        t.classList.contains('card')
                    );
                    if (!skip) stripInlineAnimations(t);
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
        } catch (e) {
            // якщо body ще не готовий або обмеження безпеки — ігноруємо
        }
    }

    function stopObserver() {
        if (observer) {
            try { observer.disconnect(); } catch (e) {}
            observer = null;
        }
    }

    // застосувати стиль/стан анімацій
    function applyAnimations() {
        const raw = localStorage.getItem('themes_animations');
        const enabled = (raw === null) ? true : (raw === 'true' || raw === true);

        const old = document.getElementById(STYLE_ID);
        if (old) old.remove();

        const css = createStyle(enabled);
        try { document.head.insertAdjacentHTML('beforeend', css); } catch (e) { }

        if (!enabled) {
            document.documentElement.classList.add(BODY_CLASS);
            body && stripInlineAnimations(body);
            startObserver();
        } else {
            document.documentElement.classList.remove(BODY_CLASS);
            stopObserver();
        }
    }

    // реєстрація налаштування в Lampa
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
                // невелика пауза, даємо Lampa промалювати, потім застосовуємо
                setTimeout(applyAnimations, 30);
            }
        });

        // застосувати початковий стан
        setTimeout(applyAnimations, 40);
    }

    // --- ДОДАТКОВО: глобальні слухачі, щоб гарантувати виклик scrollEnded/onAnimateEnd ---
    // Ці слухачі працюють загально для контролерів Lampa (items_line etc.)
    (function enableScrollFallbacks() {
        let native_scroll_timer = null;
        let native_scroll_animate = false;

        // допоміжна функція: викликаємо методи контролера, якщо вони існують
        function callControllerScrollEnd() {
            try {
                const ctrl = Lampa.Controller && Lampa.Controller.enabled && Lampa.Controller.enabled();
                if (!ctrl) return;
                if (typeof ctrl.scrollEnded === 'function') {
                    try { ctrl.scrollEnded(); } catch (e) {}
                }
                if (typeof ctrl.onAnimateEnd === 'function') {
                    try { ctrl.onAnimateEnd(); } catch (e) {}
                }
            } catch (e) {}
        }

        // touchstart: додаємо notransition (як робив Lampa)
        document.addEventListener('touchstart', function (e) {
            safeToggleClass(body, 'notransition', true);
        }, { passive: true });

        // touchend: знімаємо notransition і викликаємо завершення скролу
        document.addEventListener('touchend', function (e) {
            safeToggleClass(body, 'notransition', false);

            // невелика затримка, щоб DOM оновився
            setTimeout(callControllerScrollEnd, 20);
        }, { passive: true });

        // scroll: fallback — таймер + rAF, щоб викликати scrollEnded
        window.addEventListener('scroll', function () {
            // якщо анімації вимкнені, зменшуємо затримку
            const delay = localStorage.getItem('themes_animations') === 'true' ? 300 : 0;

            clearTimeout(native_scroll_timer);
            native_scroll_timer = setTimeout(function () {
                // викликаємо onAnimateEnd якщо є
                try {
                    const ctrl = Lampa.Controller && Lampa.Controller.enabled && Lampa.Controller.enabled();
                    if (ctrl && typeof ctrl.onAnimateEnd === 'function') {
                        try { ctrl.onAnimateEnd(); } catch (e) {}
                    }
                } catch (e) {}
            }, delay);

            if (!native_scroll_animate) {
                native_scroll_animate = true;
                requestAnimationFrame(function () {
                    native_scroll_animate = false;
                    // також викликаємо scrollEnded
                    callControllerScrollEnd();
                });
            }
        }, { passive: true });
    })();

    // ініціалізація плагіна після готовності Lampa
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
