(function () {
    'use strict';
    Lampa.Lang.add({
        params_ani_on: { ru: 'Включить', en: 'Enable', uk: 'Увімкнути' },
        params_ani_select: { ru: 'Выбор анимации', en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name: { ru: 'Анимация Загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        default_loader: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_svg_input: { ru: 'Введи URL SVG', en: 'Enter SVG URL', uk: 'Введи URL SVG' },
        svg_input_hint: { ru: 'Используйте URL SVG, например https://example.com/loader.svg', en: 'Use SVG URL, for example https://example.com/loader.svg', uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' }
    });
    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }
    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') {
            return { r: 255, g: 255, b: 255 };
        }
        return hexToRgb(mainColor);
    }
    function applyDefaultLoaderColor() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
                         '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
                         '<circle cx="50" cy="50" fill="none" stroke="currentColor" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
                         ' <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
                         '</circle>' +
                         '</svg>';
        var encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encodedSvg };
    }
    function setCustomLoader(url) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');

        var newStyle = 'body .activity__loader { display: none !important; background-image: none !important; }' +
                       'body .activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: transparent !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position-x: 50%; background-position-y: 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; color: ' + mainColor + ' !important; filter: none !important; z-index: 9999 !important; }' +
                       'body .lampac-balanser-loader.custom { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; background-color: transparent !important; color: ' + mainColor + ' !important; filter: none !important; }' +
                       'body .player-video .player-video__loader.custom, body .player-video.video--load .player-video__loader.custom { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; background-color: transparent !important; color: ' + mainColor + ' !important; filter: none !important; backdrop-filter: none !important; z-index: 9999 !important; }' +
                       'body .player-video .player-video__loader:not(.custom) { background-image: none !important; display: none !important; }' +
                       'body .loading-layer .loading-layer__ico.custom { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; background-color: transparent !important; color: ' + mainColor + ' !important; filter: none !important; width: 1.9em !important; height: 1.9em !important; }' +
                       'body .loading-layer .loading-layer__ico:not(.custom) { background-image: none !important; display: none !important; }' +
                       'body .player-video { position: relative !important; width: 100% !important; height: 100vh !important; }' +
                       'body .player-video__youtube-needclick { position: relative !important; width: 100% !important; height: 100% !important; }' +
                       'body .player-video__youtube-needclick > div.custom { position: absolute !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; -webkit-transform: translate(-50%, -50%) !important; text-indent: -9999px; background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; background-color: transparent !important; color: ' + mainColor + ' !important; filter: none !important; z-index: 9999 !important; width: 8em !important; height: 8em !important; }' +
                       'body .modal-loading.custom { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; background-color: transparent !important; color: ' + mainColor + ' !important; filter: none !important; display: block !important; z-index: 9999 !important; }';

        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');

        $('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading')
            .addClass('custom')
            .css('color', mainColor);

        var activity = document.querySelector('.activity__loader');
        if (activity && Lampa.Storage.get('ani_active')) {
            activity.classList.add('active');
            activity.style.display = 'block';
        }
    }
    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
        }
        var newStyle = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; background-color: transparent !important; color: #ffffff !important; filter: none !important; -webkit-filter: none !important; }' +
                       'body.glass--style .settings-param.focus .settings-folder__icon .activity__loader_prv { -webkit-filter: none !important; filter: none !important; }';
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
    }
    function remove_activity_loader() {
        $('#aniload-id').remove();
        $('#aniload-id-prv').remove();
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
            element.style.backgroundImage = '';
            element.style.color = '';
            element.style.filter = '';
            element.style.backgroundColor = 'transparent';
        }
        var balanserElements = document.querySelectorAll('.lampac-balanser-loader');
        for (var i = 0; i < balanserElements.length; i++) {
            balanserElements[i].classList.remove('custom');
            balanserElements[i].style.backgroundImage = '';
            balanserElements[i].style.color = '';
            balanserElements[i].style.filter = '';
            balanserElements[i].style.backgroundColor = 'transparent';
        }
        var playerLoaderElements = document.querySelectorAll('.player-video__loader');
        for (var i = 0; i < playerLoaderElements.length; i++) {
            playerLoaderElements[i].classList.remove('custom');
            playerLoaderElements[i].style.backgroundImage = '';
            playerLoaderElements[i].style.color = '';
            playerLoaderElements[i].style.filter = '';
            playerLoaderElements[i].style.backgroundColor = 'transparent';
            playerLoaderElements[i].style.display = 'none';
        }
        var loadingLayerIco = document.querySelectorAll('.loading-layer__ico');
        for (var i = 0; i < loadingLayerIco.length; i++) {
            loadingLayerIco[i].classList.remove('custom');
            loadingLayerIco[i].style.backgroundImage = '';
            loadingLayerIco[i].style.color = '';
            loadingLayerIco[i].style.filter = '';
            loadingLayerIco[i].style.backgroundColor = 'transparent';
            loadingLayerIco[i].style.display = 'none';
        }
        var youtubeNeedclickElements = document.querySelectorAll('.player-video__youtube-needclick > div');
        for (var i = 0; i < youtubeNeedclickElements.length; i++) {
            youtubeNeedclickElements[i].classList.remove('custom');
            youtubeNeedclickElements[i].style.textIndent = '';
            youtubeNeedclickElements[i].style.backgroundImage = '';
            youtubeNeedclickElements[i].style.backgroundRepeat = '';
            youtubeNeedclickElements[i].style.backgroundPosition = '';
            youtubeNeedclickElements[i].style.backgroundSize = '';
            youtubeNeedclickElements[i].style.backgroundColor = '';
            youtubeNeedclickElements[i].style.color = '';
            youtubeNeedclickElements[i].style.filter = '';
            youtubeNeedclickElements[i].style.zIndex = '';
            youtubeNeedclickElements[i].style.width = '';
            youtubeNeedclickElements[i].style.height = '';
            youtubeNeedclickElements[i].style.position = '';
            youtubeNeedclickElements[i].style.left = '';
            youtubeNeedclickElements[i].style.top = '';
            youtubeNeedclickElements[i].style.transform = '';
            youtubeNeedclickElements[i].style.webkitTransform = '';
            youtubeNeedclickElements[i].textContent = Lampa.Lang.translate('loading') || 'Завантаження...';
        }
        var modalLoadingElements = document.querySelectorAll('.modal-loading');
        for (var i = 0; i < modalLoadingElements.length; i++) {
            modalLoadingElements[i].classList.remove('custom');
            modalLoadingElements[i].style.backgroundImage = 'url("../img/loader.svg")';
            modalLoadingElements[i].style.backgroundRepeat = 'no-repeat';
            modalLoadingElements[i].style.backgroundPosition = '50% 50%';
            modalLoadingElements[i].style.backgroundSize = '';
            modalLoadingElements[i].style.backgroundColor = '';
            modalLoadingElements[i].style.color = '';
            modalLoadingElements[i].style.filter = '';
            modalLoadingElements[i].style.display = '';
            modalLoadingElements[i].style.zIndex = '';
        }
        insert_activity_loader_prv('./img/loader.svg');
    }
    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var focusBorderColor = mainColor.toLowerCase() === '#353535' ? '#ffffff' : 'var(--main-color)';
        style.textContent = '.ani_modal_root { padding: 1em; }' +
                            '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0; }' +
                            '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
                            '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 25px; justify-content: center; }' +
                            '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #ffffff !important; font-size: 10px; text-align: center; }' +
                            '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; color: ' + mainColor + '; }' +
                            '.ani_loader_square.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
                            '.ani_loader_square.default { width: 35px; height: 35px; border-radius: 4px; }' +
                            '.ani_loader_square.default img { max-width: 30px; max-height: 30px; object-fit: contain; }' +
                            '.svg_input { width: 252px; height: 35px; border-radius: 8px; border: 2px solid #ddd; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff !important; font-size: 12px; font-weight: bold; text-shadow: 0 0 2px #000; background-color: #353535; }' +
                            '.svg_input.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
                            '.svg_input .label { position: absolute; top: 1px; font-size: 10px; }' +
                            '.svg_input .value { position: absolute; bottom: 1px; font-size: 10px; }';
        document.head.appendChild(style);
    }
    function createSvgHtml(src, index) {
        var className = 'ani_loader_square selector';
        var content = '<img src="' + src + '" alt="Loader ' + index + '">';
        return '<div class="' + className + '" tabindex="0" title="Loader ' + index + '">' + content + '</div>';
    }
    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }
    function isValidSvgUrl(url) {
        return /^https?:\/\/.*\.svg$/.test(url);
    }
    function addPrvFocusListener() {}
    function aniLoad() {
        var icon_plugin = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" calcMode="spline" dur="1s" keySplines=".36,.6,.31,1;.36,.6,.31,1" values="0 12 12;180 12 12;360 12 12" repeatCount="indefinite"/></g></svg>';
        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon_plugin
            });
        } catch (e) {}
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
                        }, 50);
                    }
                }
            });
        } catch (e) {}
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
                    var defaultButton = '<div class="ani_loader_square selector default" tabindex="0" title="' + Lampa.Lang.translate('default_loader') + '"><img src="' + defaultLoader.src + '"></div>';
                    var svgValue = Lampa.Storage.get('ani_load_custom_svg', '') || 'Наприклад https://example.com/loader.svg';
                    var inputHtml = '<div class="ani_loader_square selector svg_input" tabindex="0" style="width: 252px;">' +
                                    '<div class="label">' + Lampa.Lang.translate('custom_svg_input') + '</div>' +
                                    '<div class="value">' + svgValue + '</div>' +
                                    '</div>';
                    var topRowHtml = '<div style="display: flex; gap: 20px; padding: 0; justify-content: center; margin-bottom: 25px;">' +
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
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.loading-layer') || node.matches('.player-video') || node.matches('.player-video__youtube-needclick') || node.matches('.modal-loading'))) {
                                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                    setTimeout(function () {
                                        setCustomLoader(Lampa.Storage.get('ani_load'));
                                    }, 200);
                                }
                            }
                        });
                        mutation.removedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.loading-layer') || node.matches('.player-video') || node.matches('.player-video__youtube-needclick') || node.matches('.modal-loading'))) {
                                remove_activity_loader();
                            }
                        });
                    } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (mutation.target.classList.contains('player-video') && mutation.target.classList.contains('video--load')) {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                setTimeout(function () {
                                    setCustomLoader(Lampa.Storage.get('ani_load'));
                                }, 200);
                            }
                        } else if (mutation.target.classList.contains('player-video') && !mutation.target.classList.contains('video--load')) {
                            var playerLoader = document.querySelector('.player-video__loader');
                            if (playerLoader) {
                                playerLoader.style.display = 'none';
                            }
                            var youtubeNeedclick = document.querySelector('.player-video__youtube-needclick > div');
                            if (youtubeNeedclick) {
                                youtubeNeedclick.style.display = 'none';
                            }
                            var modalLoading = document.querySelector('.modal-loading');
                            if (modalLoading) {
                                modalLoading.style.display = 'none';
                            }
                        }
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }, 500);
        setInterval(function () {
            var videoElement = document.querySelector('video');
            if (videoElement && !videoElement.dataset.listenersAdded) {
                ['play', 'playing', 'waiting', 'stalled', 'loadstart', 'loadeddata'].forEach(function (eventType) {
                    videoElement.addEventListener(eventType, function (e) {
                        var playerLoader = document.querySelector('.player-video__loader');
                        var youtubeNeedclick = document.querySelector('.player-video__youtube-needclick > div');
                        var modalLoading = document.querySelector('.modal-loading');
                        if (playerLoader || youtubeNeedclick || modalLoading) {
                            if (e.type === 'waiting' || e.type === 'loadstart' || e.type === 'stalled') {
                                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                    var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
                                    if (playerLoader) {
                                        playerLoader.classList.add('custom');
                                        playerLoader.style.backgroundImage = 'url(\'' + Lampa.Storage.get('ani_load') + '\')';
                                        playerLoader.style.color = mainColor;
                                        playerLoader.style.filter = 'none';
                                        playerLoader.style.backgroundColor = 'transparent';
                                        playerLoader.style.display = 'block';
                                    }
                                    if (youtubeNeedclick) {
                                        youtubeNeedclick.classList.add('custom');
                                        youtubeNeedclick.textContent = '';
                                        youtubeNeedclick.style.textIndent = '-9999px';
                                        youtubeNeedclick.style.backgroundImage = 'url(\'' + Lampa.Storage.get('ani_load') + '\')';
                                        youtubeNeedclick.style.backgroundRepeat = 'no-repeat';
                                        youtubeNeedclick.style.backgroundPosition = '50% 50%';
                                        youtubeNeedclick.style.backgroundSize = '80% 80%';
                                        youtubeNeedclick.style.backgroundColor = 'transparent';
                                        youtubeNeedclick.style.color = mainColor;
                                        youtubeNeedclick.style.filter = 'none';
                                        youtubeNeedclick.style.width = '8em';
                                        youtubeNeedclick.style.height = '8em';
                                        youtubeNeedclick.style.position = 'absolute';
                                        youtubeNeedclick.style.left = '50%';
                                        youtubeNeedclick.style.top = '50%';
                                        youtubeNeedclick.style.transform = 'translate(-50%, -50%)';
                                        youtubeNeedclick.style.webkitTransform = 'translate(-50%, -50%)';
                                        youtubeNeedclick.style.display = 'block';
                                    }
                                    if (modalLoading) {
                                        modalLoading.classList.add('custom');
                                        modalLoading.style.backgroundImage = 'url(\'' + Lampa.Storage.get('ani_load') + '\')';
                                        modalLoading.style.backgroundRepeat = 'no-repeat';
                                        modalLoading.style.backgroundPosition = '50% 50%';
                                        modalLoading.style.backgroundSize = 'contain';
                                        modalLoading.style.backgroundColor = 'transparent';
                                        modalLoading.style.color = mainColor;
                                        modalLoading.style.filter = 'none';
                                        modalLoading.style.display = 'block';
                                        modalLoading.style.zIndex = '9999';
                                    }
                                }
                            } else if (e.type === 'playing' || e.type === 'loadeddata') {
                                if (playerLoader) {
                                    playerLoader.style.display = 'none';
                                }
                                if (youtubeNeedclick) {
                                    youtubeNeedclick.style.display = 'none';
                                }
                                if (modalLoading) {
                                    modalLoading.style.display = 'none';
                                }
                            }
                        }
                    });
                });
                videoElement.dataset.listenersAdded = true;
            }
        }, 1000);
        setInterval(function () {
            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                var playerVideo = document.querySelector('.player-video.video--load');
                if (playerVideo) {
                    var loader = playerVideo.querySelector('.player-video__loader');
                    if (loader && getComputedStyle(loader).backgroundImage.includes('lampa-main/img/loader.svg')) {
                        setCustomLoader(Lampa.Storage.get('ani_load'));
                    }
                    var youtubeNeedclick = playerVideo.querySelector('.player-video__youtube-needclick > div');
                    if (youtubeNeedclick && (getComputedStyle(youtubeNeedclick).backgroundImage.includes('lampa-main/img/loader.svg') || !getComputedStyle(youtubeNeedclick).backgroundImage.includes(Lampa.Storage.get('ani_load')))) {
                        setCustomLoader(Lampa.Storage.get('ani_load'));
                    }
                    var modalLoading = playerVideo.querySelector('.modal-loading');
                    if (modalLoading && (getComputedStyle(modalLoading).backgroundImage.includes('lampa-main/img/loader.svg') || !getComputedStyle(modalLoading).backgroundImage.includes(Lampa.Storage.get('ani_load')))) {
                        setCustomLoader(Lampa.Storage.get('ani_load'));
                    }
                }
                var modalLoading = document.querySelector('.modal-loading');
                if (modalLoading && (getComputedStyle(modalLoading).backgroundImage.includes('lampa-main/img/loader.svg') || !getComputedStyle(modalLoading).backgroundImage.includes(Lampa.Storage.get('ani_load')))) {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                }
            }
        }, 100);
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
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                }, 200);
            }
        });
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
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                }, 200);
            }
        });
        Lampa.Listener.follow('activity', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.status === 'ready' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                }, 200);
            }
        });
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'back') {
                var element = document.querySelector('.activity__loader');
                if (element) {
                    element.classList.remove('active');
                    element.style.display = 'none';
                }
                var modalLoading = document.querySelector('.modal-loading');
                if (modalLoading) {
                    modalLoading.style.display = 'none';
                }
            }
        });
        setInterval(function () {
            var element = document.querySelector('.activity__loader');
            if (element && element.classList.contains('active')) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        }, 500);
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }
    }
    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }
    }
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
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'accent_color_selected' || e.name === 'color_plugin_main_color') {
            byTheme();
        }
    });
    window.byTheme = byTheme;
})();
