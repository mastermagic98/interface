// color_plugin_utils.js
// Утилітарні функції + нові функції для скасування змін та керування observer

var isSaving = false;
var filterObserver = null;

function hexToRgb(hex) {
    var cleanHex = hex.replace('#', '');
    var r = parseInt(cleanHex.substring(0, 2), 16);
    var g = parseInt(cleanHex.substring(2, 4), 16);
    var b = parseInt(cleanHex.substring(4, 6), 16);
    return r + ', ' + g + ', ' + b;
}

function rgbToHex(rgb) {
    var matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!matches) return rgb;
    function hex(n) {
        return ('0' + parseInt(n).toString(16)).slice(-2);
    }
    return '#' + hex(matches[1]) + hex(matches[2]) + hex(matches[3]);
}

function isValidHex(color) {
    return /^#[0-9A-Fa-f]{6}$/.test(color);
}

function updateDateElementStyles() {
    var elements = document.querySelectorAll('div[style*="position: absolute; left: 1em; top: 1em;"]');
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        if (element.querySelector('div[style*="font-size: 2.6em"]')) {
            element.style.background = 'none';
            element.style.padding = '0.7em';
            element.style.borderRadius = '0.7em';
        }
    }
}

function updateCanvasFillStyle(context) {
    if (context && context.fillStyle) {
        var rgbColor = hexToRgb(ColorPlugin.settings.main_color);
        context.fillStyle = 'rgba(' + rgbColor + ', 1)';
    }
}

function updatePluginIcon() {
    if (!Lampa.SettingsApi || !Lampa.SettingsApi.components) {
        var menuItem = document.querySelector('.menu__item[data-component="color_plugin"] .menu__ico');
        if (menuItem) {
            menuItem.innerHTML = '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>';
        }
        return;
    }
    var component = Lampa.SettingsApi.components.find(function(c) { return c.component === 'color_plugin'; });
    if (component) {
        component.icon = '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.90.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>';
        if (Lampa.Settings && Lampa.Settings.render) {
            Lampa.Settings.render();
        }
    }
}

function saveSettings() {
    if (isSaving) {
        return;
    }
    isSaving = true;
    Lampa.Storage.set('color_plugin_main_color', ColorPlugin.settings.main_color);
    Lampa.Storage.set('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
    Lampa.Storage.set('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
    Lampa.Storage.set('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
    localStorage.setItem('color_plugin_main_color', ColorPlugin.settings.main_color);
    localStorage.setItem('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
    localStorage.setItem('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
    localStorage.setItem('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
    isSaving = false;
}

function forceBlackFilterBackground() {
    var elements = document.querySelectorAll('.simple-button--filter > div');
    for (var i = 0; i < elements.length; i++) {
        var comp = window.getComputedStyle(elements[i]).backgroundColor;
        if (comp === 'rgba(255, 255, 255, 0.3)' || comp === 'rgb(255, 255, 255)') {
            elements[i].style.setProperty('background-color', 'rgba(0, 0, 0, 0.3)', 'important');
        }
    }
}

function updateSvgIcons() {
    var paths = document.querySelectorAll('path[d^="M2 1.5H19C"], path[d^="M3.81972 14.5957V"], path[d^="M8.39409 0.192139L"]');
    for (var i = 0; i < paths.length; i++) {
        var path = paths[i];
        if (path.getAttribute('d').indexOf('M8.39409 0.192139') !== -1) {
            if (path.getAttribute('fill') !== 'none') {
                path.setAttribute('fill', 'var(--main-color)');
            }
        } else {
            path.setAttribute('fill', 'none');
        }
    }
}

// НОВА ФУНКЦІЯ: скасування всіх inline-зміни та атрибутів
function revertChanges() {
    // Скасування стилів дати
    var dateElements = document.querySelectorAll('div[style*="position: absolute; left: 1em; top: 1em;"]');
    dateElements.forEach(function(element) {
        if (element.querySelector('div[style*="font-size: 2.6em"]')) {
            element.style.background = '';
            element.style.padding = '';
            element.style.borderRadius = '';
        }
    });

    // Скасування чорного фону фільтрів
    var filterElements = document.querySelectorAll('.simple-button--filter > div');
    filterElements.forEach(function(element) {
        element.style.backgroundColor = '';
    });

    // Скасування змін SVG-іконок
    var svgPaths = document.querySelectorAll('path[d^="M2 1.5H19C"], path[d^="M3.81972 14.5957V"], path[d^="M8.39409 0.192139L"]');
    svgPaths.forEach(function(path) {
        path.removeAttribute('fill');
    });
}

// НОВА ФУНКЦІЯ: налаштування MutationObserver для фільтрів
function setupFilterObserver() {
    if (filterObserver || typeof MutationObserver === 'undefined') return;

    filterObserver = new MutationObserver(function (mutations) {
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
        if (hasFilter && ColorPlugin.settings.enabled) {
            setTimeout(forceBlackFilterBackground, 100);
        }
    });
    filterObserver.observe(document.body, { childList: true, subtree: true });
}

// НОВА ФУНКЦІЯ: відключення observer
function disconnectFilterObserver() {
    if (filterObserver) {
        filterObserver.disconnect();
        filterObserver = null;
    }
}
