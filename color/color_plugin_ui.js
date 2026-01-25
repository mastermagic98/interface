// color_plugin_ui.js
// Функції для інтерфейсу (вибір кольору, створення HTML)

function createColorHtml(color, name) {
    var className = color === 'default' ? 'color_square selector default' : 'color_square selector';
    var style = color === 'default' ? '' : 'background-color: ' + color + ';';
    var hex = color === 'default' ? '' : color.replace('#', '');
    var content = color === 'default' ? '' : '<div class="hex">' + hex + '</div>';
    return '<div class="' + className + '" tabindex="0" style="' + style + '" title="' + name + '">' + content + '</div>';
}

function createFamilyNameHtml(name, color) {
    return '<div class="color-family-name" style="border-color: ' + (color || '#353535') + ';">' + Lampa.Lang.translate(name.toLowerCase()) + '</div>';
}

function chunkArray(arr, size) {
    var result = [];
    for (var i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
}

function openColorPicker() {
    var colorKeys = Object.keys(ColorPlugin.colors.main);
    var families = [
        'Red', 'Orange', 'Amber', 'Yellow', 'Lime', 'Green', 'Emerald', 'Teal', 'Cyan',
        'Sky', 'Blue', 'Indigo', 'Violet', 'Purple', 'Fuchsia', 'Pink', 'Rose', 'Slate',
        'Gray', 'Zinc', 'Neutral', 'Stone'
    ];
    var colorsByFamily = [];
    for (var i = 0; i < families.length; i++) {
        var family = families[i];
        var familyColors = colorKeys.filter(function(key) {
            return ColorPlugin.colors.main[key].indexOf(family) === 0 && key !== 'default';
        });
        if (familyColors.length > 0) {
            colorsByFamily.push({
                name: family,
                colors: familyColors
            });
        }
    }
    var colorContent = colorsByFamily.map(function(family) {
        var firstColor = family.colors[0];
        var familyNameHtml = createFamilyNameHtml(family.name, firstColor);
        var groupContent = family.colors.map(function(color) {
            return createColorHtml(color, ColorPlugin.colors.main[color]);
        }).join('');
        return '<div class="color-family-outline">' + familyNameHtml + groupContent + '</div>';
    });
    // Розподіляємо кольори між двома колонками
    var midPoint = Math.ceil(colorContent.length / 2);
    var leftColumn = colorContent.slice(0, midPoint).join('');
    var rightColumn = colorContent.slice(midPoint).join('');
    var defaultButton = createColorHtml('default', Lampa.Lang.translate('default_color'));
    var hexValue = Lampa.Storage.get('color_plugin_custom_hex', '') || '#353535';
    var hexDisplay = hexValue.replace('#', '');
    var inputHtml = '<div class="color_square selector hex-input" tabindex="0" style="background-color: ' + hexValue + ';">' +
                    '<div class="label">' + Lampa.Lang.translate('custom_hex_input') + '</div>' +
                    '<div class="value">' + hexDisplay + '</div>' +
                    '</div>';
    var topRowHtml = '<div style="display: flex; gap: 19px; justify-content: center; margin-bottom: 10px;">' +
                     defaultButton + inputHtml + '</div>';
    var modalContent = '<div class="color-picker-container">' +
                       '<div>' + leftColumn + '</div>' +
                       '<div>' + rightColumn + '</div>' +
                       '</div>';
    var modalHtml = $('<div>' + topRowHtml + modalContent + '</div>');
    try {
        Lampa.Modal.open({
            title: Lampa.Lang.translate('main_color'),
            size: 'medium',
            align: 'center',
            html: modalHtml,
            className: 'color-picker-modal',
            onBack: function () {
                saveSettings();
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
                Lampa.Controller.enable('menu');
            },
            onSelect: function (a) {
                if (a.length > 0 && a[0] instanceof HTMLElement) {
                    var selectedElement = a[0];
                    var color;
                    if (selectedElement.classList.contains('hex-input')) {
                        Lampa.Noty.show(Lampa.Lang.translate('hex_input_hint'));
                        Lampa.Modal.close();
                        var inputOptions = {
                            name: 'color_plugin_custom_hex',
                            value: Lampa.Storage.get('color_plugin_custom_hex', ''),
                            placeholder: Lampa.Lang.translate('settings_cub_not_specified')
                        };
                        Lampa.Input.edit(inputOptions, function (value) {
                            if (value === '') {
                                Lampa.Noty.show('HEX-код не введено.');
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                                return;
                            }
                            if (!isValidHex(value)) {
                                Lampa.Noty.show('Невірний формат HEX-коду. Використовуйте формат #FFFFFF.');
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                                return;
                            }
                            Lampa.Storage.set('color_plugin_custom_hex', value);
                            ColorPlugin.settings.main_color = value;
                            Lampa.Storage.set('color_plugin_main_color', value);
                            localStorage.setItem('color_plugin_main_color', value);
                            applyStyles();
                            forceBlackFilterBackground();
                            updateCanvasFillStyle(window.draw_context);
                            saveSettings();
                            Lampa.Controller.toggle('settings_component');
                            Lampa.Controller.enable('menu');
                            if (Lampa.Settings && Lampa.Settings.render) {
                                Lampa.Settings.render();
                            }
                        });
                        return;
                    } else if (selectedElement.classList.contains('default')) {
                        color = '#353535';
                    } else {
                        color = selectedElement.style.backgroundColor || ColorPlugin.settings.main_color;
                        color = color.includes('rgb') ? rgbToHex(color) : color;
                    }
                    ColorPlugin.settings.main_color = color;
                    Lampa.Storage.set('color_plugin_main_color', color);
                    localStorage.setItem('color_plugin_main_color', color);
                    applyStyles();
                    forceBlackFilterBackground();
                    updateCanvasFillStyle(window.draw_context);
                    saveSettings();
                    Lampa.Modal.close();
                    Lampa.Controller.toggle('settings_component');
                    Lampa.Controller.enable('menu');
                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                    }
                }
            }
        });
    } catch (e) {}
}
