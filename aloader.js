(function () {
    'use strict';

    // Додаємо переклади для назв і параметрів
    Lampa.Lang.add({
        params_ani_on: {
            ru: 'Включить',
            en: 'Enable',
            uk: 'Увімкнути'
        },
        params_ani_select: {
            ru: 'Выбор анимации',
            en: 'Select loading animation',
            uk: 'Вибір анімації завантаження'
        },
        params_ani_name: {
            ru: 'Анимация Загрузки',
            en: 'Loading animation',
            uk: 'Анімація завантаження'
        }
    });

    // Додаємо шаблон для модального вікна
    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="color-picker-container">{ani_svg_content}</div></div>');

    // Функція для застосування кастомного завантажувача
    function setCustomLoader(url) {
        // Видаляємо попередні стилі
        $('#aniload-id').remove();
        // Екрануємо URL для безпечного використання в CSS
        var escapedUrl = url.replace(/'/g, "\\'");
        // Отримуємо колір виділення з попереднього плагіна
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#353535');
        // Створюємо стилі для активного завантажувача
        var newStyle = '.activity__loader { display: none !important; }' +
                       '.activity__loader.active { ' +
                           'background-attachment: scroll; ' +
                           'background-clip: border-box; ' +
                           'background-color: rgba(0, 0, 0, 0) !important; ' +
                           'background-image: url(\'' + escapedUrl + '\') !important; ' +
                           'background-origin: padding-box; ' +
                           'background-position-x: 50%; ' +
                           'background-position-y: 50%; ' +
                           'background-repeat: no-repeat; ' +
                           'background-size: contain !important; ' +
                           'box-sizing: border-box; ' +
                           'display: block !important; ' +
                           'position: fixed !important; ' +
                           'left: 50% !important; ' +
                           'top: 50% !important; ' +
                           'transform: translate(-50%, -50%) scale(1) !important; ' +
                           '-webkit-transform: translate(-50%, -50%) scale(1) !important; ' +
                           'width: 108px !important; ' +
                           'height: 108px !important; ' +
                           'filter: none !important; ' +
                           'fill: ' + mainColor + ' !important; ' +
                           'stroke: ' + mainColor + ' !important; ' +
                           'z-index: 9999 !important; ' +
                       '}';
        // Додаємо стилі до head
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');
        // Оновлюємо елемент завантажувача
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            element.style.fill = mainColor;
            element.style.stroke = mainColor;
            if (Lampa.Storage.get('ani_active', 'false') === 'true') {
                element.classList.add('active');
                element.style.display = 'block';
            }
        }
    }

    // Функція для вставки прев’ю завантажувача
    function insert_activity_loader_prv(escapedUrl) {
        // Видаляємо попередні стилі прев’ю
        $('#aniload-id-prv').remove();
        // Отримуємо колір виділення
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#353535');
        // Створюємо стилі для прев’ю
        var newStyle = '.activity__loader_prv { ' +
                       'display: inline-block; ' +
                       'width: 23px; ' +
                       'height: 24px; ' +
                       'margin-right: 10px; ' +
                       'vertical-align: middle; ' +
                       'background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; ' +
                       'background-size: contain; ' +
                       'filter: none; ' +
                       'fill: ' + mainColor + '; ' +
                       'stroke: ' + mainColor + '; ' +
                       '}';
        // Додаємо стилі до head
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
    }

    // Функція для видалення кастомного завантажувача
    function remove_activity_loader() {
        // Видаляємо стилі
        var styleElement = document.getElementById('aniload-id');
        if (styleElement) styleElement.remove();
        var prvStyleElement = document.getElementById('aniload-id-prv');
        if (prvStyleElement) prvStyleElement.remove();
        // Ховаємо елемент завантажувача
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
        }
    }

    // Функція для створення стилів модального вікна
    function create_ani_modal() {
        // Видаляємо попередні стилі, якщо є
        var existingStyle = document.getElementById('aniload');
        if (existingStyle) existingStyle.remove();
        // Отримуємо колір виділення
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#353535');
        // Створюємо нові стилі
        var style = document.createElement('style');
        style.id = 'aniload';
        style.textContent = [
            '.ani_modal_root { padding: 10px; }',
            '.color-picker-container { display: grid; grid-template-columns: 1fr 1fr; gap: 140px; padding: 0; }',
            '.ani_row { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 48px; gap: 10px; justify-items: center; width: 100%; padding: 10px; }',
            '.ani_svg { display: flex; align-items: center; justify-content: center; width: 100%; height: 48px; border-radius: 4px; }',
            '.ani_svg img { max-width: 40px; max-height: 40px; object-fit: contain; filter: none; fill: ' + mainColor + '; stroke: ' + mainColor + '; }',
            '.ani_svg.focus { background-color: ' + mainColor + '; border: 0.3em solid ' + mainColor + '; transform: scale(1.1); }',
            '@media (max-width: 768px) {',
            '  .color-picker-container { grid-template-columns: 1fr; }',
            '  .color-picker-container > div:nth-child(2) { justify-content: flex-start; }',
            '}'
        ].join('');
        // Додаємо стилі до head
        document.head.appendChild(style);
    }

    // Функція для створення HTML для SVG-завантажувача
    function createSvgHtml(src) {
        return '<div class="ani_svg selector" tabindex="0"><img src="' + src + '" style="visibility:visible; max-width:40px; max-height:40px;"></div>';
    }

    // Функція для розбиття масиву на групи
    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    // Функція для ініціалізації плагіна
    function aniLoad() {
        // Іконка для пункту меню
        var icon_plugin = '<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"></path></svg>';

        // Додаємо компонент до меню налаштувань
        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon_plugin
            });
        } catch (e) {}

        // Додаємо параметр для увімкнення/вимкнення плагіна
        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: {
                    name: 'ani_active',
                    type: 'trigger',
                    default: Lampa.Storage.get('ani_active', 'false')
                },
                field: {
                    name: Lampa.Lang.translate('params_ani_on'),
                    description: Lampa.Lang.translate('params_ani_on')
                },
                onChange: function (item) {
                    Lampa.Storage.set('ani_active', item);
                    if (item === 'true' && Lampa.Storage.get('ani_load')) {
                        setCustomLoader(Lampa.Storage.get('ani_load'));
                        insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                    } else {
                        remove_activity_loader();
                    }
                    // Оновлюємо видимість параметра вибору анімації
                    var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                    if (selectItem.length) {
                        selectItem.css('display', item === 'true' ? 'block' : 'none');
                    }
                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                    }
                },
                onRender: function (item) {
                    if (item && typeof item.css === 'function') {
                        item.css('display', 'block');
                    }
                }
            });
        } catch (e) {}

        // Додаємо параметр для вибору анімації
        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: {
                    name: 'select_ani_mation',
                    type: 'button'
                },
                field: {
                    name: '<div class="settings-folder__icon" style="display: inline-block; vertical-align: middle; width: 23px; height: 24px; margin-right: 10px;"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('params_ani_select'),
                    description: Lampa.Lang.translate('params_ani_select')
                },
                onRender: function (item) {
                    if (item && typeof item.css === 'function') {
                        item.css('display', Lampa.Storage.get('ani_active', 'false') === 'true' ? 'block' : 'none');
                        setTimeout(function () {
                            if (Lampa.Storage.get('ani_load')) {
                                insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                            }
                        }, 0);
                    }
                },
                onChange: function () {
                    // Перевіряємо наявність списку SVG-завантажувачів
                    if (!window.svg_loaders || window.svg_loaders.length === 0) {
                        Lampa.Noty.show('Список анімацій завантаження недоступний.');
                        Lampa.Controller.toggle('settings_component');
                        Lampa.Controller.enable('menu');
                        return;
                    }
                    // Створюємо стилі для модального вікна
                    create_ani_modal();
                    // Розбиваємо SVG-завантажувачі на групи по 6
                    var groupedSvgLinks = chunkArray(window.svg_loaders, 6);
                    // Створюємо HTML для кожної групи
                    var svg_content = groupedSvgLinks.map(function (group) {
                        var groupContent = group.map(createSvgHtml).join('');
                        return '<div class="ani_row">' + groupContent + '</div>';
                    });
                    // Розподіляємо групи між двома колонками
                    var midPoint = Math.ceil(svg_content.length / 2);
                    var leftColumn = svg_content.slice(0, midPoint).join('');
                    var rightColumn = svg_content.slice(midPoint).join('');
                    var modalContent = '<div class="color-picker-container"><div>' + leftColumn + '</div><div>' + rightColumn + '</div></div>';
                    // Створюємо HTML для модального вікна
                    var modalHtml = $('<div>' + modalContent + '</div>');
                    // Відкриваємо модальне вікно
                    try {
                        Lampa.Modal.open({
                            title: Lampa.Lang.translate('params_ani_select'),
                            size: 'medium',
                            align: 'center',
                            html: modalHtml,
                            className: 'ani-picker-modal',
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                            },
                            onSelect: function (a) {
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var imgElement = a[0].querySelector('img');
                                    if (imgElement) {
                                        var srcValue = imgElement.getAttribute('src');
                                        Lampa.Storage.set('ani_load', srcValue);
                                        if (Lampa.Storage.get('ani_active', 'false') === 'true') {
                                            setCustomLoader(srcValue);
                                            insert_activity_loader_prv(srcValue);
                                            // Короткочасно показуємо завантажувач для демонстрації
                                            var element = document.querySelector('.activity__loader');
                                            if (element) {
                                                element.classList.add('active');
                                                element.style.display = 'block';
                                                setTimeout(function () {
                                                    element.classList.remove('active');
                                                    element.style.display = 'none';
                                                }, 500);
                                            }
                                        }
                                    }
                                }
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                                if (Lampa.Settings && Lampa.Settings.render) {
                                    Lampa.Settings.render();
                                }
                            }
                        });
                    } catch (e) {}
                }
            });
        } catch (e) {}

        // Слухаємо зміни параметра ani_active
        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'ani_active') {
                var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                if (selectItem.length) {
                    selectItem.css('display', Lampa.Storage.get('ani_active', 'false') === 'true' ? 'block' : 'none');
                    if (Lampa.Storage.get('ani_active', 'false') === 'true' && Lampa.Storage.get('ani_load')) {
                        insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                    }
                }
                if (Lampa.Settings && Lampa.Settings.render) {
                    Lampa.Settings.render();
                }
            }
            // Слухаємо зміни кольору виділення з попереднього плагіна
            if (e.name === 'color_plugin_main_color') {
                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true') {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                    create_ani_modal();
                }
            }
        });

        // Слухаємо мутації для елемента .activity__loader
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1 && node.matches('.activity__loader')) {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true') {
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                            }
                        }
                    });
                    mutation.removedNodes.forEach(function (node) {
                        if (node.nodeType === 1 && node.matches('.activity__loader')) {
                            remove_activity_loader();
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }, 1000);

        // Слухаємо події full для керування завантажувачем
        Lampa.Listener.follow('full', function (e) {
            var element = document.querySelector('.activity__loader');
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true' && element) {
                setCustomLoader(Lampa.Storage.get('ani_load'));
                element.classList.add('active');
                element.style.display = 'block';
            } else if (e.type === 'complete' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        // Слухаємо події activity для керування завантажувачем
        Lampa.Listener.follow('activity', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true' && element) {
                setCustomLoader(Lampa.Storage.get('ani_load'));
                element.classList.add('active');
                element.style.display = 'block';
            } else if (event.type === 'loaded' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        // Слухаємо події push для керування завантажувачем
        Lampa.Activity.listener.follow('push', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true' && element) {
                setCustomLoader(Lampa.Storage.get('ani_load'));
                element.classList.add('active');
                element.style.display = 'block';
            } else if (event.status === 'ready' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        // Слухаємо подію back для приховування завантажувача
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'back') {
                var element = document.querySelector('.activity__loader');
                if (element) {
                    element.classList.remove('active');
                    element.style.display = 'none';
                }
            }
        });

        // Застосовуємо завантажувач при ініціалізації, якщо активовано
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    // Функція для оновлення завантажувача при зміні теми
    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    // Ініціалізація плагіна після готовності програми
    if (window.appready) {
        // Перевіряємо наявність window.svg_loaders
        if (window.svg_loaders && window.svg_loaders.length > 0) {
            aniLoad();
            byTheme();
        } else {
            // Спробуємо завантажити loaders.js, якщо svg_loaders недоступний
            var script = document.createElement('script');
            script.src = 'https://mastermagic98.github.io/interface/loaders.js';
            script.onload = function () {
                if (window.svg_loaders && window.svg_loaders.length > 0) {
                    aniLoad();
                    byTheme();
                }
            };
            script.onerror = function () {
                Lampa.Noty.show('Не вдалося завантажити анімації завантаження.');
            };
            document.head.appendChild(script);
        }
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                // Перевіряємо наявність window.svg_loaders
                if (window.svg_loaders && window.svg_loaders.length > 0) {
                    aniLoad();
                    byTheme();
                } else {
                    // Спробуємо завантажити loaders.js
                    var script = document.createElement('script');
                    script.src = 'https://mastermagic98.github.io/interface/loaders.js';
                    script.onload = function () {
                        if (window.svg_loaders && window.svg_loaders.length > 0) {
                            aniLoad();
                            byTheme();
                        }
                    };
                    script.onerror = function () {
                        Lampa.Noty.show('Не вдалося завантажити анімації завантаження.');
                    };
                    document.head.appendChild(script);
                }
            }
        });
    }

    // Експортуємо функцію byTheme
    window.byTheme = byTheme;
})();
