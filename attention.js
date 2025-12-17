(function () {
    'use strict';

    // Приклад JavaScript-плагіну для Lampa v3.0, який додає іконки до пунктів меню в adult-провайдерах Lampac
    // Це працює через спостереження за відкриттям меню та модифікацію DOM-елементів з HTML-іконками в title

    // Функція для додавання іконки перед текстом пункту меню
    function addIconToMenuItem(itemElement, iconSvg) {
        if (itemElement && iconSvg) {
            // Створюємо контейнер для іконки
            var iconWrapper = document.createElement('div');
            iconWrapper.className = 'menu__ico'; // Використовуємо стандартний клас Lampa для іконок у меню
            iconWrapper.innerHTML = iconSvg;

            // Створюємо контейнер для тексту
            var textWrapper = document.createElement('div');
            textWrapper.className = 'menu__text';
            textWrapper.textContent = itemElement.textContent.trim();

            // Очищаємо оригінальний текст і додаємо іконку + текст
            itemElement.innerHTML = '';
            itemElement.appendChild(iconWrapper);
            itemElement.appendChild(textWrapper);

            // Додаємо клас для стилізації (як у стандартному меню Lampa)
            itemElement.classList.add('selector');
        }
    }

    // Приклад SVG-іконок (stroke="white" для видимості на темному фоні, розмір 24x24)
    var icons = {
        // Ключі — точний текст title пункту меню (без HTML)
        'Женский Выбор': '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"/><path d="M12 8v8"/><path d="M8 12h8"/></g></svg>',
        'HD Порно': '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="white" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 9h2v6H7z"/><path d="M11 9h2v6h-2z"/><path d="M15 9h2v6h-2z"/></g></svg>',
        // Додайте інші категорії за потребою
        'Любительское': '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="white" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8"/><circle cx="12" cy="16" r="1"/></g></svg>'
    };

    // Функція обробки відкритого меню
    function processMenu() {
        // Селектор для пунктів меню в Lampa (зазвичай .menu__list .menu__item .menu__text або подібне)
        // Для adult-меню часто використовується .catalog .card або .menu__item
        var menuItems = document.querySelectorAll('.menu__list .menu__item, .selector.menu__item');

        menuItems.forEach(function (item) {
            var textElement = item.querySelector('.menu__text') || item;
            if (textElement) {
                var titleText = textElement.textContent.trim();
                if (icons[titleText] && !item.querySelector('.menu__ico')) {
                    addIconToMenuItem(item, icons[titleText]);
                }
            }
        });
    }

    // Спостерігаємо за змінами в DOM (коли відкривається меню або підменю)
    function observeMenu() {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length) {
                    processMenu();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Додаємо обробку при відкритті активності (наприклад, коли відкривається каталог)
    Lampa.Listener.follow('activity', function (e) {
        if (e.type === 'render') {
            setTimeout(processMenu, 500); // Затримка для повного рендеру меню
        }
    });

    // Ініціалізація після готовності Lampa
    if (window.appready) {
        observeMenu();
        processMenu();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                observeMenu();
                processMenu();
            }
        });
    }

    console.log('Плагін додавання іконок до меню Lampac завантажено');
})();
