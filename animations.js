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

    // CSS для обох станів: коли анімації ввімкнені - видаляємо наш клас,
    // коли вимкнені - додаємо потужне перезаписуюче правило.
    function createStyle(enabled) {
        var css;
        if (!enabled) {
            css = '\
<style id="' + STYLE_ID + '">\
/* Глобальне відключення анімацій */\
body.' + BODY_CLASS + ' *, body.' + BODY_CLASS + ' *::before, body.' + BODY_CLASS + ' *::after {\
  transition: none !important;\
  animation: none !important;\
  -webkit-transition: none !important;\
  -webkit-animation: none !important;\
  transform: none !important;\
  -webkit-transform: none !important;\
  will-change: auto !important;\
}\
/* Забезпечити відключення для псевдокласів фокусу/hover */\
body.' + BODY_CLASS + ' .focus, body.' + BODY_CLASS + ' :focus, body.' + BODY_CLASS + ' :focus-visible {\
  transform: none !important;\
  transition: none !important;\
  animation: none !important;\
}\
</style>';
        } else {
            // При увімкненому стані видаляємо наші правила (порожній стиль)
            css = '<style id="' + STYLE_ID + '"></style>';
        }
        return css;
    }

    // Видаляємо inline-переходи та анімації з елементу (і рекурсивно з дітей)
    function stripInlineAnimations(node) {
        if (!node || node.nodeType !== 1) return;
        try {
            var s = node.style;
            if (s) {
                if (s.transition && s.transition !== 'none') s.transition = 'none';
                if (s.animation && s.animation !== 'none') s.animation = 'none';
                if (s.transform && s.transform !== 'none') s.transform = 'none';
                // додатково видаляємо конкретні префікси
                s.webkitTransition = 'none';
                s.webkitAnimation = 'none';
                s.webkitTransform = 'none';
            }
        } catch (e) {
            // інколи доступ до style може кидати помилку (SVG, чужі фрейми) — ігноруємо
        }

        // швидкий перебір дітей — але не дуже дорогий: обмежуємо глибину? поки що обходимо повністю
        var child = node.firstElementChild;
        while (child) {
            stripInlineAnimations(child);
            child = child.nextElementSibling;
        }
    }

    // Стартуємо MutationObserver, щоб перехоплювати нові елементи / inline-атрибути
    function startObserver() {
        stopObserver();

        observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < mutations.length; i++) {
                var m = mutations[i];

                if (m.type === 'childList') {
                    // нові вузли — обнуляємо у них переходи
                    m.addedNodes && m.addedNodes.forEach && m.addedNodes.forEach(function (n) {
                        if (n.nodeType === 1) stripInlineAnimations(n);
                    });
                } else if (m.type === 'attributes') {
                    // якщо хтось змінив атрибут style - обнуляємо transition/animation
                    if (m.attributeName === 'style' && m.target) {
                        stripInlineAnimations(m.target);
                    }
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
            // якщо document.body ще не готовий — просто ігноруємо (буде застосовано при init)
        }
    }

    function stopObserver() {
        if (observer) {
            try { observer.disconnect(); } catch (e) { }
            observer = null;
        }
    }

    function applyAnimations() {
        var raw = localStorage.getItem('maxsm_themes_animations');
        var enabled = (raw === null) ? true : (raw === 'true' || raw === true);

        // видаляємо старий стиль
        var old = document.getElementById(STYLE_ID);
        if (old) old.parentNode.removeChild(old);

        // додаємо новий стиль
        var css = createStyle(enabled);
        document.head.insertAdjacentHTML('beforeend', css);

        // додаємо/видаляємо клас на body
        if (!enabled) {
            document.documentElement.classList.add(BODY_CLASS);
            document.body && stripInlineAnimations(document.body);
            startObserver();
        } else {
            document.documentElement.classList.remove(BODY_CLASS);
            stopObserver();
        }
    }

    // Ініціалізація налаштування у Lampa.SettingsApi
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
                // Приводимо до булевого значення коректно
                var val = (value === true || value === 'true' || value === 1 || value === '1');
                localStorage.setItem('maxsm_themes_animations', val ? 'true' : 'false');

                // застосовуємо миттєво (маленька затримка, щоб Lampa встигла оновити інтерфейс)
                setTimeout(function () {
                    applyAnimations();
                    if (Lampa.Settings) {
                        try { Lampa.Settings.update(); } catch (e) { }
                    }
                }, 20);
            }
        });

        // Якщо Lampa може ще промальовувати — даємо невелику паузу та застосовуємо
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
