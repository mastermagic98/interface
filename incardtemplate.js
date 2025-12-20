(function () {  
    'use strict';  
  
    // Реєструємо параметри перед використанням  
    if (typeof Lampa.Params !== 'undefined') {  
        Lampa.Params.trigger('show_all_buttons', false);  
        Lampa.Params.trigger('button_text_mode', 'default');  
    }  
  
    // --- Локалізація ---  
    function Lang() {  
    Lampa.Lang.add({  
        show_all_buttons_name: {  
            ru: 'Показать все кнопки',  
            en: 'Show all buttons',  
            uk: 'Показувати всі кнопки'  
        },  
        show_all_buttons_desc: {  
            ru: 'Отображает все кнопки действий, включая скрытые под «Смотреть»',  
            en: 'Displays all action buttons, including those hidden under "Watch"',  
            uk: 'Відображає всі кнопки дій, включно з тими, що сховані під «Дивитись»'  
        },  
        button_text_mode_name: {  
            ru: 'Текст на кнопках',  
            en: 'Button text mode',  
            uk: 'Текст на кнопках'  
        },  
        button_text_mode_desc: {  
            ru: 'Изменение текста на кнопках',  
            en: 'Controls how text is shown on buttons',  
            uk: 'Змінює вигляд тексту на кнопках'  
        },  
        button_text_mode_default: {  
            ru: 'по умолчанию',  
            en: 'default',  
            uk: 'за замовчуванням'  
        },  
        button_text_mode_show: {  
            ru: 'всегда отображается',  
            en: 'show text',  
            uk: 'завжди відображається'  
        },  
        button_text_mode_hide: {  
            ru: 'всегда скрыт',  
            en: 'hide text',  
            uk: 'завжди прихований'  
        }  
    });  
}  
  
    // --- Показ усіх кнопок ---  
    function applyShowAllButtons() {  
        Lampa.Listener.follow('full', function (e) {  
            if (e.type !== 'complite') return;  
            setTimeout(function () {  
                try {  
                    if (Lampa.Storage.get('show_all_buttons', false) !== true) return;  
  
                    var fullContainer = e.object.activity.render();  
                    var targetContainer = fullContainer.find('.full-start-new__buttons');  
                    if (!targetContainer.length) return;  
  
                    fullContainer.find('.button--play').remove();  
                    var allButtons = fullContainer.find('.buttons--container .full-start__button')  
                        .add(targetContainer.find('.full-start__button'));  
  
                    var categories = { online: [], torrent: [], trailer: [], other: [] };  
                    allButtons.each(function () {  
                        var $b = $(this);  
                        var cls = $b.attr('class') || '';  
                        if (cls.indexOf('online') !== -1) categories.online.push($b);  
                        else if (cls.indexOf('torrent') !== -1) categories.torrent.push($b);  
                        else if (cls.indexOf('trailer') !== -1) categories.trailer.push($b);  
                        else categories.other.push($b.clone(true));  
                    });  
  
                    var order = ['torrent', 'online', 'trailer', 'other'];  
                    targetContainer.empty();  
                    order.forEach(function (c) {  
                        categories[c].forEach(function ($b) { targetContainer.append($b); });  
                    });  
  
                    targetContainer.css({  
                        display: 'flex',  
                        flexWrap: 'wrap',  
                        gap: '10px',  
                        justifyContent: 'flex-start'  
                    });  
  
                    applyButtonTextMode();  
                    Lampa.Controller.toggle('full_start');  
                } catch (err) {  
                    console.error('[ShowAllButtons] Error:', err);  
                }  
            }, 200);  
        });  
    }  
  
    // --- Застосування стилю для тексту на кнопках ---  
    function applyButtonTextMode() {  
        var mode = Lampa.Storage.get('button_text_mode', 'default');  
        $('#button_text_mode_style').remove();  
  
        var css = '';  
        if (mode === 'show') {  
            css = '.full-start-new__buttons .full-start__button span { display:inline !important; }';  
        } else if (mode === 'hide') {  
            css = '.full-start-new__buttons .full-start__button span { display:none !important; }';  
        }  
  
        if (css) {  
            $('body').append('<style id="button_text_mode_style">' + css + '</style>');  
        }  
    }  
  
    // --- Налаштування ---  
    function Settings() {  
        // Перевіряємо, чи існує компонент  
        if (!Lampa.SettingsApi.getComponent('interface_customization')) {  
            Lampa.SettingsApi.addComponent({  
                component: 'interface_customization',  
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14" fill="none"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H1a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2m-7 9l-1 2.5M8 11l1 2.5m-5 0h6M7.5 2v9M3 5h2M3 8h1"/><path d="m7.5 7l1.21-1a2 2 0 0 1 2.55 0l2.24 2"/></g></svg>',  
                name: 'Кастомізація інтерфейсу'  
            });  
        }  
  
        // 1. Опція: показувати всі кнопки  
        Lampa.SettingsApi.addParam({  
            component: 'interface_customization',  
            param: {   
                name: 'show_all_buttons',   
                type: 'trigger',   
                default: false   
            },  
            field: {  
                name: '<div style="display: flex; align-items: center;"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; flex-shrink: 0; min-width: 32px; min-height: 32px; max-width: 32px; max-height: 32px;"><g transform="scale(2.1)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M94.8,118.2H29.5c-10.8,0-19.5-8.8-19.5-19.5V33.4c0-10.8,8.8-19.5,19.5-19.5h65.3c10.8,0,19.5,8.8,19.5,19.5v65.3C114.4,109.5,105.6,118.2,94.8,118.2z M29.5,25c-4.6,0-8.4,3.8-8.4,8.4v65.3c0,4.6,3.8,8.4,8.4,8.4h65.3c4.6,0,8.4-3.8,8.4-8.4V33.4c0-4.6-3.8-8.4-8.4-8.4H29.5z"/><path d="M94.8,242.1H29.5c-10.8,0-19.5-8.8-19.5-19.5v-65.3c0-10.8,8.8-19.5,19.5-19.5h65.3c10.8,0,19.5,8.8,19.5,19.5v65.3C114.4,233.3,105.6,242.1,94.8,242.1z M29.5,148.9c-4.6,0-8.4,3.8-8.4,8.4v65.3c0,4.6,3.8,8.4,8.4,8.4h65.3c4.6,0,8.4-3.8,8.4-8.4v-65.3c0-4.6-3.8-8.4-8.4-8.4L29.5,148.9L29.5,148.9z"/><path d="M147.2,44.9H246v14.9h-98.8V44.9z"/><path d="M147.2,85.7H246v14.9h-98.8V85.7z"/><path d="M147.2,162.1H246v14.9h-98.8V162.1z"/><path d="M147.2,202.9H246v14.9h-98.8V202.9z"/></g></svg>' + Lampa.Lang.translate('show_all_buttons_name'),  
                description: Lampa.Lang.translate('show_all_buttons_desc')  
            },  
            onChange: function (value) {  
                Lampa.Storage.set('show_all_buttons', value);  
                setTimeout(function () {  
                    location.reload();  
                }, 300);  
            }  
        });  
  
        // 2. Опція: режим тексту на кнопках  
        Lampa.SettingsApi.addParam({  
            component: 'interface_customization',  
            param: {  
                name: 'button_text_mode',  
                type: 'select',  
                values: {  
                    'default': Lampa.Lang.translate('button_text_mode_default'),  
                    'show': Lampa.Lang.translate('button_text_mode_show'),  
                    'hide': Lampa.Lang.translate('button_text_mode_hide')  
                },  
                default: 'default'  
            },  
            field: {  
                name: '<div style="display: flex; align-items: center;"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; flex-shrink: 0; min-width: 32px; min-height: 32px; max-width: 32px; max-height: 32px;"><g transform="scale(2.1)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M94.8,118.2H29.5c-10.8,0-19.5-8.8-19.5-19.5V33.4c0-10.8,8.8-19.5,19.5-19.5h65.3c10.8,0,19.5,8.8,19.5,19.5v65.3C114.4,109.5,105.6,118.2,94.8,118.2z M29.5,25c-4.6,0-8.4,3.8-8.4,8.4v65.3c0,4.6,3.8,8.4,8.4,8.4h65.3c4.6,0,8.4-3.8,8.4-8.4V33.4c0-4.6-3.8-8.4-8.4-8.4H29.5z"/><path d="M94.8,242.1H29.5c-10.8,0-19.5-8.8-19.5-19.5v-65.3c0-10.8,8.8-19.5,19.5-19.5h65.3c10.8,0,19.5,8.8,19.5,19.5v65.3C114.4,233.3,105.6,242.1,94.8,242.1z M29.5,148.9c-4.6,0-8.4,3.8-8.4,8.4v65.3c0,4.6,3.8,8.4,8.4,8.4h65.3c4.6,0,8.4-3.8,8.4-8.4v-65.3c0-4.6-3.8-8.4-8.4-8.4L29.5,148.9L29.5,148.9z"/><path d="M147.2,44.9H246v14.9h-98.8V44.9z"/><path d="M147.2,85.7H246v14.9h-98.8V85.7z"/><path d="M147.2,162.1H246v14.9h-98.8V162.1z"/><path d="M147.2,202.9H246v14.9h-98.8V202.9z"/></g></svg>' + Lampa.Lang.translate('button_text_mode_name'),  
                description: Lampa.Lang.translate('button_text_mode_desc')  
            },  
            onChange: function (value) {  
                Lampa.Storage.set('button_text_mode', value);  
                applyButtonTextMode();  
            }  
        });  
    }  
  
    // --- Ініціалізація ---  
    function init() {  
        Lang();  
        Settings();  
        applyButtonTextMode();  
        applyShowAllButtons();  
  
        Lampa.Listener.follow('full', function (e) {  
            if (e.type === 'complite') {  
                applyButtonTextMode();  
                if (Lampa.Storage.get('show_all_buttons', false)) applyShowAllButtons();  
            }  
        });  
    }  
  
    // --- Запуск ---  
    if (window.appready) init();  
    else {  
        Lampa.Listener.follow('app', function (e) {  
            if (e.type === 'ready') init();  
        });  
    }  
})();
