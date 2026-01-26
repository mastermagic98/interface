// color_plugin_highlight.js
// Окремий файл: логіка та стилі для рамки виділення (highlight) + заокруглення кутів

(function () {
    'use strict';

    // Отримуємо стилі для рамки та заокруглення на основі налаштувань
    function getHighlightStyles() {
        var highlightInset = ColorPlugin.settings.highlight_enabled ? 
            '-webkit-box-shadow: inset 0 0 0 0.15em #fff !important;' +
            'box-shadow: inset 0 0 0 0.15em #fff !important;' : '';

        var roundRadius = ColorPlugin.settings.round_highlight_enabled ? 
            'border-radius: 1em !important;' : 
            'border-radius: 0 !important;';  // скидаємо заокруглення, якщо вимкнено

        // Список елементів, до яких застосовуємо стилі (ті самі, що раніше отримували highlightStyles)
        var selectors = [
            '.full-start__button.focus',
            '.settings-param.focus',
            '.items-line__more.focus',
            '.menu__item.focus',
            '.settings-folder.focus',
            '.head__action.focus',
            '.selectbox-item.focus',
            '.simple-button.focus',
            '.navigation-tabs__button.focus',
            '.console__tab.focus',
            '.timetable__item.focus::before'
            // Додай інші елементи, якщо потрібно (наприклад, .modal__button.focus тощо)
        ];

        var highlightCSS = selectors.map(function(sel) {
            return sel + ' {' + highlightInset + '}';
        }).join('\n');

        var roundCSS = selectors.map(function(sel) {
            return sel + ' {' + roundRadius + '}';
        }).join('\n');

        // Додаткові коригування для ідеальної імітації стилю меню зліва
        // (padding, background вже є в основних стилях, але можна уточнити)
        var menuLikeCSS = ColorPlugin.settings.round_highlight_enabled ? 
            selectors.map(function(sel) {
                // Імітуємо стиль .menu__item.focus зліва
                return sel + ' {' +
                    'padding: 0.636em 1.06em !important;' +  // ~9.54px / 15.9px при базовому font-size
                    'background-color: var(--main-color) !important;' +
                    'box-sizing: border-box !important;' +
                    'transition: none !important;' +
                '}';
            }).join('\n') : '';

        return highlightCSS + '\n' + roundCSS + '\n' + menuLikeCSS;
    }

    // Функція для застосування тільки highlight-стилів (викликається з applyStyles)
    function applyHighlightToCSS(styleElement) {
        if (!styleElement) return;

        var highlightCSS = getHighlightStyles();

        // Додаємо/оновлюємо блок highlight в основному стилі
        // (щоб не дублювати, просто додаємо в кінець або замінюємо)
        styleElement.innerHTML = styleElement.innerHTML.replace(
            /\/\* HIGHLIGHT_START \*\/[\s\S]*?\/\* HIGHLIGHT_END \*\//g, ''
        );

        styleElement.innerHTML += '\n/* HIGHLIGHT_START */\n' + highlightCSS + '\n/* HIGHLIGHT_END */\n';
    }

    // Експортуємо функцію для використання в applyStyles
    window.ColorPluginHighlight = {
        apply: applyHighlightToCSS,
        getCSS: getHighlightStyles  // на випадок, якщо потрібно окремо
    };

})();
