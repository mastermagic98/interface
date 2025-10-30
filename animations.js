(function () {
    'use strict';

    Lampa.Lang.add({
        maxsm_themes_animations: {
            ru: 'Анимации интерфейса',
            en: 'Interface animations',
            uk: 'Анімації інтерфейсу'
        }
    });

    var STYLE_ID = 'maxsm_themes_animations';
    var BODY_CLASS = 'no-animations';
    var observer = null;

    function createStyle(enabled) {
        var css;
        if (!enabled) {
            css = `
<style id="${STYLE_ID}">
/* Вимкнення плавності, але без блокування transform */
body.${BODY_CLASS} *, 
body.${BODY_CLASS} *::before, 
body.${BODY_CLASS} *::after {
  transition: none !important;
  animation: none !important;
  -webkit-transition: none !important;
  -webkit-animation: none !important;
  will-change: auto !important;
}

/* Додатково: при фокусі або hover не змінюємо розмір */
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
            var s = node.style;
            if (s) {
                if (s.transition && s.transition !== 'none') s.transition = 'none';
                if (s.animation && s.animation !== 'none') s.animation = 'none';
                // ❌ Не чіпаємо transform!
                s.webkitTransition = 'none';
                s.webkitAnimation = 'none';
            }
        } catch (e) {}
        var child = node.firstElementChild;
        while (child) {
            stripInlineAnimations(child);
            child = child.nextElementSibling;
        }
    }

    function startObserver() {
        stopObserver();
        observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];
                if (m.type === 'childList' && m.addedNodes) {
                    m.addedNodes.forEach(function (n) {
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
        var raw = localStorage.getItem('maxsm_themes_animations');
        var enabled = (raw === null) ? true : (raw === 'true' || raw === true);

        var old = document.getElementById(STYLE_ID);
        if (old) old.remove();

        var css = createStyle(enabled);
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
        if (localStorage.getItem('maxsm_themes_animations') === null) {
            localStorage.setItem('maxsm_themes_animations', 'true');
        }

        var saved = localStorage.getItem('maxsm_themes_animations') === 'true';

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'maxsm_themes_animations',
                type: 'trigger',
                default: saved
            },
            field: {
                name: Lampa.Lang.translate('maxsm_themes_animations'),
                description: Lampa.Lang.translate('Увімкнути або вимкнути всі анімації в інтерфейсі.')
            },
            onChange: function (value) {
                var val = (value === true || value === 'true' || value === 1 || value === '1');
                localStorage.setItem('maxsm_themes_animations', val ? 'true' : 'false');
                setTimeout(() => applyAnimations(), 20);
            }
        });

        setTimeout(applyAnimations, 30);
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
