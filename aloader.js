(function () {
    'use strict';

    // Переклади
    Lampa.Lang.add({
        params_ani_on:          { ru: 'Включить анимацию',             en: 'Enable animation',            uk: 'Увімкнути анімацію' },
        params_ani_select:      { ru: 'Выбор анимации загрузки',      en: 'Select loading animation',    uk: 'Вибір анімації завантаження' },
        params_ani_name:        { ru: 'Анимация загрузки',            en: 'Loading animation',           uk: 'Анімація завантаження' },
        default_loader:         { ru: 'По умолчанию',                 en: 'Default',                     uk: 'За замовчуванням' },
        custom_svg_input:       { ru: 'Свой SVG (URL)',               en: 'Custom SVG (URL)',            uk: 'Свій SVG (URL)' }
    });

    // ========== ДОПОМІЖНІ ФУНКЦІЇ ==========

    function getMainColorRgb() {
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        if (mainColor.toLowerCase() === '#353535') return {r:255,g:255,b:255};
        var clean = mainColor.replace('#','');
        return {
            r: parseInt(clean.substr(0,2),16),
            g: parseInt(clean.substr(2,2),16),
            b: parseInt(clean.substr(4,2),16)
        };
    }

    function createColorFilter() {
        var rgb = getMainColorRgb();
        var r = (rgb.r / 255).toFixed(6);
        var g = (rgb.g / 255).toFixed(6);
        var b = (rgb.b / 255).toFixed(6);
        return 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + r + ' 0 0 0 0 ' + g + ' 0 0 0 0 ' + b + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
    }

    function getCurrentLoaderUrl() {
        var saved = Lampa.Storage.get('ani_load','');
        if (!saved || saved === './img/loader.svg') {
            return 'https://lampa.mx/img/loader.svg'; // стандартний, якщо нічого не вибрано
        }
        return saved;
    }

    // ========== ЗАСТОСУВАННЯ ЛОАДЕРА З РОЗМИТИМ СКЛОМ ==========

    function applyGlassLoader(svgUrl) {
        $('#glass-loader-style').remove();

        var escaped = svgUrl.replace(/'/g, "\\'");
        var filter = createColorFilter();

        var css = ''
            // Прибираємо всі стандартні лоадери
            + '.player-video__loader, .activity__loader, .lampac-balanser-loader, .loading-layer__ico, .modal-loading { display: none !important; }'

            // Розмите скло
            + '.player-video.video--load::before {'
            + '    content:"" !important;'
            + '    position:absolute !important;'
            + '    inset:0 !important;'
            + '    background:rgba(0,0,0,0.7) !important;'
            + '    backdrop-filter:blur(14px) !important;'
            + '    -webkit-backdrop-filter:blur(14px) !important;'
            + '    z-index:9998 !important;'
            + '}'

            // Кастомний SVG по центру
            + '.player-video.video--load::after {'
            + '    content:"" !important;'
            + '    position:absolute !important;'
            + '    left:50% !important; top:50% !important;'
            + '    width:100px !important; height:100px !important;'
            + '    background:url(\'' + escaped + '\') center/contain no-repeat !important;'
            + '    transform:translate(-50%,-50%) !important;'
            + '    filter:' + filter + ' !important;'
            + '    z-index:9999 !important;'
            + '    pointer-events:none !important;'
            + '}';

        $('<style id="glass-loader-style">' + css + '</style>').appendTo('head');
    }

    function removeGlassLoader() {
        $('#glass-loader-style').remove();
        $('.player-video.video--load::before, .player-video.video--load::after').remove();
    }

    // ========== ПРЕВ’Ю В НАЛАШТУВАННЯХ (без обертання) ==========

    function updatePreview() {
        var url = getCurrentLoaderUrl();
        $('.activity__loader_prv').css({
            'background-image': 'url(' + url + ')',
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'background-color': 'transparent',
            'filter': 'invert(1)', // білий для темного фону налаштувань
            'animation': 'none !important',
            'transform': 'none !important'
        });
    }

    // ========== МОДАЛЬНЕ ВІКНО ВИБОРУ (використовуємо вбудовані svg_loaders) ==========

    function openLoaderModal() {
        if (!window.svg_loaders || window.svg_loaders.length === 0) {
            Lampa.Noty.show('Список лоадерів не завантажений');
            return;
        }

        var html = '<div style="padding:1em;">'
                 + '<div style="display:flex;gap:15px;justify-content:center;margin-bottom:20px;flex-wrap:wrap;">'
                 + '  <div class="selector loader-default focusable" data-url="./img/loader.svg" style="width:80px;height:80px;background:url(./img/loader.svg) center/contain no-repeat;border:2px solid #666;border-radius:8px;"></div>'
                 + '  <div class="selector loader-custom focusable" style="width:200px;height:80px;display:flex;align-items:center;justify-content:center;background:#333;border:2px solid #666;border-radius:8px;color:#fff;font-size:0.9em;">' + Lampa.Lang.translate('custom_svg_input') + '</div>'
                 + '</div>'
                 + '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(80px,1fr));gap:12px;">';

        window.svg_loaders.forEach(function(url, idx) {
            var active = url === getCurrentLoaderUrl() ? 'border:3px solid var(--main-color);transform:scale(1.1);' : '';
            html += '<div class="selector focusable" data-url="' + url + '" style="height:80px;background:url(' + url + ') center/contain no-repeat;border-radius:8px;' + active + '"></div>';
        });

        html += '</div></div>';

        Lampa.Modal.open({
            title: Lampa.Lang.translate('params_ani_select'),
            html: $(html),
            size: 'medium',
            onSelect: function(el) {
                if (el.hasClass('loader-custom')) {
                    Lampa.Input.edit({
                        name: 'ani_load_custom',
                        value: Lampa.Storage.get('ani_load',''),
                        placeholder: 'https://example.com/loader.svg'
                    }, function(val) {
                        if (val && val.indexOf('.svg') > -1) {
                            Lampa.Storage.set('ani_load', val);
                            applyGlassLoader(val);
                            updatePreview();
                        } else if (val === '') {
                            Lampa.Storage.set('ani_load', '');
                            applyGlassLoader('./img/loader.svg');
                            updatePreview();
                        }
                    });
                    return;
                }

                var url = el.data('url') || './img/loader.svg';
                Lampa.Storage.set('ani_load', url);
                applyGlassLoader(url);
                updatePreview();
                Lampa.Modal.close();
            },
            onBack: function() {
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // ========== ЗАПУСК ПЛАГІНУ ==========

    function start() {
        // Додаємо розділ в налаштування
        Lampa.SettingsApi.addComponent({
            component: 'glass_loader',
            name: Lampa.Lang.translate('params_ani_name'),
            icon: '<svg viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="3" fill="none"><animate attributeName="r" values="6;10;6" dur="1.5s" repeatCount="indefinite"/></circle></svg>'
        });

        // Перемикач
        Lampa.SettingsApi.addParam({
            component: 'glass_loader',
            param: { name: 'glass_active', type: 'trigger', default: false },
            field: { name: Lampa.Lang.translate('params_ani_on') },
            onChange: function(val) {
                Lampa.Storage.set('glass_active', !!val);
                if (val) {
                    applyGlassLoader(getCurrentLoaderUrl());
                } else {
                    removeGlassLoader();
                }
                updatePreview();
            }
        });

        // Кнопка вибору
        Lampa.SettingsApi.addParam({
            component: 'glass_loader',
            param: { name: 'glass_select', type: 'button' },
            field: {
                name: '<div style="display:inline-block;width:28px;height:28px;vertical-align:middle;margin-right:12px;border-radius:6px;background:#333;">'
                     + '<div class="activity__loader_prv" style="width:100%;height:100%;background:url(./img/loader.svg) center/contain no-repeat;"></div>'
                     + '</div>' + Lampa.Lang.translate('params_ani_select')
            },
            onRender: function(el) {
                if (!Lampa.Storage.get('glass_active')) el.hide();
                else el.show();
                updatePreview();
            },
            onChange: openLoaderModal
        });

        // При старті застосунку
        if (Lampa.Storage.get('glass_active')) {
            applyGlassLoader(getCurrentLoaderUrl());
            updatePreview();
        }
    }

    // Запуск
    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') start();
        });
    }

    // Реакція на зміну кольору теми
    Lampa.Storage.listener.follow('change', function(e) {
        if (e.name === 'color_plugin_main_color' && Lampa.Storage.get('glass_active')) {
            applyGlassLoader(getCurrentLoaderUrl());
        }
    });

})();
