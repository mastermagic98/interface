(function () {  
  'use strict';  
  
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
        ru: 'Режим текста на кнопках',  
        en: 'Button text mode',  
        uk: 'Режим відображення тексту на кнопках'  
      },  
      button_text_mode_desc: {  
        ru: 'Настройка отображения текста на кнопках',  
        en: 'Controls how text is shown on buttons',  
        uk: 'Керує тим, як відображається текст на кнопках'  
      },  
      button_text_mode_default: {  
        ru: 'Стандартный',  
        en: 'Default',  
        uk: 'Стандартний'  
      },  
      button_text_mode_show: {  
        ru: 'Показать текст',  
        en: 'Show text',  
        uk: 'Показати текст'  
      },  
      button_text_mode_hide: {  
        ru: 'Скрыть текст',  
        en: 'Hide text',  
        uk: 'Приховати текст'  
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
  
          // Прибираємо кнопку «Дивитись» і збираємо всі кнопки  
          fullContainer.find('.button--play').remove();  
          var allButtons = fullContainer.find('.buttons--container .full-start__button')  
            .add(targetContainer.find('.full-start__button'));  
  
          // Категоризація  
          var categories = { online: [], torrent: [], trailer: [], other: [] };  
          allButtons.each(function () {  
            var $b = $(this);  
            var cls = $b.attr('class') || '';  
            if (cls.indexOf('online') !== -1) categories.online.push($b);  
            else if (cls.indexOf('torrent') !== -1) categories.torrent.push($b);  
            else if (cls.indexOf('trailer') !== -1) categories.trailer.push($b);  
            else categories.other.push($b.clone(true));  
          });  
  
          // Відображення у визначеному порядку  
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
  
          applyButtonTextMode(); // застосовуємо поточний режим тексту  
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
    } else {  
      // стандарт — як у Lampa (нічого не змінюємо)  
      css = '';  
    }  
  
    if (css) {  
      $('body').append('<style id="button_text_mode_style">' + css + '</style>');  
    }  
  }  
  
  // --- Налаштування ---  
  function Settings() {  
    // Реєструємо параметри перед використанням  
    if (typeof Lampa.Params !== 'undefined') {  
      Lampa.Params.trigger('show_all_buttons', false);  
      Lampa.Params.trigger('button_text_mode', 'default');  
    }  
  
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
      param: { name: 'show_all_buttons', type: 'trigger', default: false },  
      field: {  
        name: '<div style="display: flex; align-items: center;"><svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; flex-shrink: 0; min-width: 32px; min-height: 32px; max-width: 32px; max-height: 32px;"><g transform="scale(2.1)" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M99.1,117.7H30.5c-11.3,0-20.5-9.2-20.5-20.5V28.6C10,17.2,19.2,8,30.5,8h68.6c11.3,0,20.5,9.2,20.5,20.5v68.6C119.6,108.4,110.4,117.7,99.1,117.7z M30.5,19.8c-4.9,0-8.8,3.9-8.8,8.8v68.6c0,4.9,3.9,8.8,8.8,8.8h68.6c4.9,0,8.8-3.9,8.8-8.8V28.6c0-4.9-3.9-8.8-8.8-8.8H30.5z"/><path d="M99.1,248H30.5c-11.3,0-20.5-9.2-20.5-20.5v-68.6c0-11.3,9.2-20.5,20.5-20.5h68.6c11.3,0,20.5,9.2,20.5,20.5v68.6C119.6,238.8,110.4,248,99.1,248z M30.5,150c-4.9,0-8.8,4-8.8,8.8v68.6c0,4.9,3.9,8.8,8.8,8.8h68.6c4.9,0,8.8-3.9,8.8-8.8v-68.6c0-4.9-3.9-8.8-8.8-8.8H30.5z"/><path d="M225.5,157.5h-68.6c-11.5,0-20.5-11.6-20.5-26.5V34.5c0-14.9,9-26.5,20.5-26.5h68.6C237,8,246,19.7,246,34.5V131C246,145.8,237,157.5,225.5,157.5z M156.9,19.8c-4.2,0-8.8,6.1-8.8,14.8V131c0,8.7,4.6,14.8,8.8,14.8h68.6c4.2,0,8.8-6.1,8.8-14.8V34.5c0-8.7-4.6-14.8-8.8-14.8H156.9z"/><path d="M225.5,248h-68.6c-11.5,0-20.5-7.1-20.5-16.1v-47.7c0-9,9-16.1,20.5-16.1h68.6c11.5,0,20.5,7.1,20.5,16.1v47.7C246,240.9,237,248,225.5,248z M156.9,179.8c-5.3,0-8.8,2.6-8.8,4.4v47.7c0,1.7,3.5,4.4,8.8,4.4h68.6c5.3,0,8.8-2.6,8.8-4.4v-47.7c0-1.7-3.5-4.4-8.8-4.4H156.9z"/></g></svg>' + Lampa.Lang.translate('show_all_buttons_name'),  
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
