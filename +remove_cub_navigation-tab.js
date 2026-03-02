(function () {
    'use strict';

    if (!window.Lampa) return;

    function removeCUBButton() {
        var buttons = document.querySelectorAll('.navigation-tabs__button.selector');

        buttons.forEach(function (btn) {
            if (btn.textContent.trim() === 'CUB') {
                btn.remove();
            }
        });
    }

    function initCUBRemover() {
        // Первинне видалення
        removeCUBButton();

        // Спостерігач за DOM (бо Lampa перемальовує інтерфейс)
        var observer = new MutationObserver(function () {
            removeCUBButton();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Чекаємо повного старту Lampa
    if (Lampa.Listener) {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                initCUBRemover();
            }
        });
    } else {
        document.addEventListener('DOMContentLoaded', initCUBRemover);
    }

})();
