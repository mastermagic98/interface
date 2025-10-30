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

    // Генеруємо CSS для вимкнення всіх плавних ефектів, включно з fade-in/out
    function createStyle(enabled) {
        let css;
        if (!enabled) {
            css = `
<style id="${STYLE_ID}">
/* Повне відключення плавності */
body.${BODY_CLASS} *, 
body.${BODY_CLASS} *::before, 
body.${BODY_CLASS} *::after {
  transition: none !important;
  animation: none !important;
  -webkit-transition: none !important;
  -webkit-animation: none !important;
  opacity: 1 !important;
  will-change: auto !important;
}

/* Відключення fade-in/out Lampa */
body.${BODY_CLASS} .layer--fade,
body.${BODY_CLASS} .layer,
body.${BODY_CLASS} .modal,
body.${BODY_CLASS} .settings-box,
body.${BODY_CLASS} .selectbox,
body.${BODY_CLASS} .background,
body.${BODY_CLASS} .screensaver,
body.${BODY_CLASS} .menu,
body.${BODY_CLASS} .head,
body.${BODY_CLASS} .activity,
body.${BODY_CLASS} .full,
body.${BODY_CLASS} .explorer-card__head-img {
  opacity: 1 !important;
  transition: none !important;
  animation: none !important;
}

/* Вимикаємо рух або масштабування при фокусі */
body.${BODY_CLASS} .focus,
body.${BODY_CLASS} :focus,
body.${BODY_CLASS} :focus-visible,
body.${BODY_CLASS} .hover,
body.${BODY_CLASS} .selector {
  transition: none !important;
  animation: none !important;
}

/* Вимикаємо затемнення бекграунду при відкритті модалок */
body.${BODY_CLASS} .layer__overlay,
body.${BODY_CLASS} .modal__background {
  opacity: 1 !important;
  background: rgba(0,0,0,0) !important;
  transition: none !important;
}
</style>`;
        } else {
            css = `<style id="${STYLE_ID}"></style>`;
        }
        return css;
    }

    // Видаляє inline-переходи й анімації (але не transform)
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

    // Відстеження нових елементів, щоб прибирати inline-анімації
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

    // Застосування стилю
    function applyAnimations() {
        const raw = localStorage.getItem('themes_animations');
        const enabled = (raw === null) ? true : (raw === 'true' || raw === true);

        const old = document.getElementById(STYLE_ID);
        if (old) old.remove();

        const css = createStyle(enabled);
        document.head.insertAdjacentHTML('beforeend', css);

        if (!enabled) {
            document.documentElement.classList.add(BODY_CLASS);
            if (document.body) stripInlineAnimations(document.body);
            startObserver();
        } else {
            document.documentElement.classList.remove(BODY_CLASS);
            stopObserver();
        }
    }

    // Ініціалізація в налаштуваннях
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
                description: Lampa.Lang.translate('Увімкнути або вимкнути всі анімації в інтерфейсі (включно із затемненням).')
            },
            onChange: function (value) {
                const val = (value === true || value === 'true' || value === 1 || value === '1');
                localStorage.setItem('themes_animations', val ? 'true' : 'false');
                setTimeout(() => applyAnimations(), 20);
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
