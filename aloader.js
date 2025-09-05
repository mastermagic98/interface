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
    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_grid">{ani_svg_content}</div></div>');

    // Функція для застосування кастомного завантажувача з кольором виділення
    function setCustomLoader(url) {
        // Видаляємо попередні стилі
        var styleElement = document.getElementById('aniload-id');
        if (styleElement) {
            styleElement.remove();
        }

        // Отримуємо колір виділення з попереднього плагіна
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#353535');
        var rgbColor = hexToRgb(mainColor);

        // Екрануємо URL для безпечного використання
        var escapedUrl = url.replace(/'/g, "\\'");
        
        // Створюємо стилі для завантажувача
        var newStyle = '.activity__loader {' +
                          'display: none !important;' +
                       '}' +
                       '.activity__loader.active {' +
                          'background-attachment: scroll;' +
                          'background-clip: border-box;' +
                          'background-color: rgba(0, 0, 0, 0) !important;' +
                          'background-image: url(\'' + escapedUrl + '\') !important;' +
                          'background-origin: padding-box;' +
                          'background-position-x: 50%;' +
                          'background-position-y: 50%;' +
                          'background-repeat: no-repeat;' +
                          'background-size: contain !important;' +
                          'box-sizing: border-box;' +
                          'display: block !important;' +
                          'position: fixed !important;' +
                          'left: 50% !important;' +
                          'top: 50% !important;' +
                          'transform: translate(-50%, -50%) scale(1) !important;' +
                          '-webkit-transform: translate(-50%, -50%) scale(1) !important;' +
                          'width: 108px !important;' +
                          'height: 108px !important;' +
                          'filter: none !important;' + // Видаляємо статичний фільтр
                          'fill: ' + mainColor + ' !important;' + // Застосовуємо колір виділення
                          'z-index: 9999 !important;' +
                       '}';
        
        // Додаємо стилі до head
        var style = document.createElement('style');
        style.id = 'aniload-id';
        style.textContent = newStyle;
        document.head.appendChild(style);

        // Оновлюємо елемент .activity__loader
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            element.style.fill = mainColor; // Застосовуємо колір виділення
            if (Lampa.Storage.get('ani_active', 'false') === 'true') {
                element.classList.add('active');
                element.style.display = 'block';
            }
        }
    }

    // Функція для вставки прев’ю завантажувача
    function insert_activity_loader_prv(escapedUrl) {
        // Видаляємо попередні стилі
        var prvStyleElement = document.getElementById('aniload-id-prv');
        if (prvStyleElement) {
            prvStyleElement.remove();
        }

        // Отримуємо колір виділення
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#353535');

        // Створюємо стилі для прев’ю
        var newStyle = '.activity__loader_prv {' +
                          'display: inline-block;' +
                          'width: 23px;' +
                          'height: 24px;' +
                          'margin-right: 10px;' +
                          'vertical-align: middle;' +
                          'background: url(\'' + escapedUrl + '\') no-repeat 50% 50%;' +
                          'background-size: contain;' +
                          'filter: none !important;' + // Видаляємо статичний фільтр
                          'fill: ' + mainColor + ' !important;' + // Застосовуємо колір виділення
                       '}';
        
        // Додаємо стилі до head
        var style = document.createElement('style');
        style.id = 'aniload-id-prv';
        style.textContent = newStyle;
        document.head.appendChild(style);
    }

    // Функція для видалення завантажувача
    function remove_activity_loader() {
        var styleElement = document.getElementById('aniload-id');
        if (styleElement) {
            styleElement.remove();
        }
        var prvStyleElement = document.getElementById('aniload-id-prv');
        if (prvStyleElement) {
            prvStyleElement.remove();
        }
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
        }
    }

    // Функція для створення стилів модального вікна
    function create_ani_modal() {
        var style = document.getElementById('aniload');
        if (!style) {
            style = document.createElement('style');
            style.id = 'aniload';
            document.head.appendChild(style);
        }

        // Отримуємо колір виділення
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#353535');

        // Стилі для модального вікна, адаптовані до стилю плагіна вибору кольорів
        style.textContent = '.ani_modal_root {' +
                               'display: grid;' +
                               'grid-template-columns: 1fr 1fr;' +
                               'gap: 140px;' +
                               'padding: 0;' +
                            '}' +
                            '.ani_grid {' +
                               'display: grid;' +
                               'grid-template-columns: repeat(6, 1fr);' +
                               'grid-auto-rows: 48px;' +
                               'gap: 10px;' +
                               'justify-items: center;' +
                               'width: 100%;' +
                               'padding: 10px;' +
                            '}' +
                            '.ani_svg {' +
                               'display: flex;' +
                               'align-items: center;' +
                               'justify-content: center;' +
                               'width: 100%;' +
                               'height: 48px;' +
                               'border-radius: 4px;' +
                               'cursor: pointer;' +
                            '}' +
                            '.ani_svg img {' +
                               'max-width: 40px;' +
                               'max-height: 40px;' +
                               'object-fit: contain;' +
                               'fill: ' + mainColor + ' !important;' + // Застосовуємо колір виділення
                            '}' +
                            '.ani_svg.focus {' +
                               'background-color: ' + mainColor + ';' +
                               'border: 0.3em solid ' + mainColor + ';' +
                               'transform: scale(1.1);' +
                            '}' +
                            '@media (max-width: 768px) {' +
                               '.ani_modal_root {' +
                                  'grid-template-columns: 1fr;' +
                               '}' +
                            '}';
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

    // Функція для конвертації HEX у RGB
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return r + ', ' + g + ', ' + b;
    }

    // Функція для створення модального вікна
    function openAnimationPicker() {
        if (!window.svg_loaders || window.svg_loaders.length === 0) {
            Lampa.Noty.show('Немає доступних анімацій завантаження.');
            return;
        }

        // Створюємо стилі для модального вікна
        create_ani_modal();

        // Розбиваємо масив svg_loaders на групи по 6
        var groupedSvgLinks = chunkArray(window.svg_loaders, 6);
        
        // Формуємо HTML для кожної групи
        var svg_content = groupedSvgLinks.map(function (group) {
            var groupContent = group.map(createSvgHtml).join('');
            return '<div class="ani_row">' + groupContent + '</div>';
        }).join('');

        // Отримуємо шаблон і підставляємо контент
        var ani_templates = Lampa.Template.get('ani_modal', {
            ani_svg_content: svg_content
        });

        // Відкриваємо модальне вікно
        Lampa.Modal.open({
            title: Lampa.Lang.translate('params_ani_select'),
            size: 'medium',
            align: 'center',
            html: $(ani_templates),
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
                            // Тестове відображення завантажувача
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
    }

    // Функція для оновлення видимості параметрів
    function updateParamsVisibility(body) {
        var selectItem = body ? body.find('.settings-param[data-name="select_ani_mation"]') : $('.settings-param[data-name="select_ani_mation"]');
        setTimeout(function () {
            if (selectItem.length) {
                selectItem.css('display', Lampa.Storage.get('ani_active', 'false') === 'true' ? 'block' : 'none');
                if (Lampa.Storage.get('ani_active', 'false') === 'true' && Lampa.Storage.get('ani_load')) {
                    insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                }
            }
        }, 100);
    }

    // Основна функція ініціалізації плагіна
    function aniLoad() {
        // Іконка для меню налаштувань
        var icon_plugin = '<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"></path></svg>';

        // Додаємо компонент до меню налаштувань
        Lampa.SettingsApi.addComponent({
            component: 'ani_load_menu',
            name: Lampa.Lang.translate('params_ani_name'),
            icon: icon_plugin
        });

        // Параметр для увімкнення/вимкнення анімації
        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: {
                name: 'ani_active',
                type: 'trigger',
                default: Lampa.Storage.get('ani_active', 'false') === 'true'
            },
            field: {
                name: Lampa.Lang.translate('params_ani_on')
            },
            onChange: function (value) {
                Lampa.Storage.set('ani_active', value.toString());
                if (value === 'true' && Lampa.Storage.get('ani_load')) {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                } else {
                    remove_activity_loader();
                }
                updateParamsVisibility();
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

        // Параметр для вибору анімації
        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: {
                name: 'select_ani_mation',
                type: 'button'
            },
            field: {
                name: '<div class="settings-folder__icon" style="display: inline-block; vertical-align: middle; width: 23px; height: 24px; margin-right: 10px;"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('params_ani_select')
            },
            onRender: function (item) {
                if (item && typeof item.css === 'function') {
                    item.css('display', Lampa.Storage.get('ani_active', 'false') === 'true' ? 'block' : 'none');
                    if (Lampa.Storage.get('ani_active', 'false') === 'true' && Lampa.Storage.get('ani_load')) {
                        insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                    }
                }
            },
            onChange: function () {
                openAnimationPicker();
            }
        });

        // Слухач для оновлення видимості параметрів при відкритті налаштувань
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name === 'ani_load_menu') {
                updateParamsVisibility(e.body);
            }
        });

        // Слухач для змін у сховищі
        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'ani_active') {
                updateParamsVisibility();
                if (Lampa.Settings && Lampa.Settings.render) {
                    Lampa.Settings.render();
                }
            }
            // Слухаємо зміни кольору виділення з попереднього плагіна
            if (e.name === 'color_plugin_main_color' && Lampa.Storage.get('ani_active', 'false') === 'true' && Lampa.Storage.get('ani_load')) {
                setCustomLoader(Lampa.Storage.get('ani_load'));
                insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
            }
        });

        // Слухач для відстеження змін у DOM для .activity__loader
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

        // Слухачі для подій Lampa
        Lampa.Listener.follow('full', function (e) {
            var element = document.querySelector('.activity__loader');
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (e.type === 'complete' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        Lampa.Listener.follow('activity', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.type === 'loaded' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        Lampa.Activity.listener.follow('push', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.status === 'ready' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'back') {
                var element = document.querySelector('.activity__loader');
                if (element) {
                    element.classList.remove('active');
                    element.style.display = 'none';
                }
            }
        });

        // Ініціалізація завантажувача при старті
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    // Функція для оновлення за темою
    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active', 'false') === 'true') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    // Ініціалізація плагіна
    if (window.appready && Lampa.SettingsApi) {
        aniLoad();
        byTheme();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready' && Lampa.SettingsApi) {
                aniLoad();
                byTheme();
            }
        });
    }

    // Слухач для змін кольору з попереднього плагіна
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'color_plugin_main_color') {
            byTheme();
        }
    });

    // Експортуємо функцію byTheme
    window.byTheme = byTheme;
})();
