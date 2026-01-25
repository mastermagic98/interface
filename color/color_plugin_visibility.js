// color_plugin_visibility.js
// Функція для оновлення видимості параметрів (логіка приховування зберегається)

function updateParamsVisibility(body) {
    var params = [
        'color_plugin_main_color',
        'color_plugin_highlight_enabled',
        'color_plugin_dimming_enabled'
    ];
    var container = body || document;
    for (var i = 0; i < params.length; i++) {
        var selector = '.settings-param[data-name="' + params[i] + '"]';
        var elements = container.querySelectorAll ? container.querySelectorAll(selector) : $(selector);
        if (elements.length) {
            var displayValue = ColorPlugin.settings.enabled ? 'block' : 'none';
            for (var j = 0; j < elements.length; j++) {
                var element = elements[j];
                if (element.style) {
                    element.style.display = displayValue;
                } else if (typeof $(element).css === 'function') {
                    $(element).css('display', displayValue);
                }
            }
        }
    }
    // Альтернативне оновлення через Lampa.SettingsApi
    if (Lampa.SettingsApi && Lampa.SettingsApi.params) {
        var componentParams = Lampa.SettingsApi.params.filter(function(p) {
            return p.component === 'color_plugin';
        });
        for (var k = 0; k < componentParams.length; k++) {
            var param = componentParams[k];
            if (param.param.name !== 'color_plugin_enabled') {
                var paramElement = document.querySelector('.settings-param[data-name="' + param.param.name + '"]');
                if (paramElement && paramElement.style) {
                    paramElement.style.display = ColorPlugin.settings.enabled ? 'block' : 'none';
                }
            }
        }
    }
}
