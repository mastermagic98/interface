(function () {
    'use strict';

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

    // Додаємо шаблон ani_modal
    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_grid">{ani_svg_content}</div></div>');

    function setCustomLoader(url) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var filterValue = 'brightness(0) invert(1) !important'; // Примусово #ffffff
        console.log('setCustomLoader: URL: ' + url + ', filter: ' + filterValue);
        var newStyle = '.activity__loader { display: none !important; }' +
                       '.activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: rgba(0, 0, 0, 0) !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position-x: 50%; background-position-y: 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; filter: ' + filterValue + '; z-index: 9999 !important; }';
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');
        var element = document.querySelector('.activity__loader');
        if (!element) {
            console.warn('Елемент .activity__loader не знайдено в DOM');
        } else {
            console.log('Знайдено елемент .activity__loader');
            element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            if (Lampa.Storage.get('ani_active')) {
                element.classList.add('active');
                element.style.display = 'block';
            }
        }
        console.log('Завантажувач встановлено: ' + url);
    }

    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        var newStyle = '.activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; filter: brightness(0) invert(1); }';
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
    }

    function remove_activity_loader() {
        var styleElement = document.getElementById('aniload-id');
        if (styleElement) styleElement.remove();
        var prvStyleElement = document.getElementById('aniload-id-prv');
        if (prvStyleElement) prvStyleElement.remove();
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
            console.log('remove_activity_loader: Лоадер прихований');
        }
    }

    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';
        style.textContent = '.ani_row { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 48px; gap: 10px; justify-items: center; width: 100%; padding: 10px; }' +
                            '.ani_svg { display: flex; align-items: center; justify-content: center; width: 100%; height: 48px; }' +
                            '.ani_svg img { max-width: 40px; max-height: 40px; object-fit: contain; filter: brightness(0) invert(1); }' +
                            '.ani_svg.focus { background-color: #353535; border: 1px solid #9e9e9e; }';
        document.head.appendChild(style);
        console.log('Модальне вікно анімацій створено, кількість SVG: ' + (window.svg_loaders ? window.svg_loaders.length : 0));
    }

    function createSvgHtml(src) {
        return '<div class="ani_svg selector" tabindex="0"><img src="' + src + '" style="visibility:visible; max-width:40px; max-height:40px;"></div>';
    }

    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    function aniLoad() {
        var icon_plugin = '<svg height="24" viewBox="0 0 24 26" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"/></svg>';

        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon_plugin
            });
            console.log('Компонент ani_load_menu додано');
        } catch (e) {
            console.error('Помилка додавання ani_load_menu: ' + e.message);
        }

        try {
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
                }
            });
            console.log('Параметр ani_active додано');
        } catch (e) {
            console.error('Помилка додавання ani_active: ' + e.message);
        }

        try {
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
                    insert_activity_loader_prv(Lampa.Storage.get('ani_load', window.svg_loaders && window.svg_loaders.length > 0 ? window.svg_loaders[0] : ''));
                },
                onChange: function () {
                    if (!window.svg_loaders || window.svg_loaders.length === 0) {
                        console.error('SVG завантажувачі не знайдено');
                        return;
                    }
                    // Перевіряємо наявність шаблону
                    if (!Lampa.Template.get('ani_modal')) {
                        console.error('Шаблон ani_modal не знайдено, додаємо повторно');
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
                            title: '',
                            size: 'medium',
                            align: 'left',
                            html: $(ani_templates),
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                            },
                            onSelect: function (a) {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
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
                                                console.log('Оновлення після вибору, знайдено елемент: ' + (element ? 'так' : 'ні'));
                                                if (element) {
                                                    element.classList.add('active');
                                                    element.style.display = 'block';
                                                    setTimeout(function () {
                                                        element.classList.remove('active');
                                                        element.style.display = 'none';
                                                        console.log('Резервне приховування .activity__loader через 3 секунди');
                                                    }, 3000);
                                                }
                                            }, 0);
                                        }
                                        console.log('Вибрано анімацію: ' + srcValue);
                                    } else {
                                        console.error('Елемент <img> не знайдено');
                                    }
                                } else {
                                    console.error('Переданий об’єкт не містить DOM-елемент');
                                }
                            }
                        });
                        console.log('Модальне вікно відкрито, відображено ' + window.svg_loaders.length + ' анімацій');
                    } catch (e) {
                        console.error('Помилка відкриття модального вікна: ' + e.message);
                    }
                }
            });
            console.log('Параметр select_ani_mation додано');
        } catch (e) {
            console.error('Помилка додавання select_ani_mation: ' + e.message);
        }

        // Ініціалізація MutationObserver із затримкою
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1 && node.matches('.activity__loader')) {
                            console.log('📌 [MutationObserver] Loader вставлено в DOM');
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                            }
                        }
                    });
                    mutation.removedNodes.forEach(function (node) {
                        if (node.nodeType === 1 && node.matches('.activity__loader')) {
                            console.log('✅ [MutationObserver] Loader видалено з DOM');
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('MutationObserver ініціалізовано');
        }, 1000);

        // Слухачі подій Lampa
        Lampa.Listener.follow('full', function (e) {
            console.log('📌 [Lampa.Listener] full викликано, тип: ' + e.type + ', ani_load: ' + Lampa.Storage.get('ani_load') + ', ani_active: ' + Lampa.Storage.get('ani_active'));
            var element = document.querySelector('.activity__loader');
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
                console.log('📌 [Lampa.Listener] Loader з’явився у логіці Lampa');
            } else if (e.type === 'complete' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('✅ [Lampa.Listener] Loader зник (завантаження завершено)');
            }
        });

        Lampa.Listener.follow('activity', function (event) {
            console.log('📌 [Lampa.Listener] activity викликано, тип: ' + event.type + ', ani_load: ' + Lampa.Storage.get('ani_load') + ', ani_active: ' + Lampa.Storage.get('ani_active'));
            var element = document.querySelector('.activity__loader');
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.type === 'loaded' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('✅ [Lampa.Listener] Loader зник через подію loaded');
            }
        });

        Lampa.Activity.listener.follow('push', function (event) {
            console.log('📌 [Lampa.Activity] push викликано, подія: ' + event.status + ', ani_load: ' + Lampa.Storage.get('ani_load') + ', ani_active: ' + Lampa.Storage.get('ani_active'));
            var element = document.querySelector('.activity__loader');
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.status === 'ready' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('✅ [Lampa.Activity] Loader зник через подію ready');
            }
        });

        Lampa.Listener.follow('app', function (event) {
            console.log('📌 [Lampa.Listener] app викликано, тип: ' + event.type);
            if (event.type === 'back') {
                var element = document.querySelector('.activity__loader');
                if (element) {
                    element.classList.remove('active');
                    element.style.display = 'none';
                    console.log('✅ [Lampa.Listener] Loader зник через подію back');
                }
            }
        });

        // Резервне приховування
        setInterval(function () {
            var element = document.querySelector('.activity__loader');
            if (element && element.classList.contains('active')) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('✅ [Interval] Резервне приховування .activity__loader через інтервал');
            }
        }, 3000);

        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            var main_color = getComputedStyle(document.documentElement).getPropertyValue('--main-color') || '#ffffff';
            console.log('byTheme: Застосовано колір: ' + main_color);
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    if (window.appready) {
        console.log('Lampa готова, виклик aniLoad');
        aniLoad();
        byTheme();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                console.log('Lampa готова, виклик aniLoad');
                aniLoad();
                byTheme();
            }
        });
    }

    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'accent_color_selected') {
            console.log('Lampa.Storage.change: accent_color_selected змінено на ' + e.value);
            byTheme();
        }
    });

    window.byTheme = byTheme;
})();
