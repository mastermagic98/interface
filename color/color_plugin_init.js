function initPlugin() {
    setTimeout(function() {
        // Завантаження збережених налаштувань
        ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
        ColorPlugin.settings.enabled = (Lampa.Storage.get('color_plugin_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_enabled') === 'true');
        ColorPlugin.settings.dimming_enabled = (Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_dimming_enabled') === 'true');

        if (Lampa.SettingsApi) {
            // Компонент уже додано в головному файлі — тут тільки параметри

            // Увімкнення/вимкнення плагіну
            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: {
                    name: 'color_plugin_enabled',
                    type: 'trigger',
                    default: ColorPlugin.settings.enabled.toString()
                },
                field: {
                    name: Lampa.Lang.translate('color_plugin_enabled'),
                    description: Lampa.Lang.translate('color_plugin_enabled_description')
                },
                onChange: function (value) {
                    ColorPlugin.settings.enabled = value === 'true';
                    Lampa.Storage.set('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
                    localStorage.setItem('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
                    applyStyles();
                    forceBlackFilterBackground();
                    updateCanvasFillStyle(window.draw_context);
                    updateParamsVisibility();
                    saveSettings();
                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                    }
                },
                onRender: function (item) {
                    if (item && typeof item.css === 'function') {
                        item.css('display', 'block');
                    }
                }
            });

            // Вибір кольору
            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: {
                    name: 'color_plugin_main_color',
                    type: 'button'
                },
                field: {
                    name: Lampa.Lang.translate('main_color'),
                    description: Lampa.Lang.translate('main_color_description')
                },
                onRender: function (item) {
                    if (item && typeof item.css === 'function') {
                        item.css('display', ColorPlugin.settings.enabled ? 'block' : 'none');
                    }
                },
                onChange: function () {
                    openColorPicker();
                }
            });

            // Застосувати затемнення
            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: {
                    name: 'color_plugin_dimming_enabled',
                    type: 'trigger',
                    default: ColorPlugin.settings.dimming_enabled.toString()
                },
                field: {
                    name: Lampa.Lang.translate('enable_dimming'),
                    description: Lampa.Lang.translate('enable_dimming_description')
                },
                onRender: function (item) {
                    if (item && typeof item.css === 'function') {
                        item.css('display', ColorPlugin.settings.enabled ? 'block' : 'none');
                    }
                },
                onChange: function (value) {
                    ColorPlugin.settings.dimming_enabled = value === 'true';
                    Lampa.Storage.set('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
                    localStorage.setItem('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
                    applyStyles();
                    saveSettings();
                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                    }
                }
            });

            // Початкове застосування стилів
            applyStyles();
            forceBlackFilterBackground();
            updateCanvasFillStyle(window.draw_context);
            updatePluginIcon();
            updateParamsVisibility();
            updateSvgIcons();
        }
    }, 100);
}
