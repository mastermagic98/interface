// color_plugin_styles.js
// Оновлена функція applyStyles з повним скасуванням змін при вимкненні

function applyStyles() {
    // При вимкненні — повністю скасовуємо всі зміни без перевантаження
    if (!ColorPlugin.settings.enabled) {
        var oldStyle = document.getElementById('color-plugin-styles');
        if (oldStyle) oldStyle.remove();

        revertChanges();
        disconnectFilterObserver();

        // НЕ скидаємо збережений колір — при повторному увімкненні користувач отримає свій останній вибір
        return;
    }

    // Валідація кольору
    if (!isValidHex(ColorPlugin.settings.main_color)) {
        ColorPlugin.settings.main_color = '#353535';
    }

    var style = document.getElementById('color-plugin-styles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'color-plugin-styles';
        document.head.appendChild(style);
    }

    var rgbColor = hexToRgb(ColorPlugin.settings.main_color);
    var focusBorderColor = ColorPlugin.settings.main_color === '#353535' ? '#ffffff' : 'var(--main-color)';

   
    style.innerHTML = [
        ':root {' +
            '--main-color: ' + ColorPlugin.settings.main_color + ' !important;' +
            '--main-color-rgb: ' + rgbColor + ' !important;' +
            '--accent-color: ' + ColorPlugin.settings.main_color + ' !important;' +
        '}',
        '.modal__title {' +
            'font-size: 1.7em !important;' +
        '}',
        '.modal__head {' +
            'margin-bottom: 0 !important;' +
        '}',
        '.modal .scroll__content {' +
            'padding: 1.0em 0 !important;' +
        '}',
        '.menu__ico, .menu__ico:hover, .menu__ico.traverse, ' +
        '.head__action, .head__action.focus, .head__action:hover, .settings-param__ico {' +
            'color: #ffffff !important;' +
            'fill: #ffffff !important;' +
        '}',
        '.menu__ico.focus {' +
            'color: #ffffff !important;' +
            'fill: #ffffff !important;' +
            'stroke: none !important;' +
        '}',
        '.menu__item.focus .menu__ico path[fill], .menu__item.focus .menu__ico rect[fill], ' +
        '.menu__item.focus .menu__ico circle[fill], .menu__item.traverse .menu__ico path[fill], ' +
        '.menu__item.traverse .menu__ico rect[fill], .menu__item.traverse .menu__ico circle[fill], ' +
        '.menu__item:hover .menu__ico path[fill], .menu__item:hover .menu__ico rect[fill], ' +
        '.menu__item:hover .menu__ico circle[fill] {' +
            'fill: #ffffff !important;' +
        '}',
        '.menu__item.focus .menu__ico [stroke], .menu__item.traverse .menu__ico [stroke], .menu__item:hover .menu__ico [stroke] {' +
            'stroke: #fff !important;' +
        '}',
        '.menu__item, .menu__item.focus, .menu__item.traverse, .menu__item:hover, ' +
        '.console__tab, .console__tab.focus, ' +
        '.settings-param, .settings-param.focus, ' +
        '.selectbox-item, .selectbox-item.focus, .selectbox-item:hover, ' +
        '.full-person, .full-person.focus, ' +
        '.full-start__button, .full-start__button.focus, ' +
        '.full-descr__tag, .full-descr__tag.focus, ' +
        '.simple-button, .simple-button.focus, ' +
        '.player-panel .button, .player-panel .button.focus, ' +
        '.search-source, .search-source.active, ' +
        '.radio-item, .radio-item.focus, ' +
        '.lang__selector-item, .lang__selector-item.focus, ' +
        '.modal__button, .modal__button.focus, ' +
        '.search-history-key, .search-history-key.focus, ' +
        '.simple-keyboard-mic, .simple-keyboard-mic.focus, ' +
        '.full-review-add, .full-review-add.focus, ' +
        '.full-review, .full-review.focus, ' +
        '.tag-count, .tag-count.focus, ' +
        '.settings-folder, .settings-folder.focus, ' +
        '.noty, ' +
        '.radio-player, .radio-player.focus {' +
            'color: #ffffff !important;' +
        '}',
        '.console__tab {' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.console__tab.focus {' +
            'background: var(--main-color) !important;' +
            'color: #fff !important;' +
        '}',
        '.menu__item.focus, .menu__item.traverse, .menu__item:hover, ' +
        '.full-person.focus, .full-start__button.focus, .full-descr__tag.focus, ' +
        '.simple-button.focus, .head__action.focus, .head__action:hover, ' +
        '.player-panel .button.focus, .search-source.active {' +
            'background: var(--main-color) !important;' +
        '}',
        '.player-panel .button.focus {' +
            'background-color: var(--main-color) !important;' +
            'color: #fff !important;' +
        '}',
        '.full-start__button.focus, .settings-param.focus, .items-line__more.focus, ' +
        '.menu__item.focus, .settings-folder.focus, .head__action.focus, ' +
        '.selectbox-item.focus, .simple-button.focus, .navigation-tabs__button.focus {' +
        '}',
        '.timetable__item.focus::before {' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.navigation-tabs__button.focus {' +
            'background-color: var(--main-color) !important;' +
            'color: #fff !important;' +
        '}',
        '.items-line__more.focus {' +
            'color: #fff !important;' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.timetable__item.focus {' +
            'color: #fff !important;' +
        '}',
        '.broadcast__device.focus {' +
            'background-color: var(--main-color) !important;' +
            'color: #fff !important;' +
        '}',
        '.iptv-menu__list-item.focus, .iptv-program__timeline>div {' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.radio-item.focus, .lang__selector-item.focus, .simple-keyboard .hg-button.focus, ' +
        '.modal__button.focus, .search-history-key.focus, .simple-keyboard-mic.focus, ' +
        '.full-review-add.focus, .full-review.focus, ' +
        '.tag-count.focus, .settings-folder.focus, .settings-param.focus, ' +
        '.selectbox-item.focus, .selectbox-item:hover {' +
            'background: var(--main-color) !important;' +
        '}',
        '.online.focus {' +
            'box-shadow: 0 0 0 0.2em var(--main-color) !important;' +
        '}',
        '.online_modss.focus::after, .online-prestige.focus::after, ' +
        '.radio-item.focus .radio-item__imgbox:after, .iptv-channel.focus::before, ' +
        '.iptv-channel.last--focus::before {' +
            'border-color: var(--main-color) !important;' +
        '}',
        '.card-more.focus .card-more__box::after {' +
            'border: 0.3em solid var(--main-color) !important;' +
        '}',
        '.iptv-playlist-item.focus::after, .iptv-playlist-item:hover::after {' +
            'border-color: var(--main-color) !important;' +
        '}',
        '.ad-bot.focus .ad-bot__content::after, .ad-bot:hover .ad-bot__content::after, ' +
        '.card-episode.focus .full-episode::after, .register.focus::after, ' +
        '.season-episode.focus::after, .full-episode.focus::after, ' +
        '.full-review-add.focus::after, .card.focus .card__view::after, ' +
        '.card:hover .card__view::after, .extensions__item.focus:after, ' +
        '.torrent-item.focus::after, .extensions__block-add.focus:after {' +
            'border-color: var(--main-color) !important;' +
        '}',
        '.broadcast__scan > div {' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.card:hover .card__view, .card.focus .card__view {' +
            'border-color: var(--main-color) !important;' +
        '}',
        '.noty {' +
            'background: var(--main-color) !important;' +
        '}',
        '.radio-player.focus {' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.explorer-card__head-img.focus::after {' +
            'border: 0.3em solid var(--main-color) !important;' +
        '}',
        '.color_square.focus {' +
            'border: 0.3em solid ' + focusBorderColor + ' !important;' +
            'transform: scale(1.1) !important;' +
        '}',
        '.hex-input.focus {' +
            'border: 0.2em solid ' + focusBorderColor + ' !important;' +
            'transform: scale(1.1) !important;' +
        '}',
        'body.glass--style .selectbox-item.focus, ' +
        'body.glass--style .settings-folder.focus, ' +
        'body.glass--style .settings-param.focus {' +
            'background-color: var(--main-color) !important;' +
        '}',
        'body.glass--style .settings-folder.focus .settings-folder__icon {' +
            '-webkit-filter: none !important;' +
            'filter: none !important;' +
        '}',
        'body.glass--style .selectbox-item.focus::after {' +
            'border-color: #fff !important;' +
        '}',
        'body.glass--style .selectbox-item.focus {' +
            'filter: none !important;' +
        '}',
        'body.glass--style .selectbox-item.focus .selectbox-item__checkbox {' +
            'filter: none !important;' +
        '}',
        '.player-panel__position > div::after {' +
            'background-color: #fff !important;' +
        '}',
        '.player-panel__position {' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.time-line > div {' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.head__action.active::after {' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.card--tv .card__type {' +
            'background: var(--main-color) !important;' +
        '}',
        '.torrent-serial__progress {' +
            'background: var(--main-color) !important;' +
        '}',
        ,
        '.timetable__item--any::before {' +
            'background-color: rgba(var(--main-color-rgb), 0.3) !important;' +
        '}',
        '.element {' +
            'background: none !important;' +
            'width: 253px !important;' +
        '}',
        '.bookmarks-folder__layer {' +
            'background-color: var(--main-color) !important;' +
        '}',
        '.color_square.default {' +
            'background-color: #fff !important;' +
            'width: 35px !important;' +
            'height: 35px !important;' +
            'border-radius: 4px !important;' +
            'position: relative !important;' +
        '}',
        '.color_square.default::after {' +
            'content: "" !important;' +
            'position: absolute !important;' +
            'top: 50% !important;' +
            'left: 10% !important;' +
            'right: 10% !important;' +
            'height: 3px !important;' +
            'background-color: #353535 !important;' +
            'transform: rotate(45deg) !important;' +
        '}',
        '.color_square.default::before {' +
            'content: "" !important;' +
            'position: absolute !important;' +
            'top: 50% !important;' +
            'left: 10% !important;' +
            'right: 10% !important;' +
            'height: 3px !important;' +
            'background-color: #353535 !important;' +
            'transform: rotate(-45deg) !important;' +
        '}',
        '.color_square {' +
            'width: 35px !important;' +
            'height: 35px !important;' +
            'border-radius: 4px !important;' +
            'display: flex !important;' +
            'flex-direction: column !important;' +
            'justify-content: center !important;' +
            'align-items: center !important;' +
            'cursor: pointer !important;' +
            'color: #ffffff !important;' +
            'font-size: 10px !important;' +
            'text-align: center !important;' +
        '}',
        '.color-family-outline {' +
            'display: flex !important;' +
            'flex-direction: row !important;' +
            'flex-wrap: nowrap !important;' +
            'overflow-x: auto !important;' +
            'gap: 10px !important;' +
            'border-radius: 8px !important;' +
            'margin-bottom: 1px !important;' +
            'padding: 5px !important;' +
        '}',
        '.color-family-name {' +
            'width: 80px !important;' +
            'height: 35px !important;' +
            'border-width: 2px !important;' +
            'border-style: solid !important;' +
            'border-radius: 4px !important;' +
            'display: flex !important;' +
            'flex-direction: column !important;' +
            'justify-content: center !important;' +
            'align-items: center !important;' +
            'cursor: default !important;' +
            'color: #ffffff !important;' +
            'font-size: 10px !important;' +
            'font-weight: bold !important;' +
            'text-align: center !important;' +
            'text-transform: capitalize !important;' +
        '}',
        '.color_square .hex {' +
            'font-size: 9px !important;' +
            'opacity: 0.9 !important;' +
            'text-transform: uppercase !important;' +
            'z-index: 1 !important;' +
        '}',
        '.hex-input {' +
            'width: 266px !important;' +
            'height: 35px !important;' +
            'border-radius: 8px !important;' +
            'border: 2px solid #ddd !important;' +
            'position: relative !important;' +
            'cursor: pointer !important;' +
            'display: flex !important;' +
            'flex-direction: column !important;' +
            'align-items: center !important;' +
            'justify-content: center !important;' +
            'color: #fff !important;' +
            'font-size: 12px !important;' +
            'font-weight: bold !important;' +
            'text-shadow: 0 0 2px #000 !important;' +
            'background-color: #353535 !important;' +
        '}',
        '.hex-input.focus {' +
            'border: 0.2em solid ' + focusBorderColor + ' !important;' +
            'transform: scale(1.1) !important;' +
        '}',
        '.color-picker-container {' +
            'display: grid !important;' +
            'grid-template-columns: 1fr 1fr !important;' +
            'gap: 10px !important;' +
            'padding: 0 !important;' +
        '}',
        '.color-picker-container > div {' +
            'display: flex !important;' +
            'flex-direction: column !important;' +
            'gap: 1px !important;' +
        '}',
        '@media (max-width: 768px) {' +
            '.color-picker-container {' +
                'grid-template-columns: 1fr !important;' +
            '}' +
        '}',
        '.torrent-item__viewed {' +
            'color: var(--main-color) !important;' +
        '}',
        '.online-prestige__viewed {' +
            'background: rgb(255,255,255) !important;' +
            'color: rgba(var(--main-color-rgb), 1) !important;' +
        '}',
        '.extensions__item-proto.protocol-https {' +
            'color: var(--main-color) !important;' +
        '}',
        '.extensions__item-code.success {' +
            'color: var(--main-color) !important;' +
        '}',
        '.navigation-tabs__badge {' +
            'background: var(--main-color) !important;' +
        '}',
        '.player-info__values .value--size span {' +
            'background: rgba(var(--main-color-rgb), 1) !important;' +
        '}',
        '.torrent-item__ffprobe > div {' +
            'background: rgba(var(--main-color-rgb), 1) !important;' +
        '}',
        '.explorer-card__head-rate > span {' +
            'color: var(--main-color) !important;' +
        '}',
        '.explorer-card__head-rate > svg {' +
            'color: var(--main-color) !important;' +
        '}',
        '.console__tab > span {' +
            'background-color: #0009 !important;' +
        '}',
        '.torrent-item__size {' +
            'background-color: var(--main-color) !important;' +
            'color: #fff !important;' +
        '}',
        '.torrent-serial__size {' +
            'background: var(--main-color) !important;' +
        '}',
        '.notice__descr b {' +
            'color: var(--main-color) !important;' +
        '}',
        'circle[cx="24.1445"][cy="24.2546"][r="23.8115"] {' +
            'fill-opacity: 0 !important;' +
        '}',
        '.star-rating path[d="M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z"] {' +
            'fill: var(--main-color) !important;' +
        '}'
    ].join('');
// Застосовуємо стилі рамки та заокруглення з окремого модуля
if (window.ColorPluginHighlight && typeof window.ColorPluginHighlight.apply === 'function') {
    window.ColorPluginHighlight.apply(style);
}
    // Застосовуємо зміни, які не покриваються CSS
    updateDateElementStyles();
    forceBlackFilterBackground();
    updateSvgIcons();

    // Активуємо observer для нових елементів
    setupFilterObserver();
}
