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
        },
        default_loader: {
            ru: 'По умолчанию',
            en: 'Default',
            uk: 'За замовчуванням'
        },
        custom_svg_input: {
            ru: 'Введи URL SVG',
            en: 'Enter SVG URL',
            uk: 'Введи URL SVG'
        },
        svg_input_hint: {
            ru: 'Используйте URL SVG, например https://example.com/loader.svg',
            en: 'Use SVG URL, for example https://example.com/loader.svg',
            uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg'
        }
    });

    // Додаємо шаблон для модального вікна вибору анімації
    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');

    // Функція для конвертації HEX у RGB
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }

    // Функція для отримання RGB для SVG-фільтра
    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') {
            return { r: 255, g: 255, b: 255 }; // Білий для темної теми
        }
        return hexToRgb(mainColor);
    }

    // Функція для створення SVG для дефолтної іконки
    function applyDefaultLoaderColor() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
                         '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
                         '<circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
                         '  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
                         '</circle>' +
                         '</svg>';
        var encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encodedSvg, filter: '' };
    }

    // Функція для встановлення кастомного завантажувача
    function setCustomLoader(url) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        // Оновлено: Збільшено специфічність і прибрано background-color для .player-video__loader
        var newStyle = '.activity__loader { display: none !important; }' +
                       '.activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: transparent !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position-x: 50%; background-position-y: 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; filter: ' + filterValue + '; z-index: 9999 !important; }' +
                       '.lampac-balanser-loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; background-color: transparent !important; filter: ' + filterValue + ' !important; }' +
                       'body .player-video .player-video__loader, body .player-video.video--load .player-video__loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; background-color: transparent !important; filter: ' + filterValue + ' !important; backdrop-filter: none !important; z-index: 9999 !important; }' +
                       // Додано: Явне скидання стандартного стилю
                       'body .player-video__loader { background-image: none !important; }';
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');

        console.log('setCustomLoader викликано з URL:', url);

        // Застосовуємо стилі до всіх .player-video__loader
        var playerLoaderElements = document.querySelectorAll('.player-video__loader');
        for (var i = 0; i < playerLoaderElements.length; i++) {
            playerLoaderElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            playerLoaderElements[i].style.filter = filterValue;
            playerLoaderElements[i].style.backgroundColor = 'transparent';
            console.log('Стилі застосовано до .player-video__loader:', playerLoaderElements[i].style.backgroundImage, 'filter:', playerLoaderElements[i].style.filter);
        }

        // Застосовуємо стилі до .activity__loader
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            element.style.filter = filterValue;
            element.style.backgroundColor = 'transparent';
            if (Lampa.Storage.get('ani_active')) {
                element.classList.add('active');
                element.style.display = 'block';
            }
            console.log('Стилі застосовано до .activity__loader:', element.style.backgroundImage);
        }

        // Застосовуємо стилі до .lampac-balanser-loader
        var balanserElements = document.querySelectorAll('.lampac-balanser-loader');
        for (var i = 0; i < balanserElements.length; i++) {
            balanserElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            balanserElements[i].style.filter = filterValue;
            balanserElements[i].style.backgroundColor = 'transparent';
            console.log('Стилі застосовано до .lampac-balanser-loader:', balanserElements[i].style.backgroundImage);
        }
    }

    // Функція для вставки стилів для попереднього перегляду
    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
            filterValue = ''; // Без фільтра для дефолтної іконки
        }
        var newStyle = '.activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; background-color: transparent !important; filter: ' + filterValue + '; }' +
                       '.activity__loader_prv.focus { filter: ' + filterValue + '; }';
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
        console.log('Прев’ю стилі застосовано з URL:', escapedUrl);
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
            element.style.backgroundImage = '';
            element.style.filter = '';
            element.style.backgroundColor = 'transparent';
        }
        var balanserElements = document.querySelectorAll('.lampac-balanser-loader');
        for (var i = 0; i < balanserElements.length; i++) {
            balanserElements[i].style.backgroundImage = '';
            balanserElements[i].style.filter = '';
            balanserElements[i].style.backgroundColor = 'transparent';
        }
        var playerLoaderElements = document.querySelectorAll('.player-video__loader');
        for (var i = 0; i < playerLoaderElements.length; i++) {
            playerLoaderElements[i].style.backgroundImage = '';
            playerLoaderElements[i].style.filter = '';
            playerLoaderElements[i].style.backgroundColor = 'transparent';
        }
        insert_activity_loader_prv('./img/loader.svg');
        console.log('Стилі завантажувача видалено');
    }

    // Функція для створення стилів модального вікна
    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        var focusBorderColor = mainColor.toLowerCase() === '#353535' ? '#ffffff' : 'var(--main-color)';
        style.textContent = '.ani_modal_root { padding: 1em; }' +
                            '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 140px; padding: 0; }' +
                            '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
                            '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 30px; margin-bottom: 10px; justify-content: center; }' +
                            '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #ffffff !important; font-size: 10px; text-align: center; }' +
                            '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; filter: ' + filterValue + '; }' +
                            '.ani_loader_square.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
                            '.ani_loader_square.default { width: 35px; height: 35px; border-radius: 4px; }' +
                            '.ani_loader_square.default img { max-width: 30px; max-height: 30px; object-fit: contain; }' +
                            '.svg_input { width: 410px; height: 35px; border-radius: 8px; border: 2px solid #ddd; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff !important; font-size: 12px; font-weight: bold; text-shadow: 0 0 2px #000; background-color: #353535; }' +
                            '.svg_input.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
                            '.svg_input .label { position: absolute; top: 1px; font-size: 10px; }' +
                            '.svg_input .value { position: absolute; bottom: 1px; font-size: 10px; }';
        document.head.appendChild(style);
    }

    // Функція для створення HTML для SVG-іконки
    function createSvgHtml(src, index) {
        var className = 'ani_loader_square selector';
        var content = '<img src="' + src + '" alt="Loader ' + index + '">';
        return '<div class="' + className + '" tabindex="0" title="Loader ' + index + '">' + content + '</div>';
    }

    // Функція для розбиття масиву на частини
    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    // Функція для перевірки валідності URL SVG
    function isValidSvgUrl(url) {
        return /^https?:\/\/.*\.svg$/.test(url);
    }

    // Функція для додавання слухача фокуса до .activity__loader_prv
    function addPrvFocusListener() {
        var selectItem = $('.settings-param[data-name="select_ani_mation"]');
        if (selectItem.length === 0) {
            setTimeout(addPrvFocusListener, 500);
            return;
        }
        var prvElement = selectItem.find('.activity__loader_prv');
        if (prvElement.length === 0) return;

        function applyNormalColor() {
            var currentUrl = prvElement.css('background-image').replace(/^url\(["']?|["']?\)$/g, '');
            var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
            var rgb = getFilterRgb(mainColor);
            var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
            if (!currentUrl || currentUrl === applyDefaultLoaderColor().src) {
                prvElement.css('filter', '');
            } else {
                prvElement.css('filter', filterValue);
            }
            prvElement.removeClass('focus');
        }

        function applyFocusColor() {
            var currentUrl = prvElement.css('background-image').replace(/^url\(["']?|["']?\)$/g, '');
            var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
            var rgb = getFilterRgb(mainColor);
            var focusFilterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22focus_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#focus_color")';
            if (!currentUrl || currentUrl === applyDefaultLoaderColor().src) {
                prvElement.css('filter', '');
            } else {
                prvElement.css('filter', focusFilterValue);
            }
            prvElement.addClass('focus');
        }

        selectItem.on('focus', function () {
            applyFocusColor();
        });

        selectItem.on('blur', function () {
            applyNormalColor();
        });
        console.log('Слухач фокуса додано до .activity__loader_prv');
    }

    // Основна функція ініціалізації плагіна
    function aniLoad() {
        var icon_plugin = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" calcMode="spline" dur="1s" keySplines=".36,.6,.31,1;.36,.6,.31,1" values="0 12 12;180 12 12;360 12 12" repeatCount="indefinite"/></g></svg>';

        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon_plugin
            });
        } catch (e) {
            console.log('Помилка додавання компонента ani_load_menu:', e);
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
                    console.log('ani_active змінено на:', item);
                    Lampa.Storage.set('ani_active', item === 'true');
                    var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                    if (selectItem.length) {
                        selectItem.css('display', item === 'true' ? 'block' : 'none');
                        if (item === 'true') {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                                insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                            } else {
                                insert_activity_loader_prv('./img/loader.svg');
                            }
                        } else {
                            remove_activity_loader();
                        }
                    }
                    // Оновлено: Примусове оновлення налаштувань
                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                        setTimeout(function () {
                            var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                            selectItem.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
                            console.log('Примусово оновлено видимість select_ani_mation:', Lampa.Storage.get('ani_active'));
                        }, 50);
                    }
                }
            });
        } catch (e) {
            console.log('Помилка додавання параметра ani_active:', e);
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
                    if (!Lampa.Storage.get('ani_active')) {
                        item.css('display', 'none');
                    } else {
                        item.css('display', 'block');
                        setTimeout(function () {
                            insert_activity_loader_prv(Lampa.Storage.get('ani_load', './img/loader.svg'));
                            setTimeout(addPrvFocusListener, 100);
                        }, 0);
                    }
                },
                onChange: function () {
                    if (!window.svg_loaders || window.svg_loaders.length === 0) {
                        console.log('svg_loaders недоступні або порожні');
                        return;
                    }
                    if (!Lampa.Template.get('ani_modal')) {
                        Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');
                    }
                    create_ani_modal();

                    var groupedLoaders = chunkArray(window.svg_loaders, 6);
                    var svgContent = groupedLoaders.map(function(group) {
                        var groupContent = group.map(function(loader, index) {
                            return createSvgHtml(loader, groupedLoaders.indexOf(group) * 6 + index + 1);
                        }).join('');
                        return '<div class="ani_loader_row">' + groupContent + '</div>';
                    });

                    var midPoint = Math.ceil(svgContent.length / 2);
                    var leftColumn = svgContent.slice(0, midPoint).join('');
                    var rightColumn = svgContent.slice(midPoint).join('');

                    var defaultLoader = applyDefaultLoaderColor();
                    var defaultButton = '<div class="ani_loader_square selector default" tabindex="0" title="' + Lampa.Lang.translate('default_loader') + '"><img src="' + defaultLoader.src + '" style="filter: ' + defaultLoader.filter + ';"></div>';
                    var svgValue = Lampa.Storage.get('ani_load_custom_svg', '') || 'Наприклад https://example.com/loader.svg';
                    var inputHtml = '<div class="ani_loader_square selector svg_input" tabindex="0" style="width: 410px;">' +
                                    '<div class="label">' + Lampa.Lang.translate('custom_svg_input') + '</div>' +
                                    '<div class="value">' + svgValue + '</div>' +
                                    '</div>';
                    var topRowHtml = '<div style="display: flex; gap: 30px; padding: 0; justify-content: center; margin-bottom: 10px;">' +
                                     defaultButton + inputHtml + '</div>';

                    var modalContent = '<div class="ani_picker_container">' +
                                       '<div>' + leftColumn + '</div>' +
                                       '<div>' + rightColumn + '</div>' +
                                       '</div>';
                    var modalHtml = $('<div>' + topRowHtml + modalContent + '</div>');

                    try {
                        Lampa.Modal.open({
                            title: Lampa.Lang.translate('params_ani_select'),
                            size: 'medium',
                            align: 'center',
                            html: modalHtml,
                            className: 'ani_picker_modal',
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                            },
                            onSelect: function (a) {
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var selectedElement = a[0];
                                    var srcValue;

                                    if (selectedElement.classList.contains('svg_input')) {
                                        Lampa.Noty.show(Lampa.Lang.translate('svg_input_hint'));
                                        Lampa.Modal.close();
                                        var inputOptions = {
                                            name: 'ani_load_custom_svg',
                                            value: Lampa.Storage.get('ani_load_custom_svg', ''),
                                            placeholder: 'Наприклад https://example.com/loader.svg'
                                        };

                                        Lampa.Input.edit(inputOptions, function (value) {
                                            if (value === '') {
                                                Lampa.Noty.show('URL SVG не введено.');
                                                Lampa.Controller.toggle('settings_component');
                                                Lampa.Controller.enable('menu');
                                                return;
                                            }
                                            if (!isValidSvgUrl(value)) {
                                                Lampa.Noty.show('Невірний формат URL SVG. Використовуйте формат https://example.com/loader.svg.');
                                                Lampa.Controller.toggle('settings_component');
                                                Lampa.Controller.enable('menu');
                                                return;
                                            }
                                            Lampa.Storage.set('ani_load_custom_svg', value);
                                            Lampa.Storage.set('ani_load', value);
                                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                                                setCustomLoader(Lampa.Storage.get('ani_load'));
                                                insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                                            }
                                            Lampa.Controller.toggle('settings_component');
                                            Lampa.Controller.enable('menu');
                                            if (Lampa.Settings && Lampa.Settings.render) {
                                                Lampa.Settings.render();
                                            }
                                        });
                                        return;
                                    } else if (selectedElement.classList.contains('default')) {
                                        srcValue = './img/loader.svg';
                                        Lampa.Storage.set('ani_load', '');
                                        remove_activity_loader();
                                    } else {
                                        var imgElement = selectedElement.querySelector('img');
                                        srcValue = imgElement ? imgElement.getAttribute('src') : Lampa.Storage.get('ani_load', './img/loader.svg');
                                        Lampa.Storage.set('ani_load', srcValue);
                                    }

                                    if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && srcValue !== './img/loader.svg') {
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
                                    } else {
                                        insert_activity_loader_prv('./img/loader.svg');
                                    }
                                    Lampa.Modal.close();
                                    Lampa.Controller.toggle('settings_component');
                                    Lampa.Controller.enable('menu');
                                    if (Lampa.Settings && Lampa.Settings.render) {
                                        Lampa.Settings.render();
                                    }
                                }
                            }
                        });
                    } catch (e) {
                        console.log('Помилка відкриття модального вікна:', e);
                    }
                }
            });
        } catch (e) {
            console.log('Помилка додавання параметра select_ani_mation:', e);
        }

        // Спостерігач за змінами DOM
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader'))) {
                                console.log('Виявлено новий елемент:', node.className);
                                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                    setTimeout(function () {
                                        setCustomLoader(Lampa.Storage.get('ani_load'));
                                        console.log('setCustomLoader викликано для нового елемента:', node.className);
                                    }, 50);
                                }
                            }
                        });
                        mutation.removedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader'))) {
                                console.log('Видалено елемент:', node.className);
                                remove_activity_loader();
                            }
                        });
                    } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (mutation.target.classList.contains('player-video') && mutation.target.classList.contains('video--load')) {
                            console.log('Виявлено додавання класу video--load до .player-video');
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                setTimeout(function () {
                                    setCustomLoader(Lampa.Storage.get('ani_load'));
                                    console.log('Застосовано setCustomLoader для .player-video__loader');
                                    var loader = document.querySelector('.player-video.video--load .player-video__loader');
                                    if (loader) {
                                        console.log('.player-video__loader знайдено, backgroundImage:', loader.style.backgroundImage, 'filter:', loader.style.filter);
                                    } else {
                                        console.log('.player-video__loader не знайдено');
                                    }
                                }, 50);
                            }
                        } else if (mutation.target.classList.contains('player-video') && !mutation.target.classList.contains('video--load')) {
                            console.log('Виявлено видалення класу video--load з .player-video');
                            remove_activity_loader();
                        }
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
            console.log('MutationObserver ініціалізовано');
        }, 500);

        // Оновлено: Слухач подій плеєра з розширеним логуванням
        Lampa.Listener.follow('player', function (e) {
            console.log('Player event:', e.type); // Додано для діагностики
            if (e.type === 'init' || e.type === 'load' || e.type === 'loading' || e.type === 'start' || e.type === 'ready') {
                console.log('Виявлено подію player:', e.type);
                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                    setTimeout(function () {
                        setCustomLoader(Lampa.Storage.get('ani_load'));
                        console.log('Застосовано setCustomLoader для player event:', e.type);
                        var loader = document.querySelector('.player-video.video--load .player-video__loader');
                        if (loader) {
                            console.log('.player-video__loader знайдено, backgroundImage:', loader.style.backgroundImage, 'filter:', loader.style.filter);
                        } else {
                            console.log('.player-video__loader не знайдено');
                        }
                    }, 50);
                }
            }
        });

        Lampa.Listener.follow('full', function (e) {
            var element = document.querySelector('.activity__loader');
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
                console.log('Стилі застосовано для full event: start');
            } else if (e.type === 'complete' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('Стилі видалено для full event: complete');
            }
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    console.log('setCustomLoader викликано для full event: start');
                }, 50);
            }
        });

        Lampa.Listener.follow('activity', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
                console.log('Стилі застосовано для activity event: start');
            } else if (event.type === 'loaded' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('Стилі видалено для activity event: loaded');
            }
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    console.log('setCustomLoader викликано для activity event: start');
                }, 50);
            }
        });

        Lampa.Activity.listener.follow('push', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
                console.log('Стилі застосовано для activity push: active');
            } else if (event.status === 'ready' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('Стилі видалено для activity push: ready');
            }
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    console.log('setCustomLoader викликано для activity push: active');
                }, 50);
            }
        });

        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'back') {
                var element = document.querySelector('.activity__loader');
                if (element) {
                    element.classList.remove('active');
                    element.style.display = 'none';
                    console.log('Стилі видалено для app event: back');
                }
            }
        });

        setInterval(function () {
            var element = document.querySelector('.activity__loader');
            if (element && element.classList.contains('active')) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('Стилі видалено через setInterval');
            }
        }, 500);

        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
            console.log('Початкове застосування кастомного завантажувача');
        } else {
            remove_activity_loader();
            console.log('Початкове видалення стилів завантажувача');
        }
    }

    // Функція для застосування налаштувань за темою
    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
            console.log('byTheme: Застосовано кастомний завантажувач');
        } else {
            remove_activity_loader();
            console.log('byTheme: Видалено стилі завантажувача');
        }
    }

    // Запускаємо плагін після готовності програми
    if (window.appready) {
        aniLoad();
        byTheme();
        console.log('Плагін ініціалізовано (appready)');
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                aniLoad();
                byTheme();
                console.log('Плагін ініціалізовано (app event: ready)');
            }
        });
    }

    // Слухач зміни акцентного кольору
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'accent_color_selected') {
            byTheme();
            console.log('Змінено accent_color_selected, викликано byTheme');
        }
    });

    // Експортуємо функцію byTheme
    window.byTheme = byTheme;
})();
