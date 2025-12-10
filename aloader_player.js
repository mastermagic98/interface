// aloader_player.js
//  застосування кастомного завантажувача в інтерфейсі та плеєрі
(function () {
    'use strict';

    function hexToRgb(hex) {
        var h = hex.replace('#', '');
        return {
            r: parseInt(h.substr(0,2),16),
            g: parseInt(h.substr(2,4),16),
            b: parseInt(h.substr(4,6),16)
        };
    }

    function getFilterRgb(color) {
        return color.toLowerCase() === '#353535' ? {r:255,g:255,b:255} : hexToRgb(color);
    }

    function buildColorFilter() {
        var rgb = getFilterRgb(Lampa.Storage.get('color_plugin_main_color', '#ffffff'));
        return 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22c%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r/255) + ' 0 0 0 0 ' + (rgb.g/255) + ' 0 0 0 0 ' + (rgb.b/255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#c")';
    }

    window.aniLoaderPlayer = {
        apply: function(url) {
            if (!url || url === './img/loader.svg') return;

            $('#aniload-id').remove();
            var escaped = url.replace(/'/g, "\\'");
            var filter = buildColorFilter();

            var css = 'body .activity__loader { display: none !important; }' +
                      'body .activity__loader.active, ' +
                      'body .lampac-balanser-loader, ' +
                      'body .player-video__loader.custom, ' +
                      'body .loading-layer__ico.custom, ' +
                      'body .player-video__youtube-needclick > div.custom, ' +
                      'body .modal-loading.custom {' +
                      'background-image: url("' + escaped + '") !important; ' +
                      'background-repeat: no-repeat !important; ' +
                      'background-position: 50% 50% !important; ' +
                      'background-size: contain !important; ' +
                      'background-color: transparent !important; ' +
                      'filter: ' + filter + ' !important; ' +
                      'z-index: 9999 !important; }' +
                      'body .player-video__loader:not(.custom), body .loading-layer__ico:not(.custom) { display: none !important; }';

            $('<style id="aniload-id">' + css + '</style>').appendTo('head');

            $('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, ' +
              '.player-video__youtube-needclick > div, .modal-loading')
                .addClass('custom')
                .css({
                    backgroundImage: 'url(' + escaped + ')',
                    filter: filter,
                    backgroundColor: 'transparent'
                });
        },

        remove: function() {
            $('#aniload-id').remove();
            $('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, ' +
              '.player-video__youtube-needclick > div, .modal-loading')
                .removeClass('custom')
                .css({ backgroundImage: '', filter: '', backgroundColor: '' });
        }
    };

    function loader() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            window.aniLoaderPlayer.apply(Lampa.Storage.get('ani_load'));
        } else {
            window.aniLoaderPlayer.remove();
        }
    }

    function init() {
        loader();

        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'start' && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                loader();
            }
        });

        Lampa.Listener.follow('activity', function(e) {
            if ((e.type === 'start' || e.status === 'active') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                loader();
            }
        });
    }

    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') init();
        });
    }

    // При зміні кольору теми – оновлюємо фільтр
    Lampa.Storage.listener.follow('change', function(e) {
        if (e.name === 'accent_color_selected') {
            loader();
        }
    });

    // Глобальна функція для виклику з консолі або іншого плагіна
    window.loader = loader;

})();
