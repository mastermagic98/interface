(function() {
    'use strict';

    var LAMPAC_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M20.331 14.644l-13.794-13.831 17.55 10.075zM2.938 0c-0.813 0.425-1.356 1.2-1.356 2.206v27.581c0 1.006 0.544 1.781 1.356 2.206l16.038-16zM29.512 14.1l-3.681-2.131-4.106 4.031 4.106 4.031 3.756-2.131c1.125-0.893 1.125-2.906-0.075-3.8zM6.538 31.188l17.55-10.075-3.756-3.756z" fill="currentColor"></path></svg>';

    var EXCLUDED_CLASSES = ['button--play', 'button--edit-order'];

    function t(key) {
        var translated = Lampa.Lang.translate(key);
        return translated && translated !== key ? translated : key.replace('custom_interface_plugin_', '');
    }

    var DEFAULT_GROUPS = [
        { name: 'online', patterns: ['online', 'lampac', 'modss', 'showy'], label: t('custom_interface_plugin_online') },
        { name: 'torrent', patterns: ['torrent'], label: t('custom_interface_plugin_torrent') },
        { name: 'trailer', patterns: ['trailer', 'rutube'], label: t('custom_interface_plugin_trailer') },
        { name: 'favorite', patterns: ['favorite'], label: t('custom_interface_plugin_favorite') },
        { name: 'subscribe', patterns: ['subscribe'], label: t('custom_interface_plugin_subscribe') },
        { name: 'book', patterns: ['book'], label: t('custom_interface_plugin_book') },
        { name: 'reaction', patterns: ['reaction'], label: t('custom_interface_plugin_reaction') }
    ];

    var currentButtons = [];
    var allButtonsCache = [];
    var allButtonsOriginal = [];
    var currentContainer = null;

    Lampa.Lang.add({
        custom_interface_plugin_button_order: { uk: 'Порядок кнопок', ru: 'Порядок кнопок', en: 'Buttons order' },
        custom_interface_plugin_button_view: { uk: 'Вигляд кнопок', ru: 'Вид кнопок', en: 'Buttons view' },
        custom_interface_plugin_standard: { uk: 'Стандартний', ru: 'Стандартный', en: 'Default' },
        custom_interface_plugin_icons_only: { uk: 'Тільки іконки', ru: 'Только иконки', en: 'Icons only' },
        custom_interface_plugin_with_text: { uk: 'Завжди з текстом', ru: 'С текстом', en: 'Always text' },
        custom_interface_plugin_reset_default: { uk: 'Скинути за замовчуванням', ru: 'Сбросить по умолчанию', en: 'Reset to default' },
        custom_interface_plugin_button_editor: { uk: 'Редактор кнопок', ru: 'Редактор кнопок', en: 'Buttons editor' },
        custom_interface_plugin_online: { uk: 'Онлайн', ru: 'Онлайн', en: 'Online' },
        custom_interface_plugin_torrent: { uk: 'Торенти', ru: 'Торренты', en: 'Torrents' },
        custom_interface_plugin_trailer: { uk: 'Трейлери', ru: 'Трейлеры', en: 'Trailers' },
        custom_interface_plugin_favorite: { uk: 'Обране', ru: 'Избранное', en: 'Favorites' },
        custom_interface_plugin_subscribe: { uk: 'Підписка', ru: 'Подписка', en: 'Subscriptions' },
        custom_interface_plugin_book: { uk: 'Закладки', ru: 'Закладки', en: 'Bookmarks' },
        custom_interface_plugin_reaction: { uk: 'Реакції', ru: 'Реакции', en: 'Reactions' },
        custom_interface_plugin_button_unknown: { uk: 'Кнопка', ru: 'Кнопка', en: 'Button' }
    });

    // ... (весь інший код функцій без змін — findButton, getCustomOrder, тощо, як у попередній версії)

    function init() {
        var style = $('<style>' +
            '@keyframes button-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }' +
            '.full-start-new__buttons .full-start__button { opacity: 0; }' +
            '.full-start__button.hidden { display: none !important; }' +
            '.full-start-new__buttons { display: flex !important; flex-direction: row !important; flex-wrap: wrap !important; gap: 0.5em !important; }' +
            '.full-start-new__buttons.buttons-loading .full-start__button { visibility: hidden !important; }' +

            /* Нова кнопка "Вигляд кнопок" */
            '.viewmode-switch { background: white !important; color: black !important; margin: 0.5em 0 1em 0; border-radius: 0.3em; }' +
            '.viewmode-switch.focus { background: black !important; color: white !important; border: 3px solid rgba(255,255,255,0.8); }' +

            /* Нова кнопка "Скинути за замовчуванням" */
            '.folder-reset-button { background: white !important; color: white !important; margin-top: 1em; border-radius: 0.3em; }' +
            '.folder-reset-button > div { color: black !important; }' +  /* текст чорний у звичайному стані */
            '.folder-reset-button.focus { background: black !important; border: 3px solid rgba(255,255,255,0.8); }' +
            '.folder-reset-button.focus > div { color: white !important; }' +

            '.menu-edit-list__toggle.focus { border: 2px solid rgba(255,255,255,0.8); border-radius: 0.3em; }' +
            '.full-start-new__buttons.icons-only .full-start__button span { display: none; }' +
            '.full-start-new__buttons.always-text .full-start__button span { display: block !important; }' +
            '.menu-edit-list__item-hidden { opacity: 0.5; }' +
            '</style>');
        $('body').append(style);

        // ... (решта коду init без змін — Listener, SettingsApi тощо)
        
        Lampa.Listener.follow('full', function(e) {
            if (e.type !== 'complite') return;
            var container = e.object && e.object.activity ? e.object.activity.render() : null;
            if (!container) return;
            var targetContainer = container.find('.full-start-new__buttons');
            if (targetContainer.length) {
                targetContainer.addClass('buttons-loading');
            }
            setTimeout(function() {
                try {
                    if (!container.data('buttons-processed')) {
                        container.data('buttons-processed', true);
                        if (reorderButtons(container)) {
                            if (targetContainer.length) {
                                targetContainer.removeClass('buttons-loading');
                            }
                            refreshController();
                        }
                    }
                } catch (err) {
                    console.error('Buttons editor plugin error:', err);
                    if (targetContainer.length) {
                        targetContainer.removeClass('buttons-loading');
                    }
                }
            }, 400);
        });
    }

    if (Lampa.SettingsApi) {
        try {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: { name: 'buttons_editor_enabled', type: 'trigger', default: true },
                field: { name: t('custom_interface_plugin_button_editor') },
                onChange: function(value) {
                    setTimeout(function() {
                        var currentValue = Lampa.Storage.get('buttons_editor_enabled', true);
                        if (currentValue) {
                            $('.button--edit-order').show();
                        } else {
                            $('.button--edit-order').hide();
                        }
                    }, 100);
                },
                onRender: function(element) {
                    setTimeout(function() {
                        var sizeEl = $('div[data-name="interface_size"]');
                        if (sizeEl.length) sizeEl.after(element);
                    }, 0);
                }
            });
        } catch (e) {
            console.error('SettingsApi error:', e);
        }
    }

    try {
        init();
    } catch (e) {
        console.error('Plugin init error:', e);
    }

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {};
    }
})();
