(function () {
'use strict';

// Список модулів для підключення
var modules = [
'https://mastermagic98.github.io/interface/color/color_plugin_translations.js',
'https://mastermagic98.github.io/interface/color/color_plugin_settings.js',
'https://mastermagic98.github.io/interface/color/color_plugin_utils.js',
'https://mastermagic98.github.io/interface/color/color_plugin_styles.js',
'https://mastermagic98.github.io/interface/color/color_plugin_ui.js',
'https://mastermagic98.github.io/interface/color/color_plugin_visibility.js',
'https://mastermagic98.github.io/interface/color/color_plugin_init.js',
'https://mastermagic98.github.io/interface/color/color_plugin_main.js'
];
// Асинхронне підключення модулів
modules.forEach(function (url) {
Lampa.Utils.putScriptAsync([url], function () {}, function () {});
});

// Запускаємо плагін після готовності програми
if (window.appready) {
startPlugin();
} else {
Lampa.Listener.follow('app', function (event) {
if (event.type === 'ready') {
startPlugin();
}
});
}
// Опис маніфесту плагіна
Lampa.Manifest.plugins = {
name: 'color_plugin',
version: '1.0.0',
description: 'Customization colors'
};
})();
