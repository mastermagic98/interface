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

    function hexToCssFilter(hexColor, calibrate) {
        if (!hexColor) return 'none';
        var hex = hexColor.replace('#', '');
        if (hex.length !== 6) return 'none';
        var r = parseInt(hex.substring(0, 2), 16) / 255;
        var g = parseInt(hex.substring(2, 4), 16) / 255;
        var b = parseInt(hex.substring(4, 6), 16) / 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var delta = max - min;
        var hue = 0;
        if (delta !== 0) {
            if (max === r) hue = ((g - b) / delta) % 6;
            else if (max === g) hue = (b - r) / delta + 2;
            else hue = (r - g) / delta + 4;
            hue = Math.round(hue * 60);
            if (hue < 0) hue += 360;
        }
        var saturation = max === 0 ? 0 : delta / max;
        var brightness = max;
        var sepia = 1;
        var hueRotate = hue - 40;
        var saturateValue = saturation * 10;
        var brightnessValue = brightness * 0.8 + 0.2;
        if (calibrate) {
            if (hue >= 180 && hue <= 240) {
                hueRotate += 5;
                saturateValue *= 1.2;
                sepia /= 2.5;
                brightnessValue /= 1.6;
            } else if (hue >= 240 && hue <= 300) {
                hueRotate += 5;
                saturateValue *= 1.2;
                brightnessValue *= 1.09;
                sepia /= 2.5;
            } else if (hue <= 20 || hue >= 340) {
                hueRotate -= 10;
                brightnessValue /= 4.55;
            } else if (hue >= 70 && hue <= 160) {
                hueRotate -= 15;
                saturateValue *= 0.9;
                brightnessValue *= 1.09;
                sepia /= 2.5;
            } else if (hue >= 14 && hue <= 60) {
                hueRotate -= 15;
                saturateValue *= 0.9;
                brightnessValue /= 2.45;
                sepia /= 1.25;
            } else if (hue >= 300 && hue <= 360) {
                hueRotate -= 15;
                saturateValue *= 0.9;
                brightnessValue /= 4.6;
            }
        }
        hueRotate = Math.max(0, Math.min(360, hueRotate));
        saturateValue = Math.max(0, Math.min(20, saturateValue));
        brightnessValue = Math.max(0, Math.min(2, brightnessValue));
        return 'brightness(' + brightnessValue.toFixed(2) + ') sepia(' + sepia + ') hue-rotate(' + Math.round(hueRotate) + 'deg) saturate(' + saturateValue.toFixed(2) + ')';
    }

    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_grid">{ani_svg_content}</div></div>');

    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';
        style.textContent = '.ani_row { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 80px; gap: 15px; justify-items: center; width: 100%; padding: 10px; }' +
                            '.ani_svg { display: flex; align-items: center; justify-content: center; width: 100%; height: 80px; }' +
                            '.ani_svg img { max-width: 100%; max-height: 80px; object-fit: contain; filter: brightness(0) invert(1); }' +
                            '.ani_svg.focus { background-color: #353535; border: 1px solid #9e9e9e; }';
        document.head.appendChild(style);
        console.log('Модальне вікно анімацій створено, кількість SVG: ' + (window.svg_loaders ? window.svg_loaders.length : 0));
    }

    function createSvgHtml(src) {
        return '<div class="ani_svg selector" tabindex="0"><img src="' + src + '" style="visibility:visible; max-width:100%; max-height:80px;"></div>';
    }

    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    function insert_activity_loader(url, filter) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var newStyle = '.activity__loader { background: url(\'' + escapedUrl + '\') no-repeat 50% 50% !important; transform: scale(3); -webkit-transform: scale(3); filter: ' + hexToCssFilter(filter) + '; }' +
                       '.modal-loading { background: url(\'' + escapedUrl + '\') no-repeat 50% 50% !important; transform: scale(3); -webkit-transform: scale(3); filter: ' + hexToCssFilter(filter) + '; }';
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');
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
                            insert_activity_loader(Lampa.Storage.get('ani_load'), getComputedStyle(document.documentElement).getPropertyValue('--main-color'));
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
                    name: '<div class="settings-folder__icon" style="display: inline-block; vertical-align: middle; margin-right: 10px;"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('params_ani_select')
                },
                onRender: function (item) {
                    insert_activity_loader_prv(Lampa.Storage.get('ani_load', window.svg_loaders ? window.svg_loaders[0] : ''));
                },
                onChange: function () {
                    if (!window.svg_loaders || window.svg_loaders.length === 0) {
                        console.error('SVG завантажувачі не знайдено');
                        return;
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
                            html: ani_templates,
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                            },
                            onSelect: function (a) {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var imgElement = a[0].querySelector('img');
                                    if (imgElement) {
                                        var srcValue = imgElement.getAttribute('src');
                                        Lampa.Storage.set('ani_load', srcValue);
                                        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                                            insert_activity_loader(Lampa.Storage.get('ani_load'), getComputedStyle(document.documentElement).getPropertyValue('--main-color'));
                                            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                                        }
                                        console.log('Вибрано анімацію: ' + srcValue);
                                    }
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

        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            insert_activity_loader(Lampa.Storage.get('ani_load'), getComputedStyle(document.documentElement).getPropertyValue('--main-color'));
        }
    }

    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            var main_color = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
            insert_activity_loader(Lampa.Storage.get('ani_load'), main_color);
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

    document.documentElement.addEventListener('style-change', function () {
        byTheme();
    });
})();
