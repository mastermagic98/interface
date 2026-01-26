// color_plugin_init.js

function initPlugin() {
    setTimeout(function() {
        console.log('[Color Plugin Init] Початок ініціалізації');

        // Завантаження налаштувань
        ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
        ColorPlugin.settings.enabled = (Lampa.Storage.get('color_plugin_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_enabled') === 'true');
        ColorPlugin.settings.dimming_enabled = (Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_dimming_enabled') === 'true');

        console.log('[Color Plugin Init] Налаштування завантажено:', ColorPlugin.settings);

        if (Lampa.SettingsApi) {
            // Додавання параметрів...
            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: { name: 'color_plugin_enabled', type: 'trigger', default: ColorPlugin.settings.enabled.toString() },
                field: { name: Lampa.Lang.translate('color_plugin_enabled'), description: Lampa.Lang.translate('color_plugin_enabled_description') },
                onChange: function (value) { /* ... */ },
                onRender: function (item) { /* ... */ }
            });

            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: { name: 'color_plugin_main_color', type: 'button' },
                field: { name: Lampa.Lang.translate('main_color'), description: Lampa.Lang.translate('main_color_description') },
                onRender: function (item) { /* ... */ },
                onChange: function () { openColorPicker(); }
            });

            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: { name: 'color_plugin_dimming_enabled', type: 'trigger', default: ColorPlugin.settings.dimming_enabled.toString() },
                field: { name: Lampa.Lang.translate('enable_dimming'), description: Lampa.Lang.translate('enable_dimming_description') },
                onRender: function (item) { /* ... */ },
                onChange: function (value) { /* ... */ }
            });

            // Застосування стилів
            applyStyles();
            forceBlackFilterBackground();
            updateCanvasFillStyle(window.draw_context);
            updatePluginIcon();
            updateParamsVisibility();
            updateSvgIcons();

            console.log('[Color Plugin Init] Параметри додано, стилі застосовано');
        } else {
            console.warn('[Color Plugin Init] Lampa.SettingsApi недоступний на момент ініціалізації');
        }
    }, 100);
}

// КІНЕЦЬ ФАЙЛУ — без виклику initPlugin()
