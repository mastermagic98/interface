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
        let css;
        if (!enabled) {
            css = `
<style id="${STYLE_ID}">
/* Вимкнення візуальних анімацій */
body.${BODY_CLASS} *:not(.scroll__body):not(.items-container):not(.items-line):not(.scroll__content):not(.scroll__body *),
body.${BODY_CLASS} *:not(.scroll__body):not(.items-container):not(.items-line):not(.scroll__content):not(.scroll__body *)::before, 
body.${BODY_CLASS} *:not(.scroll__body):not(.items-container):not(.items-line):not(.scroll__content):not(.scroll__body *)::after {
  transition: none !important;
  animation: none !important;
  -webkit-transition: none !important;
  -webkit-animation: none !important;
  will-change: auto !important;
}

/* Вимикаємо підсвічування при фокусі */
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

    function startObserver() {
        stopObserver();
        observer = new MutationObserver(mutations => {
            for (const m of mutations) {
                if (m.type === 'childList' && m.addedNodes) {
                    m.addedNodes.forEach(n => {
                        if (n.nodeType === 1) stripInlineAnimations(n);
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

    function applyAnimations() {
        const raw = localStorage.getItem('themes_animations');
        const enabled = (raw === null) ? true : (raw === 'true' || raw === true);

        const old = document.getElementById(STYLE_ID);
        if (old) old.remove();

        const css = createStyle(enabled);
        document.head.insertAdjacentHTML('beforeend', css);

        if (!enabled) {
            document.documentElement.classList.add(BODY_CLASS);
            document.body && stripInlineAnimations(document.body);
            startObserver();
        } else {
            document.documentElement.classList.remove(BODY_CLASS);
            stopObserver();
        }
    }

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
                description: Lampa.Lang.translate('Увімкнути або вимкнути всі анімації в інтерфейсі (без впливу на підвантаження контенту).')
            },
            onChange: value => {
                const val = (value === true || value === 'true' || value === 1 || value === '1');
                localStorage.setItem('themes_animations', val ? 'true' : 'false');
                setTimeout(applyAnimations, 20);
            }
        });

        setTimeout(applyAnimations, 30);
    }

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
