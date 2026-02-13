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

    // Перетворення hex в rgb
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        return { r: parseInt(hex.substring(0,2),16), g: parseInt(hex.substring(2,4),16), b: parseInt(hex.substring(4,6),16) };
    }

    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') return { r: 255, g: 255, b: 255 };
        return hexToRgb(mainColor);
    }

    function applyDefaultLoaderColor() {
        var svg = '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" style="margin:auto;display:block;" width="94px" height="94px" viewBox="0 0 100 100"><circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.933 56.977"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50"/></circle></svg>';
        return { src: 'data:image/svg+xml,' + encodeURIComponent(svg), filter: '' };
    }

    // --- Модальне вікно кастомного лоадера ---
    function create_ani_modal() {
        // CSS для модального
        if (!document.getElementById('aniload')) {
            var style = document.createElement('style');
            style.id = 'aniload';
            style.textContent = `
                .ani_modal_root { padding:1em; }
                .ani_picker_container { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
                .ani_loader_square { width:35px; height:35px; border-radius:4px; display:flex; justify-content:center; align-items:center; cursor:pointer; border:2px solid transparent; background-color:transparent; transition: transform 0.2s, border-color 0.2s; }
                .ani_loader_square img, .ani_loader_square svg { max-width:30px; max-height:30px; object-fit:contain; fill:#ffffff; stroke:#ffffff; filter:none !important; }
                .ani_loader_square.focus { border-color:#ffffff; transform:scale(1.1); }
                .svg_input.focus { border-color:#ffffff; transform:scale(1.1); }
                .svg_input { width:252px; height:35px; border-radius:8px; border:2px solid #ddd; display:flex; align-items:center; justify-content:center; background-color:#353535; color:#fff; font-size:12px; font-weight:bold; cursor:pointer; }
                .svg_input .label, .svg_input .value { font-size:10px; }
            `;
            document.head.appendChild(style);
        }
    }

    function setCustomLoader(url) {
        console.log('Applying custom loader:', url);
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r/255) + ' 0 0 0 0 ' + (rgb.g/255) + ' 0 0 0 0 ' + (rgb.b/255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        $('#aniload-id').remove();
        var styleContent = `
            .activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading {
                background-image: url('${url}') !important;
                background-repeat: no-repeat !important;
                background-position: 50% 50% !important;
                background-size: contain !important;
                background-color: transparent !important;
                filter: ${filterValue} !important;
            }
        `;
        $('<style id="aniload-id">' + styleContent + '</style>').appendTo('head');

        // inline fix для svg
        var modalSvg = document.querySelectorAll('.ani_modal_root img, .ani_modal_root svg');
        modalSvg.forEach(function(el) {
            if (el.tagName.toLowerCase() === 'img') el.style.filter = 'invert(1)'; // робимо білим
            else { el.setAttribute('fill','#ffffff'); el.setAttribute('stroke','#ffffff'); }
        });
    }

    function remove_activity_loader() {
        $('#aniload-id').remove();
        var elements = document.querySelectorAll('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading');
        elements.forEach(function(el){
            el.style.backgroundImage = '';
            el.style.filter = '';
            el.style.backgroundColor = 'transparent';
        });
    }

    // --- Input URL для кастомного лоадера ---
    function showCustomLoaderInput() {
        Lampa.Input.edit({
            name: 'ani_load_custom_svg',
            value: Lampa.Storage.get('ani_load_custom_svg',''),
            placeholder: 'Наприклад https://example.com/loader.svg'
        }, function(value){
            if(!/^https?:\/\/.*\.svg$/.test(value)) {
                Lampa.Noty.show('Невірний формат URL SVG');
                return;
            }
            Lampa.Storage.set('ani_load_custom_svg', value);
            Lampa.Storage.set('ani_load', value);
            setCustomLoader(value);
        });
    }

    // --- Ініціалізація меню ---
    function aniLoad() {
        create_ani_modal();
        try {
            Lampa.SettingsApi.addComponent({ component:'ani_load_menu', name:Lampa.Lang.translate('params_ani_name'), icon:'<svg fill="#ffffff" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/></svg>' });
            Lampa.SettingsApi.addParam({
                component:'ani_load_menu',
                param:{ name:'ani_active', type:'trigger', default:false },
                field:{ name:Lampa.Lang.translate('params_ani_on') },
                onChange:function(item){
                    Lampa.Storage.set('ani_active', item==='true');
                    if(item==='true') setCustomLoader(Lampa.Storage.get('ani_load','./img/loader.svg'));
                    else remove_activity_loader();
                }
            });
            Lampa.SettingsApi.addParam({
                component:'ani_load_menu',
                param:{ name:'select_ani_mation', type:'button' },
                field:{ name:'<div class="settings-folder__icon"><div class="activity__loader_prv"></div></div>'+Lampa.Lang.translate('params_ani_select') },
                onChange:function(){
                    showCustomLoaderInput();
                }
            });
        } catch(e){}
    }

    window.aniLoad = aniLoad;

})();
