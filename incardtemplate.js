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
    // 1. Опція: показувати всі кнопки
    Lampa.SettingsApi.addParam({
      component: 'accent_color_plugin',
      param: { name: 'show_all_buttons', type: 'trigger', default: false },
      field: {
        name: Lampa.Lang.translate('show_all_buttons_name'),
        description: Lampa.Lang.translate('show_all_buttons_desc')
      },
      onChange: function (value) {
        Lampa.Storage.set('show_all_buttons', value);
        applyShowAllButtons();
      }
    });

    // 2. Опція: режим тексту на кнопках
    Lampa.SettingsApi.addParam({
      component: 'accent_color_plugin',
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
        name: Lampa.Lang.translate('button_text_mode_name'),
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

    // Динамічне оновлення після відкриття картки
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
