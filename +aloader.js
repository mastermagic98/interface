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
 
+    function buildColorFilter(rgb) {
+        return 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
+    }
+
+    function buildWhiteFilter() {
+        return 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white_color")';
+    }
+
+    function buildFilterValue(colorEnabled, mainColor) {
+        if (colorEnabled) {
+            var rgb = getFilterRgb(mainColor);
+            return buildColorFilter(rgb);
+        }
+        return buildWhiteFilter();
+    }
+
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
 
     function setCustomLoader(url) {
         console.log('setCustomLoader called with URL:', url);
         $('#aniload-id').remove();
 
         var colorEnabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
         var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#353535') : '#ffffff';
-        var rgb = getFilterRgb(mainColor);
+        var filterValue = buildFilterValue(colorEnabled, mainColor);
 
         var escapedUrl = url.replace(/'/g, "\\'");
 
-        var filterValue = '';
-        if (colorEnabled) {
-            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
-        }
-
         var newStyle = 'body .activity__loader { display: none !important; background-image: none !important; }' +
                        'body .activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: transparent !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position-x: 50%; background-position-y: 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; filter: ' + filterValue + '; z-index: 9999 !important; }' +
                        'body .lampac-balanser-loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; background-color: transparent !important; filter: ' + filterValue + ' !important; }' +
                        'body .player-video .player-video__loader, body .player-video.video--load .player-video__loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; background-color: transparent !important; filter: ' + filterValue + ' !important; backdrop-filter: none !important; z-index: 9999 !important; }' +
                        'body .player-video .player-video__loader:not(.custom) { background-image: none !important; display: none !important; }' +
                        'body .loading-layer .loading-layer__ico { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; background-color: transparent !important; filter: ' + filterValue + ' !important; width: 1.9em !important; height: 1.9em !important; }' +
                        'body .loading-layer .loading-layer__ico:not(.custom) { background-image: none !important; display: none !important; }' +
                        'body .player-video { position: relative !important; width: 100% !important; height: 100vh !important; }' +
                        'body .player-video__youtube-needclick { position: relative !important; width: 100% !important; height: 100% !important; }' +
                        'body .player-video__youtube-needclick > div { position: absolute !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; -webkit-transform: translate(-50%, -50%) !important; text-indent: -9999px; background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; background-color: transparent !important; filter: ' + filterValue + ' !important; z-index: 9999 !important; width: 8em !important; height: 8em !important; }' +
                        'body .modal-loading { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; background-color: transparent !important; filter: ' + filterValue + ' !important; display: block !important; z-index: 9999 !important; }';
 
         $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');
 
         var playerLoaderElements = document.querySelectorAll('.player-video__loader');
         for (var i = 0; i < playerLoaderElements.length; i++) {
             playerLoaderElements[i].classList.add('custom');
             playerLoaderElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
             playerLoaderElements[i].style.filter = filterValue;
             playerLoaderElements[i].style.backgroundColor = 'transparent';
         }
 
         var element = document.querySelector('.activity__loader');
         if (element) {
             element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
@@ -121,58 +132,51 @@
             youtubeNeedclickElements[i].style.top = '50%';
             youtubeNeedclickElements[i].style.transform = 'translate(-50%, -50%)';
             youtubeNeedclickElements[i].style.webkitTransform = 'translate(-50%, -50%)';
         }
 
         var modalLoadingElements = document.querySelectorAll('.modal-loading');
         for (var i = 0; i < modalLoadingElements.length; i++) {
             modalLoadingElements[i].classList.add('custom');
             modalLoadingElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
             modalLoadingElements[i].style.backgroundRepeat = 'no-repeat';
             modalLoadingElements[i].style.backgroundPosition = '50% 50%';
             modalLoadingElements[i].style.backgroundSize = 'contain';
             modalLoadingElements[i].style.backgroundColor = 'transparent';
             modalLoadingElements[i].style.filter = filterValue;
             modalLoadingElements[i].style.display = 'block';
             modalLoadingElements[i].style.zIndex = '9999';
             console.log('Applied custom loader to .modal-loading:', modalLoadingElements[i], 'URL:', escapedUrl);
         }
     }
 
     function insert_activity_loader_prv(escapedUrl) {
         $('#aniload-id-prv').remove();
 
         var colorEnabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
         var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#353535') : '#ffffff';
-        var rgb = getFilterRgb(mainColor);
-
-        var filterValue = '';
-        if (colorEnabled) {
-            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
-        } else {
-            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white_color")';
-        }
+        var filterValue = buildFilterValue(colorEnabled, mainColor);
 
         if (!escapedUrl || escapedUrl === './img/loader.svg') {
             var defaultLoader = applyDefaultLoaderColor();
             escapedUrl = defaultLoader.src;
             filterValue = '';
         }
 
         var newStyle = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; background-color: transparent !important; filter: ' + filterValue + ' !important; -webkit-filter: ' + filterValue + ' !important; }' +
                        'body.glass--style .settings-param.focus .settings-folder__icon .activity__loader_prv { -webkit-filter: none !important; filter: none !important; }';
 
         $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
 
         setTimeout(function checkPrvElement() {
             var prvElement = document.querySelector('.settings-param[data-name="select_ani_mation"] .activity__loader_prv');
             if (prvElement) {
                 prvElement.style.filter = filterValue;
                 prvElement.style.webkitFilter = filterValue;
             } else {
                 setTimeout(checkPrvElement, 500);
             }
         }, 100);
     }
 
     function remove_activity_loader() {
         console.log('remove_activity_loader called');
@@ -238,56 +242,51 @@
         }
 
         var modalLoadingElements = document.querySelectorAll('.modal-loading');
         for (var i = 0; i < modalLoadingElements.length; i++) {
             modalLoadingElements[i].classList.remove('custom');
             modalLoadingElements[i].style.backgroundImage = 'url("../img/loader.svg")';
             modalLoadingElements[i].style.backgroundRepeat = 'no-repeat';
             modalLoadingElements[i].style.backgroundPosition = '50% 50%';
             modalLoadingElements[i].style.backgroundSize = '';
             modalLoadingElements[i].style.backgroundColor = '';
             modalLoadingElements[i].style.filter = '';
             modalLoadingElements[i].style.display = '';
             modalLoadingElements[i].style.zIndex = '';
             console.log('Reset .modal-loading to default:', modalLoadingElements[i]);
         }
 
         insert_activity_loader_prv('./img/loader.svg');
     }
 
     function create_ani_modal() {
         var style = document.createElement('style');
         style.id = 'aniload';
 
         var colorEnabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
         var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#353535') : '#ffffff';
-        var rgb = getFilterRgb(mainColor);
-
-        var filterValue = '';
-        if (colorEnabled) {
-            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
-        }
+        var filterValue = buildFilterValue(colorEnabled, mainColor);
 
         var focusBorderColor = colorEnabled ? (mainColor.toLowerCase() === '#353535' ? '#ffffff' : mainColor) : '#ffffff';
 
         style.textContent = '.ani_modal_root { padding: 1em; }' +
                             '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0; }' +
                             '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
                             '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 25px; justify-content: center; }' +
                             '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #ffffff !important; font-size: 10px; text-align: center; }' +
                             '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; filter: ' + filterValue + '; }' +
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
@@ -374,51 +373,51 @@
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
-                    var defaultButton = '<div class="ani_loader_square selector default" tabindex="0" title="' + Lampa.Lang.translate('default_loader') + '"><img src="' + defaultLoader.src + '" style="filter: ' + defaultLoader.filter + ';"></div>';
+                    var defaultButton = '<div class="ani_loader_square selector default" tabindex="0" title="' + Lampa.Lang.translate('default_loader') + '"><img src="' + defaultLoader.src + '" style="filter: ' + filterValue + ';"></div>';
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
                                            console.log('Custom SVG selected:', value);
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
                                        console.log('Default loader selected');
                                        remove_activity_loader();
                                    } else {
                                        var imgElement = selectedElement.querySelector('img');
                                        srcValue = imgElement ? imgElement.getAttribute('src') : Lampa.Storage.get('ani_load', './img/loader.svg');
                                        Lampa.Storage.set('ani_load', srcValue);
                                        console.log('Predefined SVG selected:', srcValue);
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
                                    console.log('MutationObserver: Detected new loader element:', node);
                                    setTimeout(function () {
                                        setCustomLoader(Lampa.Storage.get('ani_load'));
                                    }, 200);
                                }
                            }
                        });
                        mutation.removedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.loading-layer') || node.matches('.player-video') || node.matches('.player-video__youtube-needclick') || node.matches('.modal-loading'))) {
                                console.log('MutationObserver: Removed loader element:', node);
                                remove_activity_loader();
                            }
                        });
                    } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (mutation.target.classList.contains('player-video') && mutation.target.classList.contains('video--load')) {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                console.log('MutationObserver: Player video loading, applying custom loader');
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
                        if (e.type === 'waiting' || e.type === 'loadstart' || e.type === 'stalled') {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                            }
                        } else if (e.type === 'playing' || e.type === 'loadeddata') {
                            var playerLoader = document.querySelector('.player-video__loader');
                            if (playerLoader) playerLoader.style.display = 'none';
                            var youtubeNeedclick = document.querySelector('.player-video__youtube-needclick > div');
                            if (youtubeNeedclick) youtubeNeedclick.style.display = 'none';
                            var modalLoading = document.querySelector('.modal-loading');
                            if (modalLoading) modalLoading.style.display = 'none';
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
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                }
                var modalLoading = document.querySelector('.modal-loading');
                if (modalLoading) {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                }
            }
        }, 100);

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () { setCustomLoader(Lampa.Storage.get('ani_load')); }, 200);
            }
        });

        Lampa.Listener.follow('activity', function (event) {
            if ((event.type === 'start' || event.status === 'active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () { setCustomLoader(Lampa.Storage.get('ani_load')); }, 200);
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
            console.log('Initial load: Applied custom loader');
        } else {
            remove_activity_loader();
            console.log('Initial load: Removed custom loader');
        }
    }

    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
            console.log('byTheme: Applied custom loader');
        } else {
            remove_activity_loader();
            console.log('byTheme: Removed custom loader');
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
        if (e.name === 'color_plugin_main_color' || e.name === 'color_plugin_enabled' || e.name.startsWith('ani_')) {
            byTheme();
            console.log('Storage change:', e.name, 'called byTheme');
        }
    });

    window.byTheme = byTheme;
})();
