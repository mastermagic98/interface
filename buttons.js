(function () {
    'use strict';

    /* =========================
       ЛОКАЛІЗАЦІЯ
    ========================= */

    Lampa.Lang.add({
        custom_interface_plugin: {
            uk: {
                online: 'Онлайн',
                torrent: 'Торенти',
                trailer: 'Трейлери',
                favorite: 'Обране',
                subscribe: 'Підписка',
                book: 'Закладки',
                reaction: 'Реакції',
                button: 'Кнопка',

                standard: 'Стандартний',
                icons_only: 'Лише іконки',
                with_text: 'З текстом',

                button_view: 'Вигляд кнопок',
                reset_default: 'Скинути за замовчуванням',
                button_order: 'Порядок кнопок',
                button_editor: 'Редактор кнопок'
            },
            ru: {
                online: 'Онлайн',
                torrent: 'Торренты',
                trailer: 'Трейлеры',
                favorite: 'Избранное',
                subscribe: 'Подписка',
                book: 'Закладки',
                reaction: 'Реакции',
                button: 'Кнопка',

                standard: 'Стандартный',
                icons_only: 'Только иконки',
                with_text: 'С текстом',

                button_view: 'Вид кнопок',
                reset_default: 'Сбросить по умолчанию',
                button_order: 'Порядок кнопок',
                button_editor: 'Редактор кнопок'
            },
            en: {
                online: 'Online',
                torrent: 'Torrents',
                trailer: 'Trailers',
                favorite: 'Favorites',
                subscribe: 'Subscribe',
                book: 'Bookmarks',
                reaction: 'Reactions',
                button: 'Button',

                standard: 'Standard',
                icons_only: 'Icons only',
                with_text: 'With text',

                button_view: 'Button view',
                reset_default: 'Reset to default',
                button_order: 'Button order',
                button_editor: 'Button editor'
            }
        }
    });

    function t(key) {
        return Lampa.Lang.translate('custom_interface_plugin_' + key);
    }

    /* =========================
       КОНСТАНТИ
    ========================= */

    var LAMPAC_ICON =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
        '<path d="M20.331 14.644l-13.794-13.831 17.55 10.075zM2.938 0c-0.813 0.425-1.356 1.2-1.356 2.206v27.581c0 1.006 0.544 1.781 1.356 2.206l16.038-16zM29.512 14.1l-3.681-2.131-4.106 4.031 4.106 4.031 3.756-2.131c1.125-0.893 1.125-2.906-0.075-3.8zM6.538 31.188l17.55-10.075-3.756-3.756z" fill="currentColor"></path>' +
        '</svg>';

    var EXCLUDED_CLASSES = ['button--play', 'button--edit-order'];

    var DEFAULT_GROUPS = [
        { name: 'online', patterns: ['online', 'lampac', 'modss', 'showy'], label: t('online') },
        { name: 'torrent', patterns: ['torrent'], label: t('torrent') },
        { name: 'trailer', patterns: ['trailer', 'rutube'], label: t('trailer') },
        { name: 'favorite', patterns: ['favorite'], label: t('favorite') },
        { name: 'subscribe', patterns: ['subscribe'], label: t('subscribe') },
        { name: 'book', patterns: ['book'], label: t('book') },
        { name: 'reaction', patterns: ['reaction'], label: t('reaction') }
    ];

    /* =========================
       СТАН
    ========================= */

    var currentButtons = [];
    var allButtonsCache = [];
    var allButtonsOriginal = [];
    var currentContainer = null;

    /* =========================
       STORAGE
    ========================= */

    function getCustomOrder() {
        return Lampa.Storage.get('button_custom_order', []);
    }

    function setCustomOrder(order) {
        Lampa.Storage.set('button_custom_order', order);
    }

    function getHiddenButtons() {
        return Lampa.Storage.get('button_hidden', []);
    }

    function setHiddenButtons(hidden) {
        Lampa.Storage.set('button_hidden', hidden);
    }

    /* =========================
       ІДЕНТИФІКАЦІЯ КНОПОК
    ========================= */

    function getButtonId(button) {
        var classes = button.attr('class') || '';
        var text = button.find('span').text().trim().replace(/\s+/g, '_');
        var subtitle = button.attr('data-subtitle') || '';

        if (classes.indexOf('modss') !== -1 || text.indexOf('MOD') !== -1) {
            return 'modss_online_button';
        }

        if (classes.indexOf('showy') !== -1 || text.indexOf('Showy') !== -1) {
            return 'showy_online_button';
        }

        var view = classes.split(' ').filter(function (c) {
            return c.indexOf('view--') === 0 || c.indexOf('button--') === 0;
        }).join('_');

        var id = (view || 'button') + '_' + text;

        if (subtitle) {
            id += '_' + subtitle.replace(/\s+/g, '_').substring(0, 30);
        }

        return id;
    }

    function getButtonType(button) {
        var classes = button.attr('class') || '';

        for (var i = 0; i < DEFAULT_GROUPS.length; i++) {
            var g = DEFAULT_GROUPS[i];
            for (var j = 0; j < g.patterns.length; j++) {
                if (classes.indexOf(g.patterns[j]) !== -1) {
                    return g.name;
                }
            }
        }
        return 'other';
    }

    function isExcluded(button) {
        var classes = button.attr('class') || '';
        return EXCLUDED_CLASSES.some(function (c) {
            return classes.indexOf(c) !== -1;
        });
    }

    /* =========================
       ГРУПУВАННЯ
    ========================= */

    function categorizeButtons(container) {
        var buttons = container.find('.full-start__button')
            .not('.button--play, .button--edit-order');

        var result = {
            online: [], torrent: [], trailer: [],
            favorite: [], subscribe: [], book: [],
            reaction: [], other: []
        };

        buttons.each(function () {
            var btn = $(this);
            if (isExcluded(btn)) return;

            var type = getButtonType(btn);

            if (type === 'online' &&
                btn.hasClass('lampac--button') &&
                !btn.hasClass('modss--button') &&
                !btn.hasClass('showy--button')) {

                var svg = btn.find('svg').first();
                if (svg.length) svg.replaceWith(LAMPAC_ICON);
            }

            (result[type] || result.other).push(btn);
        });

        return result;
    }

    /* =========================
       СОРТУВАННЯ / ВИДИМІСТЬ
    ========================= */

    function sortByCustomOrder(buttons) {
        var order = getCustomOrder();
        if (!order.length) return buttons;

        var sorted = [];
        var rest = buttons.slice();

        order.forEach(function (id) {
            for (var i = 0; i < rest.length; i++) {
                if (getButtonId(rest[i]) === id) {
                    sorted.push(rest.splice(i, 1)[0]);
                    break;
                }
            }
        });

        return sorted.concat(rest);
    }

    function applyHiddenButtons(buttons) {
        var hidden = getHiddenButtons();
        buttons.forEach(function (btn) {
            btn.toggleClass('hidden', hidden.indexOf(getButtonId(btn)) !== -1);
        });
    }

    /* =========================
       UI / ДІАЛОГ
    ========================= */

    function openEditDialog() {
        var list = $('<div class="menu-edit-list"></div>');

        var modes = ['default', 'icons', 'always'];
        var labels = {
            default: t('standard'),
            icons: t('icons_only'),
            always: t('with_text')
        };

        var mode = Lampa.Storage.get('buttons_viewmode', 'default');

        var modeBtn = $('<div class="selector viewmode-switch"><div>' +
            t('button_view') + ': ' + labels[mode] +
            '</div></div>');

        modeBtn.on('hover:enter', function () {
            mode = modes[(modes.indexOf(mode) + 1) % modes.length];
            Lampa.Storage.set('buttons_viewmode', mode);
            modeBtn.find('div').text(t('button_view') + ': ' + labels[mode]);
        });

        list.append(modeBtn);

        currentButtons.forEach(function (btn) {
            var id = getButtonId(btn);
            var hidden = getHiddenButtons().indexOf(id) !== -1;

            var item = $('<div class="menu-edit-list__item">' +
                '<div class="menu-edit-list__title">' +
                (btn.find('span').text() || t('button')) +
                '</div></div>');

            item.toggleClass('menu-edit-list__item-hidden', hidden);
            list.append(item);
        });

        var reset = $('<div class="selector folder-reset-button"><div>' +
            t('reset_default') +
            '</div></div>');

        reset.on('hover:enter', function () {
            Lampa.Storage.set('button_custom_order', []);
            Lampa.Storage.set('button_hidden', []);
            Lampa.Storage.set('buttons_viewmode', 'default');
            Lampa.Modal.close();
        });

        list.append(reset);

        Lampa.Modal.open({
            title: t('button_order'),
            html: list,
            size: 'small'
        });
    }

    /* =========================
       ІНІЦІАЛІЗАЦІЯ
    ========================= */

    function init() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;
            currentContainer = e.object.activity.render();
        });
    }

    if (Lampa.SettingsApi) {
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'buttons_editor_enabled',
                type: 'trigger',
                default: true
            },
            field: {
                name: t('button_editor')
            }
        });
    }

    init();

})();
