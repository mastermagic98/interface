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
        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        // Оновлено: Посилено специфічність і додано скидання стандартних стилів
        var newStyle = 'body .activity__loader { display: none !important; background-image: none !important; }' +
                       'body .activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: transparent !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position-x: 50%; background-position-y: 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; filter: ' + whiteFilter + '; z-index: 9999 !important; }' +
                       'body .lampac-balanser-loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; background-color: transparent !important; filter: ' + whiteFilter + ' !important; }' +
                       'body .player-video .player-video__loader, body .player-video.video--load .player-video__loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; background-color: transparent !important; filter: ' + whiteFilter + ' !important; backdrop-filter: none !important; z-index: 9999 !important; display: block !important; }' +
                       'body .loading-layer .loading-layer__ico, body .player-video .loading-layer__ico { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; background-color: transparent !important; filter: ' + whiteFilter + ' !important; width: 1.9em !important; height: 1.9em !important; display: block !important; }' +
                       'body .loading-layer__ico:not(.custom), body .player-video__loader:not(.custom) { background-image: none !important; display: none !important; }';
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');

        console.log('setCustomLoader викликано з URL:', url);

        // Застосовуємо стилі до всіх .player-video__loader
        var playerLoaderElements = document.querySelectorAll('.player-video__loader');
        for (var i = 0; i < playerLoaderElements.length; i++) {
            playerLoaderElements[i].classList.add('custom');
            playerLoaderElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            playerLoaderElements[i].style.filter = whiteFilter;
            playerLoaderElements[i].style.backgroundColor = 'transparent';
            playerLoaderElements[i].style.display = 'block';
            console.log('Стилі застосовано до .player-video__loader:', playerLoaderElements[i].style.backgroundImage, 'filter:', playerLoaderElements[i].style.filter, 'backgroundColor:', playerLoaderElements[i].style.backgroundColor, 'display:', playerLoaderElements[i].style.display);
            console.log('Computed styles:', getComputedStyle(playerLoaderElements[i]).backgroundImage, getComputedStyle(playerLoaderElements[i]).backgroundColor, getComputedStyle(playerLoaderElements[i]).display);
        }

        // Застосовуємо стилі до .activity__loader
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            element.style.filter = whiteFilter;
            element.style.backgroundColor = 'transparent';
            if (Lampa.Storage.get('ani_active')) {
                element.classList.add('active');
                element.style.display = 'block';
            }
            console.log('Стилі застосовано до .activity__loader:', element.style.backgroundImage, 'backgroundColor:', element.style.backgroundColor, 'display:', element.style.display);
            console.log('Computed styles:', getComputedStyle(element).backgroundImage, getComputedStyle(element).backgroundColor, getComputedStyle(element).display);
        }

        // Застосовуємо стилі до .lampac-balanser-loader
        var balanserElements = document.querySelectorAll('.lampac-balanser-loader');
        for (var i = 0; i < balanserElements.length; i++) {
            balanserElements[i].classList.add('custom');
            balanserElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            balanserElements[i].style.filter = whiteFilter;
            balanserElements[i].style.backgroundColor = 'transparent';
            console.log('Стилі застосовано до .lampac-balanser-loader:', balanserElements[i].style.backgroundImage, 'backgroundColor:', balanserElements[i].style.backgroundColor);
            console.log('Computed styles:', getComputedStyle(balanserElements[i]).backgroundImage, getComputedStyle(balanserElements[i]).backgroundColor);
        }

        // Застосовуємо стилі до .loading-layer__ico
        var loadingLayerIco = document.querySelectorAll('.loading-layer__ico');
        for (var i = 0; i < loadingLayerIco.length; i++) {
            loadingLayerIco[i].classList.add('custom');
            loadingLayerIco[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            loadingLayerIco[i].style.filter = whiteFilter;
            loadingLayerIco[i].style.backgroundColor = 'transparent';
            loadingLayerIco[i].style.display = 'block';
            console.log('Стилі застосовано до .loading-layer__ico:', loadingLayerIco[i].style.backgroundImage, 'filter:', loadingLayerIco[i].style.filter, 'backgroundColor:', loadingLayerIco[i].style.backgroundColor, 'display:', loadingLayerIco[i].style.display);
            console.log('Computed styles:', getComputedStyle(loadingLayerIco[i]).backgroundImage, getComputedStyle(loadingLayerIco[i]).backgroundColor, getComputedStyle(loadingLayerIco[i]).display);
        }
    }

    // Функція для вставки стилів для попереднього перегляду
    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
            whiteFilter = '';
        }
        // Оновлено: .activity__loader_prv завжди біла
        var newStyle = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; background-color: transparent !important; filter: ' + whiteFilter + ' !important; }';
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
            console.log('Скинуто стилі для .activity__loader, backgroundColor:', element.style.backgroundColor);
        }
        var balanserElements = document.querySelectorAll('.lampac-balanser-loader');
        for (var i = 0; i < balanserElements.length; i++) {
            balanserElements[i].classList.remove('custom');
            balanserElements[i].style.backgroundImage = '';
            balanserElements[i].style.filter = '';
            balanserElements[i].style.backgroundColor = 'transparent';
            console.log('Скинуто стилі для .lampac-balanser-loader, backgroundColor:', balanserElements[i].style.backgroundColor);
        }
        var playerLoaderElements = document.querySelectorAll('.player-video__loader');
        for (var i = 0; i < playerLoaderElements.length; i++) {
            playerLoaderElements[i].classList.remove('custom');
            playerLoaderElements[i].style.backgroundImage = '';
            playerLoaderElements[i].style.filter = '';
            playerLoaderElements[i].style.backgroundColor = 'transparent';
            playerLoaderElements[i].style.display = 'none';
            console.log('Скинуто стилі для .player-video__loader, backgroundColor:', playerLoaderElements[i].style.backgroundColor);
        }
        var loadingLayerIco = document.querySelectorAll('.loading-layer__ico');
        for (var i = 0; i < loadingLayerIco.length; i++) {
            loadingLayerIco[i].classList.remove('custom');
            loadingLayerIco[i].style.backgroundImage = '';
            loadingLayerIco[i].style.filter = '';
            loadingLayerIco[i].style.backgroundColor = 'transparent';
            loadingLayerIco[i].style.display = 'none';
            console.log('Скинуто стилі для .loading-layer__ico, backgroundColor:', loadingLayerIco[i].style.backgroundColor);
        }
        insert_activity_loader_prv('./img/loader.svg');
        console.log('Стилі завантажувача видалено');
    }

    // Функція для створення стилів модального вікна
    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';
        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        style.textContent = '.ani_modal_root { padding: 1em; }' +
                            '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 140px; padding: 0; }' +
                            '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
                            '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 30px; margin-bottom: 10px; justify-content: center; }' +
                            '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #ffffff !important; font-size: 10px; text-align: center; }' +
                            '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; filter: ' + whiteFilter + '; }' +
                            '.ani_loader_square.focus { border: 0.3em solid #ffffff; transform: scale(1.1); }' +
                            '.ani_loader_square.default { width: 35px; height: 35px; border-radius: 4px; }' +
                            '.ani_loader_square.default img { max-width: 30px; max-height: 30px; object-fit: contain; }' +
                            '.svg_input { width: 410px; height: 35px; border-radius: 8px; border: 2px solid #ddd; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff !important; font-size: 12px; font-weight: bold; text-shadow: 0 0 2px #000; background-color: #353535; }' +
                            '.svg_input.focus { border: 0.3em solid #ffffff; transform: scale(1.1); }' +
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

    // Функція для додавання слухача для .activity__loader_prv
    function addPrvFocusListener() {
        var selectItem = $('.settings-param[data-name="select_ani_mation"]');
        if (selectItem.length === 0) {
            console.log('selectItem не знайдено, повторна спроба через 500 мс');
            setTimeout(addPrvFocusListener, 500);
            return;
        }
        var prvElement = selectItem.find('.activity__loader_prv');
        if (prvElement.length === 0) {
            console.log('prvElement не знайдено');
            return;
        }

        // Оновлено: Додано tabindex
        selectItem.attr('tabindex', '0');
        console.log('Додано tabindex до selectItem');

        // Оновлено: Дебаг-лог для структури DOM
        console.log('DOM selectItem:', selectItem[0].outerHTML);

        // Оновлено: Видалено логіку фокусу, .activity__loader_prv завжди біла
        console.log('Слухач фокуса додано до .activity__loader_prv (не потрібен, колір завжди білий)');
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
                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                        setTimeout(function () {
                            var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                            selectItem.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
                            console.log('Примусово оновлено видимість select_ani_mation:', Lampa.Storage.get('ani_active'));
                            setTimeout(addPrvFocusListener, 100);
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

        // Оновлено: Спостерігач за змінами DOM із додатковими перевірками
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.loading-layer') || node.matches('.player-video'))) {
                                console.log('Виявлено новий елемент:', node.className, node.outerHTML);
                                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                    setTimeout(function () {
                                        setCustomLoader(Lampa.Storage.get('ani_load'));
                                        console.log('setCustomLoader викликано для нового елемента:', node.className);
                                    }, 200);
                                }
                            }
                        });
                        mutation.removedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.loading-layer') || node.matches('.player-video'))) {
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
                                    console.log('Застосовано setCustomLoader для .player-video__loader або .loading-layer__ico');
                                    var playerVideo = document.querySelector('.player-video.video--load');
                                    if (playerVideo) {
                                        console.log('DOM .player-video:', playerVideo.outerHTML);
                                        var loader = playerVideo.querySelector('.player-video__loader');
                                        var loadingIco = playerVideo.querySelector('.loading-layer__ico');
                                        if (loader) {
                                            console.log('.player-video__loader знайдено, backgroundImage:', loader.style.backgroundImage, 'filter:', loader.style.filter, 'backgroundColor:', loader.style.backgroundColor, 'display:', loader.style.display);
                                            console.log('Computed styles:', getComputedStyle(loader).backgroundImage, getComputedStyle(loader).backgroundColor, getComputedStyle(loader).display);
                                        } else {
                                            console.log('.player-video__loader не знайдено');
                                        }
                                        if (loadingIco) {
                                            console.log('.loading-layer__ico знайдено, backgroundImage:', loadingIco.style.backgroundImage, 'filter:', loadingIco.style.filter, 'backgroundColor:', loadingIco.style.backgroundColor, 'display:', loadingIco.style.display);
                                            console.log('Computed styles:', getComputedStyle(loadingIco).backgroundImage, getComputedStyle(loadingIco).backgroundColor, getComputedStyle(loadingIco).display);
                                        } else {
                                            console.log('.loading-layer__ico не знайдено');
                                        }
                                    } else {
                                        console.log('.player-video.video--load не знайдено');
                                    }
                                    var loadingLayer = document.querySelector('.loading-layer');
                                    if (loadingLayer) {
                                        console.log('DOM .loading-layer:', loadingLayer.outerHTML);
                                    } else {
                                        console.log('.loading-layer не знайдено');
                                    }
                                }, 200);
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

        // Періодична ініціалізація слухачів <video>
        setInterval(function () {
            var videoElement = document.querySelector('video');
            if (videoElement && !videoElement.dataset.listenersAdded) {
                ['play', 'playing', 'waiting', 'stalled', 'loadstart', 'loadeddata'].forEach(function (eventType) {
                    videoElement.addEventListener(eventType, function (e) {
                        console.log('Video element event:', e.type);
                        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                            setTimeout(function () {
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                                console.log('Застосовано setCustomLoader для video event:', e.type);
                                var playerVideo = document.querySelector('.player-video.video--load');
                                if (playerVideo) {
                                    console.log('DOM .player-video:', playerVideo.outerHTML);
                                    var loader = playerVideo.querySelector('.player-video__loader');
                                    var loadingIco = playerVideo.querySelector('.loading-layer__ico');
                                    if (loader) {
                                        console.log('.player-video__loader знайдено, backgroundImage:', loader.style.backgroundImage, 'filter:', loader.style.filter, 'backgroundColor:', loader.style.backgroundColor, 'display:', loader.style.display);
                                        console.log('Computed styles:', getComputedStyle(loader).backgroundImage, getComputedStyle(loader).backgroundColor, getComputedStyle(loader).display);
                                    } else {
                                        console.log('.player-video__loader не знайдено');
                                    }
                                    if (loadingIco) {
                                        console.log('.loading-layer__ico знайдено, backgroundImage:', loadingIco.style.backgroundImage, 'filter:', loadingIco.style.filter, 'backgroundColor:', loadingIco.style.backgroundColor, 'display:', loadingIco.style.display);
                                        console.log('Computed styles:', getComputedStyle(loadingIco).backgroundImage, getComputedStyle(loadingIco).backgroundColor, getComputedStyle(loadingIco).display);
                                    } else {
                                        console.log('.loading-layer__ico не знайдено');
                                    }
                                } else {
                                    console.log('.player-video.video--load не знайдено');
                                }
                                var loadingLayer = document.querySelector('.loading-layer');
                                if (loadingLayer) {
                                    console.log('DOM .loading-layer:', loadingLayer.outerHTML);
                                } else {
                                    console.log('.loading-layer не знайдено');
                                }
                            }, 200);
                        }
                    });
                });
                videoElement.dataset.listenersAdded = true;
                console.log('Додано слухачі подій для <video> елемента');
            }
        }, 1000);

        // Оновлено: Періодична перевірка з частотою 100 мс
        setInterval(function () {
            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                var playerVideo = document.querySelector('.player-video.video--load');
                if (playerVideo) {
                    console.log('DOM .player-video:', playerVideo.outerHTML);
                    var loader = playerVideo.querySelector('.player-video__loader');
                    var loadingIco = playerVideo.querySelector('.loading-layer__ico');
                    if (loader) {
                        var computedBg = getComputedStyle(loader).backgroundImage;
                        var computedDisplay = getComputedStyle(loader).display;
                        if (computedBg.indexOf('lampa-main/img/loader.svg') !== -1) {
                            console.log('Виявлено стандартну іконку в .player-video__loader, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        } else if (getComputedStyle(loader).backgroundColor !== 'transparent') {
                            console.log('Виявлено некоректний backgroundColor в .player-video__loader, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        } else if (computedDisplay === 'none') {
                            console.log('Виявлено display: none в .player-video__loader, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        }
                    }
                    if (loadingIco) {
                        var computedBgIco = getComputedStyle(loadingIco).backgroundImage;
                        var computedDisplayIco = getComputedStyle(loadingIco).display;
                        if (computedBgIco.indexOf('lampa-main/img/loader.svg') !== -1) {
                            console.log('Виявлено стандартну іконку в .loading-layer__ico, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        } else if (getComputedStyle(loadingIco).backgroundColor !== 'transparent') {
                            console.log('Виявлено некоректний backgroundColor в .loading-layer__ico, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        } else if (computedDisplayIco === 'none') {
                            console.log('Виявлено display: none в .loading-layer__ico, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        }
                    } else {
                        console.log('Перевірка .loading-layer__ico: null');
                    }
                } else {
                    console.log('Перевірка .player-video.video--load: null');
                }
                var loadingLayer = document.querySelector('.loading-layer');
                if (loadingLayer) {
                    console.log('DOM .loading-layer:', loadingLayer.outerHTML);
                } else {
                    console.log('.loading-layer не знайдено');
                }
            }
        }, 100);

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
                }, 200);
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
                }, 200);
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
                }, 200);
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
