(function () {
    'use strict';

    // === Переклади ===
    Lampa.Lang.add({
        params_ani_on: { ru: 'Включить', en: 'Enable', uk: 'Увімкнути' },
        params_ani_select: { ru: 'Выбор анимации', en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name: { ru: 'Анимация Загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        default_loader: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_svg_input: { ru: 'Введи URL SVG', en: 'Enter SVG URL', uk: 'Введи URL SVG' },
        svg_input_hint: { ru: 'Используйте URL SVG, например https://example.com/loader.svg', en: 'Use SVG URL, for example https://example.com/loader.svg', uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' }
    });

    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');

    // === Допоміжні функції ===
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }

    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') return { r: 255, g: 255, b: 255 };
        return hexToRgb(mainColor);
    }

    function applyDefaultLoaderColor() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
            '<svg xmlns="http://www.w3.org/2000/svg" style="margin:auto;display:block;background:none;shape-rendering:auto" width="94" height="94" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
            '<circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.9 56.9">' +
            '<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50"></animateTransform>' +
            '</circle></svg>';
        var encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encodedSvg, filter: '' };
    }

    function isValidSvgUrl(url) {
        return /^https?:\/\/.*\.svg$/.test(url);
    }

    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
        return result;
    }

    // === Основне застосування кастомного завантажувача ===
    function setCustomLoader(url) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r/255) + ' 0 0 0 0 ' + (rgb.g/255) + ' 0 0 0 0 ' + (rgb.b/255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';

        var style = '.activity__loader.active{' +
            'background-image:url(\''+escapedUrl+'\')!important;' +
            'background-repeat:no-repeat!important;' +
            'background-position:50% 50%!important;' +
            'background-size:contain!important;filter:'+filterValue+';}' +

            '.player-video__loader{' +
            'background-image:url(\''+escapedUrl+'\')!important;' +
            'background-repeat:no-repeat!important;' +
            'background-position:50% 50%!important;' +
            'background-size:80% 80%!important;' +
            'filter:'+whiteFilter+';background-color:rgba(0,0,0,0.3)!important;}';

        $('<style id="aniload-id">'+style+'</style>').appendTo('head');
        console.log('setCustomLoader застосовано');
    }

    // Очікування появи .player-video__loader
    function waitForPlayerLoader(callback) {
        var tries = 0;
        var interval = setInterval(function() {
            var loader = document.querySelector('.player-video.video--load .player-video__loader');
            if (loader) {
                console.log('Виявлено .player-video__loader');
                clearInterval(interval);
                callback(loader);
            }
            tries++;
            if (tries > 30) clearInterval(interval);
        }, 100);
    }

    function remove_activity_loader() {
        $('#aniload-id').remove();
        var all = document.querySelectorAll('.player-video__loader,.activity__loader');
        for (var i=0;i<all.length;i++){ all[i].style.backgroundImage=''; all[i].style.filter=''; }
    }

    // === Побудова модального вікна вибору ===
    function createSvgHtml(src, index) {
        return '<div class="ani_loader_square selector" tabindex="0"><img src="'+src+'" alt="Loader '+index+'"></div>';
    }

    function createModal() {
        var grouped = chunkArray(window.svg_loaders, 6);
        var svgContent = grouped.map(function(group) {
            return '<div class="ani_loader_row">'+group.map(function(loader, i){return createSvgHtml(loader,i);}).join('')+'</div>';
        }).join('');
        var defaultLoader = applyDefaultLoaderColor();
        var defaultBtn = '<div class="ani_loader_square selector default" tabindex="0"><img src="'+defaultLoader.src+'"></div>';
        var inputHtml = '<div class="ani_loader_square selector svg_input" tabindex="0" style="width:410px;"><div class="label">'+Lampa.Lang.translate('custom_svg_input')+'</div><div class="value">'+(Lampa.Storage.get('ani_load_custom_svg','')||'')+'</div></div>';
        var topRow = '<div style="display:flex;gap:30px;justify-content:center;margin-bottom:10px;">'+defaultBtn+inputHtml+'</div>';
        return $('<div>'+topRow+'<div>'+svgContent+'</div></div>');
    }

    // === Ініціалізація ===
    function aniLoad() {
        var icon = '<svg viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" dur="1s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>';

        Lampa.SettingsApi.addComponent({
            component: 'ani_load_menu',
            name: Lampa.Lang.translate('params_ani_name'),
            icon: icon
        });

        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'ani_active', type: 'trigger', default: false },
            field: { name: Lampa.Lang.translate('params_ani_on') },
            onChange: function (val) {
                if (val==='true' && Lampa.Storage.get('ani_load')) {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                } else remove_activity_loader();
                Lampa.Settings.render();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'select_ani_mation', type: 'button' },
            field: { name: Lampa.Lang.translate('params_ani_select') },
            onChange: function () {
                if (!window.svg_loaders || window.svg_loaders.length===0) return;
                var modalHtml = createModal();
                Lampa.Modal.open({
                    title: Lampa.Lang.translate('params_ani_select'),
                    size: 'medium',
                    align: 'center',
                    html: modalHtml,
                    onSelect: function(a){
                        if (a.length>0 && a[0] instanceof HTMLElement) {
                            if (a[0].classList.contains('default')) {
                                Lampa.Storage.set('ani_load','');
                                remove_activity_loader();
                            } else if (a[0].classList.contains('svg_input')) {
                                Lampa.Noty.show(Lampa.Lang.translate('svg_input_hint'));
                                Lampa.Modal.close();
                                Lampa.Input.edit({name:'ani_load_custom_svg', value:Lampa.Storage.get('ani_load_custom_svg','')},function(val){
                                    if (!isValidSvgUrl(val)) {Lampa.Noty.show('Невірний URL');return;}
                                    Lampa.Storage.set('ani_load_custom_svg',val);
                                    Lampa.Storage.set('ani_load',val);
                                    if (Lampa.Storage.get('ani_active')) setCustomLoader(val);
                                    Lampa.Settings.render();
                                });
                                return;
                            } else {
                                var src = a[0].querySelector('img').src;
                                Lampa.Storage.set('ani_load',src);
                                if (Lampa.Storage.get('ani_active')) setCustomLoader(src);
                            }
                            Lampa.Modal.close();
                            Lampa.Settings.render();
                        }
                    }
                });
            }
        });

        // Слухач на появу video--load
        var observer = new MutationObserver(function(m){
            m.forEach(function(mu){
                if (mu.type==='attributes' && mu.attributeName==='class' && mu.target.classList.contains('player-video')) {
                    if (mu.target.classList.contains('video--load')) {
                        console.log('Виявлено video--load');
                        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load')) {
                            waitForPlayerLoader(function(){
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                            });
                        }
                    } else {
                        console.log('Видалено video--load');
                        remove_activity_loader();
                    }
                }
            });
        });
        observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});

        Lampa.Listener.follow('player', function(e){
            if (e.type==='load' && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load')) {
                console.log('player load');
                waitForPlayerLoader(function(){
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                });
            }
        });
    }

    if (window.appready) aniLoad(); else {
        Lampa.Listener.follow('app',function(e){ if (e.type==='ready') aniLoad(); });
    }

})();
