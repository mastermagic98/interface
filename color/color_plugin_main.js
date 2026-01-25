// color_plugin_main.js
// Головний файл плагіну, який ініціалізує все та підключає інші частини

(function () {
    'use strict';

    // Підключення інших файлів (у Lampa це може бути через послідовне завантаження скриптів)
    // Припустимо, що інші файли завантажуються перед цим або через Lampa.Manifest.plugins

    // Ініціалізація плагіну
    initPlugin();

    // Слухачі подій
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'color_plugin_enabled' ||
            e.name === 'color_plugin_main_color' ||
            e.name === 'color_plugin_highlight_enabled' ||
            e.name === 'color_plugin_dimming_enabled') {
            ColorPlugin.settings.enabled = Lampa.Storage.get('color_plugin_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_enabled') === 'true';
            ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
            ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_highlight_enabled') === 'true';
            ColorPlugin.settings.dimming_enabled = Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_dimming_enabled') === 'true';
            applyStyles();
            forceBlackFilterBackground();
            updateCanvasFillStyle(window.draw_context);
            updateParamsVisibility();
            updateSvgIcons();
        }
    });

    Lampa.Listener.follow('settings_component', function (event) {
        if (event.type === 'open') {
            ColorPlugin.settings.enabled = Lampa.Storage.get('color_plugin_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_enabled') === 'true';
            ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
            ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_highlight_enabled') === 'true';
            ColorPlugin.settings.dimming_enabled = Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_dimming_enabled') === 'true';
            applyStyles();
            forceBlackFilterBackground();
            updateCanvasFillStyle(window.draw_context);
            updatePluginIcon();
            updateParamsVisibility(event.body);
            updateSvgIcons();
        } else if (event.type === 'close') {
            saveSettings();
            applyStyles();
            forceBlackFilterBackground();
            updateCanvasFillStyle(window.draw_context);
            updatePluginIcon();
            updateSvgIcons();
        }
    });

    // Спостереження за мутаціями для динамічного застосування чорного фону фільтрів
    setTimeout(function () {
        if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(function (mutations) {
                var hasFilter = false;
                mutations.forEach(function (mutation) {
                    if (mutation.addedNodes) {
                        for (var i = 0; i < mutation.addedNodes.length; i++) {
                            var node = mutation.addedNodes[i];
                            if (node.nodeType === 1 && node.querySelector && node.querySelector('.simple-button--filter')) {
                                hasFilter = true;
                                break;
                            }
                        }
                    }
                });
                if (hasFilter) {
                    setTimeout(forceBlackFilterBackground, 100);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }, 500);
})();
