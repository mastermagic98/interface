// color_plugin_init.js
// Функція ініціалізації плагіна

function initPlugin() {
    // Завантажуємо збережені налаштування
    setTimeout(function() {
        // Спроба завантаження з localStorage, якщо Lampa.Storage недоступний
        ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
        ColorPlugin.settings.enabled = (Lampa.Storage.get('color_plugin_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_enabled') === 'true');
        ColorPlugin.settings.highlight_enabled = (Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_highlight_enabled') === 'true');
        ColorPlugin.settings.dimming_enabled = (Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_dimming_enabled') === 'true');
        // Додаємо компонент до меню налаштувань
        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addComponent({
                component: 'color_plugin',
                name: Lampa.Lang.translate('color_plugin'),
                icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
            });
            // Увімкнення/вимкнення плагіна
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
            // Колір виділення
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
            // Показати рамку
            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: {
                    name: 'color_plugin_highlight_enabled',
                    type: 'trigger',
                    default: ColorPlugin.settings.highlight_enabled.toString()
                },
                field: {
                    name: Lampa.Lang.translate('enable_highlight'),
                    description: Lampa.Lang.translate('enable_highlight_description')
                },
                onRender: function (item) {
                    if (item && typeof item.css === 'function') {
                        item.css('display', ColorPlugin.settings.enabled ? 'block' : 'none');
                    }
                },
                onChange: function (value) {
                    ColorPlugin.settings.highlight_enabled = value === 'true';
                    Lampa.Storage.set('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
                    localStorage.setItem('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
                    applyStyles();
                    saveSettings();
                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                    }
                }
            });
            // Застосувати колір затемнення
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
            // Застосовуємо стилі при ініціалізації
            applyStyles();
            forceBlackFilterBackground();
            updateCanvasFillStyle(window.draw_context);
            updatePluginIcon();
            updateParamsVisibility();
            updateSvgIcons();
        }
    }, 100); // Затримка для забезпечення готовності Lampa.Storage
}

// Запускаємо плагін після готовності програми
if (window.appready && Lampa.SettingsApi && Lampa.Storage) {
    initPlugin();
} else {
    Lampa.Listener.follow('app', function (event) {
        if (event.type === 'ready' && Lampa.SettingsApi && Lampa.Storage) {
            initPlugin();
        }
    });
}
