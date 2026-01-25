// color_plugin_main.js
// ВИДАЛЕНО старий setTimeout з MutationObserver — тепер керування в utils + styles

(function () {
    'use strict';

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
})();
