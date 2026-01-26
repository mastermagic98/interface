// color_plugin_styles.js
// Функція застосування / скасування стилів плагіну зміни кольору

function applyStyles() {
    // Якщо плагін вимкнено — повністю видаляємо всі стилі та скасовуємо inline-зміни
    if (!ColorPlugin.settings.enabled) {
        var oldStyle = document.getElementById('color-plugin-styles');
        if (oldStyle) {
            oldStyle.remove();
        }

        revertChanges();
        disconnectFilterObserver();

        return;
    }

    // Валідація кольору (на випадок пошкодженого значення)
    if (!isValidHex(ColorPlugin.settings.main_color)) {
        ColorPlugin.settings.main_color = '#353535';
    }

    // Створюємо або оновлюємо елемент <style>
    var style = document.getElementById('color-plugin-styles');
    if (!style) {
        style = document.createElement('style');
        style.id = 'color-plugin-styles';
        document.head.appendChild(style);
    }

    var rgbColor = hexToRgb(ColorPlugin.settings.main_color);

    // Стилі для затемнення (якщо увімкнено)
    var dimmingStyles = ColorPlugin.settings.dimming_enabled ? (
        '.full-start__rate {' +
            'background: rgba(var(--main-color-rgb), 0.15) !important;' +
        '}' +
        '.full-start__rate > div:first-child {' +
            'background: rgba(var(--main-color-rgb), 0.15) !important;' +
        '}' +
        '.reaction {' +
            'background-color: rgba(var(--main-color-rgb), 0.3) !important;' +
        '}' +
        '.full-start__button {' +
            'background-color: rgba(var(--main-color-rgb), 0.3) !important;' +
        '}' +
        '.card__vote {' +
            'background: rgba(var(--main-color-rgb), 0.5) !important;' +
        '}' +
        '.items-line__more {' +
            'background: rgba(var(--main-color-rgb), 0.3) !important;' +
        '}' +
        '.card__icons-inner {' +
            'background: rgba(var(--main-color-rgb), 0.5) !important;' +
        '}' +
        '.simple-button--filter > div {' +
            'background-color: rgba(var(--main-color-rgb), 0.3) !important;' +
        '}'
    ) : '';

    // Повний набір стилів (без рамок/тіней при фокусі)
    style.innerHTML = [
        ':root {',
            '--main-color: ' + ColorPlugin.settings.main_color + ' !important;',
            '--main-color-rgb: ' + rgbColor + ' !important;',
            '--accent-color: ' + ColorPlugin.settings.main_color + ' !important;',
        '}',

        '.modal__title {',
            'font-size: 1.7em !important;',
        '}',
        '.modal__head {',
            'margin-bottom: 0 !important;',
        '}',
        '.modal .scroll__content {',
            'padding: 1.0em 0 !important;',
        '}',

        '.menu__ico, .menu__ico:hover, .menu__ico.traverse, ',
        '.head__action, .head__action.focus, .head__action:hover, .settings-param__ico {',
            'color: #ffffff !important;',
            'fill: #ffffff !important;',
        '}',

        '.menu__ico.focus {',
            'color: #ffffff !important;',
            'fill: #ffffff !important;',
            'stroke: none !important;',
        '}',

        '.menu__item.focus .menu__ico path[fill], .menu__item.focus .menu__ico rect[fill], ',
        '.menu__item.focus .menu__ico circle[fill], .menu__item.traverse .menu__ico path[fill], ',
        '.menu__item.traverse .menu__ico rect[fill], .menu__item.traverse .menu__ico circle[fill], ',
        '.menu__item:hover .menu__ico path[fill], .menu__item:hover .menu__ico rect[fill], ',
        '.menu__item:hover .menu__ico circle[fill] {',
            'fill: #ffffff !important;',
        '}',

        '.menu__item.focus .menu__ico [stroke], .menu__item.traverse .menu__ico [stroke], ',
        '.menu__item:hover .menu__ico [stroke] {',
            'stroke: #fff !important;',
        '}',

        '.menu__item, .menu__item.focus, .menu__item.traverse, .menu__item:hover, ',
        '.console__tab, .console__tab.focus, ',
        '.settings-param, .settings-param.focus, ',
        '.selectbox-item, .selectbox-item.focus, .selectbox-item:hover, ',
        '.full-person, .full-person.focus, ',
        '.full-start__button, .full-start__button.focus, ',
        '.full-descr__tag, .full-descr__tag.focus, ',
        '.simple-button, .simple-button.focus, ',
        '.player-panel .button, .player-panel .button.focus, ',
        '.search-source, .search-source.active, ',
        '.radio-item, .radio-item.focus, ',
        '.lang__selector-item, .lang__selector-item.focus, ',
        '.modal__button, .modal__button.focus, ',
        '.search-history-key, .search-history-key.focus, ',
        '.simple-keyboard-mic, .simple-keyboard-mic.focus, ',
        '.full-review-add, .full-review-add.focus, ',
        '.full-review, .full-review.focus, ',
        '.tag-count, .tag-count.focus, ',
        '.settings-folder, .settings-folder.focus, ',
        '.noty, ',
        '.radio-player, .radio-player.focus {',
            'color: #ffffff !important;',
        '}',

        '.console__tab {',
            'background-color: var(--main-color) !important;',
        '}',
        '.console__tab.focus {',
            'background: var(--main-color) !important;',
            'color: #fff !important;',
        '}',

        '.menu__item.focus, .menu__item.traverse, .menu__item:hover, ',
        '.full-person.focus, .full-start__button.focus, .full-descr__tag.focus, ',
        '.simple-button.focus, .head__action.focus, .head__action:hover, ',
        '.player-panel .button.focus, .search-source.active {',
            'background: var(--main-color) !important;',
        '}',

        '.player-panel .button.focus {',
            'background-color: var(--main-color) !important;',
            'color: #fff !important;',
        '}',

        '.full-start__button.focus, .settings-param.focus, .items-line__more.focus, ',
        '.menu__item.focus, .settings-folder.focus, .head__action.focus, ',
        '.selectbox-item.focus, .simple-button.focus, .navigation-tabs__button.focus {',
            'background: var(--main-color) !important;',
        '}',

        '.timetable__item.focus::before {',
            'background-color: var(--main-color) !important;',
        '}',

        '.navigation-tabs__button.focus {',
            'background-color: var(--main-color) !important;',
            'color: #fff !important;',
        '}',

        '.items-line__more.focus {',
            'color: #fff !important;',
            'background-color: var(--main-color) !important;',
        '}',

        '.timetable__item.focus {',
            'color: #fff !important;',
        '}',

        '.broadcast__device.focus {',
            'background-color: var(--main-color) !important;',
            'color: #fff !important;',
        '}',

        '.iptv-menu__list-item.focus, .iptv-program__timeline > div {',
            'background-color: var(--main-color) !important;',
        '}',

        '.radio-item.focus, .lang__selector-item.focus, .simple-keyboard .hg-button.focus, ',
        '.modal__button.focus, .search-history-key.focus, .simple-keyboard-mic.focus, ',
        '.full-review-add.focus, .full-review.focus, ',
        '.tag-count.focus, .settings-folder.focus, .settings-param.focus, ',
        '.selectbox-item.focus, .selectbox-item:hover {',
            'background: var(--main-color) !important;',
        '}',

        '.online.focus {',
            'box-shadow: 0 0 0 0.2em var(--main-color) !important;',
        '}',

        '.online_modss.focus::after, .online-prestige.focus::after, ',
        '.radio-item.focus .radio-item__imgbox:after, .iptv-channel.focus::before, ',
        '.iptv-channel.last--focus::before {',
            'border-color: var(--main-color) !important;',
        '}',

        '.card-more.focus .card-more__box::after {',
            'border: 0.3em solid var(--main-color) !important;',
        '}',

        '.iptv-playlist-item.focus::after, .iptv-playlist-item:hover::after {',
            'border-color: var(--main-color) !important;',
        '}',

        '.ad-bot.focus .ad-bot__content::after, .ad-bot:hover .ad-bot__content::after, ',
        '.card-episode.focus .full-episode::after, .register.focus::after, ',
        '.season-episode.focus::after, .full-episode.focus::after, ',
        '.full-review-add.focus::after, .card.focus .card__view::after, ',
        '.card:hover .card__view::after, .extensions__item.focus:after, ',
        '.torrent-item.focus::after, .extensions__block-add.focus:after {',
            'border-color: var(--main-color) !important;',
        '}',

        '.broadcast__scan > div {',
            'background-color: var(--main-color) !important;',
        '}',

        '.card:hover .card__view, .card.focus .card__view {',
            'border-color: var(--main-color) !important;',
        '}',

        '.noty {',
            'background: var(--main-color) !important;',
        '}',

        '.radio-player.focus {',
            'background-color: var(--main-color) !important;',
        '}',

        '.explorer-card__head-img.focus::after {',
            'border: 0.3em solid var(--main-color) !important;',
        '}',

        '.player-panel__position {',
            'background-color: var(--main-color) !important;',
        '}',
        '.player-panel__position > div::after {',
            'background-color: #fff !important;',
        '}',

        '.time-line > div {',
            'background-color: var(--main-color) !important;',
        '}',

        '.head__action.active::after {',
            'background-color: var(--main-color) !important;',
        '}',

        '.card--tv .card__type {',
            'background: var(--main-color) !important;',
        '}',

        '.torrent-serial__progress {',
            'background: var(--main-color) !important;',
        '}',

        dimmingStyles,

        '.timetable__item--any::before {',
            'background-color: rgba(var(--main-color-rgb), 0.3) !important;',
        '}',

        '.element {',
            'background: none !important;',
            'width: 253px !important;',
        '}',

        '.bookmarks-folder__layer {',
            'background-color: var(--main-color) !important;',
        '}',

        '.torrent-item__viewed {',
            'color: var(--main-color) !important;',
        '}',
        '.online-prestige__viewed {',
            'background: rgb(255,255,255) !important;',
            'color: rgba(var(--main-color-rgb), 1) !important;',
        '}',
        '.extensions__item-proto.protocol-https {',
            'color: var(--main-color) !important;',
        '}',
        '.extensions__item-code.success {',
            'color: var(--main-color) !important;',
        '}',
        '.navigation-tabs__badge {',
            'background: var(--main-color) !important;',
        '}',
        '.player-info__values .value--size span {',
            'background: rgba(var(--main-color-rgb), 1) !important;',
        '}',
        '.torrent-item__ffprobe > div {',
            'background: rgba(var(--main-color-rgb), 1) !important;',
        '}',
        '.explorer-card__head-rate > span {',
            'color: var(--main-color) !important;',
        '}',
        '.explorer-card__head-rate > svg {',
            'color: var(--main-color) !important;',
        '}',
        '.console__tab > span {',
            'background-color: #0009 !important;',
        '}',
        '.torrent-item__size {',
            'background-color: var(--main-color) !important;',
            'color: #fff !important;',
        '}',
        '.torrent-serial__size {',
            'background: var(--main-color) !important;',
        '}',
        '.notice__descr b {',
            'color: var(--main-color) !important;',
        '}',

        'circle[cx="24.1445"][cy="24.2546"][r="23.8115"] {',
            'fill-opacity: 0 !important;',
        '}',

        '.star-rating path[d="M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z"] {',
            'fill: var(--main-color) !important;',
        '}'
    ].join('');

    // Застосовуємо inline-зміни та спеціальні обробники
    updateDateElementStyles();
    forceBlackFilterBackground();
    updateSvgIcons();

    // Активуємо спостереження за появою нових фільтрів
    setupFilterObserver();
}
