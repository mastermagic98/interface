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

    // Функція для отримання RGB для SVG-фільтра (білий для #353535, інакше mainColor)
    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') {
            return { r: 255, g: 255, b: 255 }; // Білий колір (#ffffff)
        }
        return hexToRgb(mainColor);
    }

    // Функція для створення SVG для дефолтної іконки (завжди біла)
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
        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        var newStyle = '.activity__loader { display: none !important; }' +
                       '.activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: rgba(0, 0, 0, 0) !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position-x: 50%; background-position-y: 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; filter: ' + filterValue + '; z-index: 9999 !important; }' +
                       '.lampac-balanser-loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; filter: ' + whiteFilter + ' !important; }' +
                       '.player-video__loader, .player-video.video--load .player-video__loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; filter: ' + whiteFilter + ' !important; }';
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            if (Lampa.Storage.get('ani_active')) {
                element.classList.add('active');
                element.style.display = 'block';
            }
        }
        var balanserElements = document.querySelectorAll('.lampac-balanser-loader');
        for (var i = 0; i < balanserElements.length; i++) {
            balanserElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            balanserElements[i].style.backgroundRepeat = 'no-repeat';
            balanserElements[i].style.backgroundPosition = '50% 50%';
            balanserElements[i].style.backgroundSize = 'contain';
            balanserElements[i].style.filter = whiteFilter;
        }
        var playerLoaderElements = document.querySelectorAll('.player-video__loader');
        for (var i = 0; i < playerLoaderElements.length; i++) {
            playerLoaderElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            playerLoaderElements[i].style.backgroundRepeat = 'no-repeat';
            playerLoaderElements[i].style.backgroundPosition = '50% 50%';
            playerLoaderElements[i].style.backgroundSize = '80% 80%';
            playerLoaderElements[i].style.filter = whiteFilter;
        }
    }

    // Функція для вставки стилів для попереднього перегляду
    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        var filterValue = '';
        // Якщо це стандартна іконка або ani_load порожнє, використовуємо білу іконку без фільтра
        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
        } else {
            // Для кастомної іконки завжди застосовуємо білий колір (#ffffff)
            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        }
        var newStyle = '.activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; filter: ' + filterValue + '; }' +
                       '.activity__loader_prv.focus { filter: url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22focus_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#focus_color"); }';
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
            element.style.backgroundImage = '';
        }
        var balanserElements = document.querySelectorAll('.lampac-balanser-loader');
        for (var i = 0; i < balanserElements.length; i++) {
            balanserElements[i].style.backgroundImage = '';
            balanserElements[i].style.backgroundRepeat = '';
            balanserElements[i].style.backgroundPosition = '';
            balanserElements[i].style.backgroundSize = 'contain';
            balanserElements[i].style.filter = '';
        }
        var playerLoaderElements = document.querySelectorAll('.player-video__loader');
        for (var i = 0; i < playerLoaderElements.length; i++) {
            playerLoaderElements[i].style.backgroundImage = '';
            playerLoaderElements[i].style.backgroundRepeat = '';
            playerLoaderElements[i].style.backgroundPosition = '';
            playerLoaderElements[i].style.backgroundSize = '80% 80%';
            playerLoaderElements[i].style.filter = '';
        }
        // Відображаємо стандартну іконку для .activity__loader_prv
        insert_activity_loader_prv('./img/loader.svg');
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
            // Якщо елемент ще не існує, чекаємо і пробуємо знову
            setTimeout(addPrvFocusListener, 500);
            return;
        }
        var prvElement = selectItem.find('.activity__loader_prv');
        if (prvElement.length === 0) return;

        // Функція для застосування звичайного кольору
        function applyNormalColor() {
            var currentUrl = prvElement.css('background-image').replace(/^url\(["']?|["']?\)$/g, '');
            if (!currentUrl || currentUrl === applyDefaultLoaderColor().src) {
                // Для стандартної іконки фільтр не застосовується
                prvElement.css('filter', '');
            } else {
                // Для кастомної іконки застосовуємо білий колір (#ffffff)
                var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
                prvElement.css('filter', filterValue);
            }
            prvElement.removeClass('focus');
        }

        // Функція для застосування кольору фокуса (#ffffff)
        function applyFocusColor() {
            var currentUrl = prvElement.css('background-image').replace(/^url\(["']?|["']?\)$/g, '');
            if (!currentUrl || currentUrl === applyDefaultLoaderColor().src) {
                // Для стандартної іконки фільтр не потрібен (вже біла)
                prvElement.css('filter', '');
            } else {
                // Для кастомної іконки застосовуємо білий колір (#ffffff)
                var focusFilterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22focus_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#focus_color")';
                prvElement.css('filter', focusFilterValue);
            }
            prvElement.addClass('focus');
        }

        // Слухач фокуса на батьківському елементі
        selectItem.on('focus', function () {
            applyFocusColor();
        });

        // Слухач втрати фокуса на батьківському елементі
        selectItem.on('blur', function () {
            applyNormalColor();
        });

        console.log('Слухач фокуса додано до .activity__loader_prv');
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
                        } else {
                            insert_activity_loader_prv('./img/loader.svg');
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
                            insert_activity_loader_prv(Lampa.Storage.get('ani_load', './img/loader.svg'));
                            // Додаємо слухача фокуса після рендеру
                            setTimeout(addPrvFocusListener, 100);
                        }, 0);
                    }
                },
                onChange: function () {
                    if (!window.svg_loaders || window.svg_loaders.length === 0) return;
                    if (!Lampa.Template.get('ani_modal')) {
                        Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');
                    }
                    create_ani_modal();

                    // Групуємо SVG-завантажувачі по 6 у ряд
                    var groupedLoaders = chunkArray(window.svg_loaders, 6);
                    var svgContent = groupedLoaders.map(function(group) {
                        var groupContent = group.map(function(loader, index) {
                            return createSvgHtml(loader, groupedLoaders.indexOf(group) * 6 + index + 1);
                        }).join('');
                        return '<div class="ani_loader_row">' + groupContent + '</div>';
                    });

                    // Розподіляємо групи між двома колонками
                    var midPoint = Math.ceil(svgContent.length / 2);
                    var leftColumn = svgContent.slice(0, midPoint).join('');
                    var rightColumn = svgContent.slice(midPoint).join('');

                    // Додаємо кнопку "За замовчуванням" і поле для введення SVG
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
                    if (Lampa.Storage.get('ani_active')) {
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
                Lampa.Settings.render();
            }
        });

        // Слухач зміни кольору з color.js
        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'color_plugin_main_color') {
                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                } else {
                    remove_activity_loader();
                }
                // Оновлюємо стилі модального вікна при зміні кольору
                if (document.getElementById('aniload')) {
                    create_ani_modal();
                    var modal = document.querySelector('.ani_modal_root');
                    if (modal) {
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
                        modal.innerHTML = $('<div>' + topRowHtml + modalContent + '</div>').find('.ani_modal_root').html();
                    }
                }
            }
        });

        // Спостерігач за додаванням/видаленням елементів .activity__loader, .lampac-balanser-loader, .player-video__loader та змінами класів
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader'))) {
                                console.log('Виявлено новий елемент:', node.className);
                                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                    setCustomLoader(Lampa.Storage.get('ani_load'));
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
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                            }
                        } else if (mutation.target.classList.contains('player-video') && !mutation.target.classList.contains('video--load')) {
                            console.log('Виявлено видалення класу video--load з .player-video');
                            remove_activity_loader();
                        }
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }, 1000);

        // Слухач подій full для керування завантажувачем
        Lampa.Listener.follow('full', function (e) {
            var element = document.querySelector('.activity__loader');
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (e.type === 'complete' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
            // Додатково застосовуємо кастомний завантажувач для .player-video__loader
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setCustomLoader(Lampa.Storage.get('ani_load'));
            }
        });

        // Слухач подій activity для керування завантажувачем
        Lampa.Listener.follow('activity', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.type === 'loaded' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
            // Додатково застосовуємо кастомний завантажувач для .player-video__loader
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setCustomLoader(Lampa.Storage.get('ani_load'));
            }
        });

        // Слухач подій push для керування завантажувачем
        Lampa.Activity.listener.follow('push', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.status === 'ready' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
            // Додатково застосовуємо кастомний завантажувач для .player-video__loader
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setCustomLoader(Lampa.Storage.get('ani_load'));
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
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }
    }

    // Функція для застосування налаштувань за темою
    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
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
