(function () {
    'use strict';

    // Додаємо переклади для плагіна
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

    // Додаємо шаблон для модального вікна вибору анімації
    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_grid">{ani_svg_content}</div></div>');

    // Функція для встановлення кастомного завантажувача
    function setCustomLoader(url) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ddd');
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + hexToRgb(mainColor).r/255 + ' 0 0 0 0 ' + hexToRgb(mainColor).g/255 + ' 0 0 0 0 ' + hexToRgb(mainColor).b/255 + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        var newStyle = '.activity__loader { display: none !important; }' +
                       '.activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: rgba(0, 0, 0, 0) !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position-x: 50%; background-position-y: 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; filter: ' + filterValue + '; z-index: 9999 !important; }';
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            if (Lampa.Storage.get('ani_active')) {
                element.classList.add('active');
                element.style.display = 'block';
            }
        }
    }

    // Функція для вставки стилів для попереднього перегляду
    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ddd');
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + hexToRgb(mainColor).r/255 + ' 0 0 0 0 ' + hexToRgb(mainColor).g/255 + ' 0 0 0 0 ' + hexToRgb(mainColor).b/255 + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        var focusFilterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22focus_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 0.8667 0 0 0 0 0.8667 0 0 0 0 0.8667 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#focus_color")';
        var newStyle = '.activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; filter: ' + filterValue + '; }' +
                       '.activity__loader_prv.focus, .activity__loader_prv:hover { filter: ' + focusFilterValue + '; }';
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
    }

    // Функція для видалення стилів завантажувача
    function remove_activity_loader() {
        var styleElement = document.getElementById('aniload-id');
        if (styleElement) styleElement.remove();
        var prvStyleElement = document.getElementById('aniload-id-prv');
        if (prvStyleElement) prvStyleElement.remove();
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
        }
    }

    // Функція для створення стилів модального вікна
    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ddd');
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + hexToRgb(mainColor).r/255 + ' 0 0 0 0 ' + hexToRgb(mainColor).g/255 + ' 0 0 0 0 ' + hexToRgb(mainColor).b/255 + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        style.textContent = '.ani_modal_root { padding: 1em; }' +
                            '.ani_grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; }' +
                            '.ani_row { display: contents; }' +
                            '.ani_svg { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: pointer; }' +
                            '.ani_svg img { max-width: 40px; max-height: 40px; object-fit: contain; filter: ' + filterValue + '; }' +
                            '.ani_svg.focus, .ani_svg:hover { background-color: #353535; border: 1px solid #9e9e9e; }';
        document.head.appendChild(style);
    }

    // Функція для створення HTML для SVG-іконки
    function createSvgHtml(src) {
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ddd');
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + hexToRgb(mainColor).r/255 + ' 0 0 0 0 ' + hexToRgb(mainColor).g/255 + ' 0 0 0 0 ' + hexToRgb(mainColor).b/255 + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        return '<div class="ani_svg selector" tabindex="0"><img src="' + src + '" style="visibility:visible; max-width:40px; max-height:40px; filter:' + filterValue + ';"></div>';
    }

    // Функція для конвертації HEX у RGB
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }

    // Функція для розбиття масиву на частини
    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    // Основна функція ініціалізації плагіна
    function aniLoad() {
        // Іконка для компонента налаштувань
        var icon_plugin = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" calcMode="spline" dur="1s" keySplines=".36,.6,.31,1;.36,.6,.31,1" values="0 12 12;180 12 12;360 12 12" repeatCount="indefinite"/></g></svg>';

        try {
            // Додаємо компонент до меню налаштувань
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon_plugin
            });
        } catch (e) {}

        try {
            // Додаємо параметр увімкнення/вимкнення анімації
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: {
                    name: 'ani_active',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('params_ani_on')
                },
                onChange: function (item) {
                    if (item === 'true') {
                        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                        }
                    } else {
                        remove_activity_loader();
                    }
                    Lampa.Settings.render();
                }
            });
        } catch (e) {}

        try {
            // Додаємо параметр вибору анімації
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
                    if (!Lampa.Storage.get('ani_active')) {
                        item.css('display', 'none');
                    } else {
                        item.css('display', 'block');
                        setTimeout(function () {
                            insert_activity_loader_prv(Lampa.Storage.get('ani_load', window.svg_loaders && window.svg_loaders.length > 0 ? window.svg_loaders[0] : ''));
                        }, 0);
                    }
                },
                onChange: function () {
                    if (!window.svg_loaders || window.svg_loaders.length === 0) return;
                    if (!Lampa.Template.get('ani_modal')) {
                        Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_grid">{ani_svg_content}</div></div>');
                    }
                    create_ani_modal();
                    var groupedSvgLinks = chunkArray(window.svg_loaders, 6);
                    var svg_content = groupedSvgLinks.map(function (group) {
                        var groupContent = group.map(createSvgHtml).join('');
                        return '<div class="ani_row">' + groupContent + '</div>';
                    }).join('');
                    var ani_templates = Lampa.Template.get('ani_modal', {
                        ani_svg_content: svg_content
                    });
                    try {
                        Lampa.Modal.open({
                            title: Lampa.Lang.translate('params_ani_select'),
                            size: 'large',
                            align: 'center',
                            html: $(ani_templates),
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
                                        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                                            setCustomLoader(Lampa.Storage.get('ani_load'));
                                            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                                            setTimeout(function () {
                                                var element = document.querySelector('.activity__loader');
                                                if (element) {
                                                    element.classList.add('active');
                                                    element.style.display = 'block';
                                                    setTimeout(function () {
                                                        element.classList.remove('active');
                                                        element.style.display = 'none';
                                                    }, 500);
                                                }
                                            }, 0);
                                        }
                                        Lampa.Modal.close();
                                        Lampa.Controller.toggle('settings_component');
                                        Lampa.Controller.enable('menu');
                                        if (Lampa.Settings && Lampa.Settings.render) {
                                            Lampa.Settings.render();
                                        }
                                    }
                                }
                            }
                        });
                    } catch (e) {}
                }
            });
        } catch (e) {}

        // Слухач зміни параметра ani_active для оновлення видимості кнопки вибору анімації
        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'ani_active') {
                var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                if (selectItem.length) {
                    selectItem.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
                    if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load')) {
                        insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                    }
                }
                Lampa.Settings.render();
            }
        });

        // Слухач зміни кольору з color.js
        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'color_plugin_main_color') {
                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                }
                // Оновлюємо стилі модального вікна при зміні кольору
                if (document.getElementById('aniload')) {
                    create_ani_modal();
                    var modal = document.querySelector('.ani_modal_root');
                    if (modal) {
                        var groupedSvgLinks = chunkArray(window.svg_loaders, 6);
                        var svg_content = groupedSvgLinks.map(function (group) {
                            var groupContent = group.map(createSvgHtml).join('');
                            return '<div class="ani_row">' + groupContent + '</div>';
                        }).join('');
                        var ani_templates = Lampa.Template.get('ani_modal', {
                            ani_svg_content: svg_content
                        });
                        modal.innerHTML = $(ani_templates).find('.ani_modal_root').html();
                    }
                }
            }
        });

        // Спостерігач за додаванням/видаленням елемента .activity__loader
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1 && node.matches('.activity__loader')) {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
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

        // Слухач подій full для керування завантажувачем
        Lampa.Listener.follow('full', function (e) {
            var element = document.querySelector('.activity__loader');
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (e.type === 'complete' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        // Слухач подій activity для керування завантажувачем
        Lampa.Listener.follow('activity', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.type === 'loaded' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        // Слухач подій push для керування завантажувачем
        Lampa.Activity.listener.follow('push', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.status === 'ready' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        // Слухач події back для приховування завантажувача
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'back') {
                var element = document.querySelector('.activity__loader');
                if (element) {
                    element.classList.remove('active');
                    element.style.display = 'none';
                }
            }
        });

        // Інтервал для приховування активного завантажувача
        setInterval(function () {
            var element = document.querySelector('.activity__loader');
            if (element && element.classList.contains('active')) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        }, 500);

        // Застосовуємо збережений завантажувач, якщо він активний
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    // Функція для застосування налаштувань за темою
    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    // Запускаємо плагін після готовності програми
    if (window.appready) {
        aniLoad();
        byTheme();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                aniLoad();
                byTheme();
            }
        });
    }

    // Слухач зміни акцентного кольору для оновлення теми
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'accent_color_selected') {
            byTheme();
        }
    });

    // Експортуємо функцію byTheme
    window.byTheme = byTheme;
})();
