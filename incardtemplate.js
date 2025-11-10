(function () {
  'use strict';

  // --- Локалізація ---
  function Lang() {
    try {
      Lampa.Lang.add({
        show_all_buttons_name: {
          ru: "Показывать все кнопки",
          en: "Show all buttons",
          uk: "Показувати всі кнопки"
        },
        show_all_buttons_desc: {
          ru: "Показ всех кнопок на карточке",
          en: "Show all buttons in card",
          uk: "Показ усіх кнопок у картці"
        },
        text_mode_name: {
          ru: "Режим отображения текста",
          en: "Text display mode",
          uk: "Режими відображення тексту"
        },
        text_mode_desc: {
          ru: "Выберите, как отображать текст на кнопках",
          en: "Choose how to display text on buttons",
          uk: "Виберіть, як відображати текст на кнопках"
        },
        text_mode_default: {
          ru: "По умолчанию",
          en: "Default",
          uk: "За замовчуванням"
        },
        text_mode_hide: {
          ru: "Скрывать текст",
          en: "Hide text",
          uk: "Приховувати текст"
        },
        text_mode_show: {
          ru: "Показывать текст",
          en: "Show text",
          uk: "Показувати текст"
        },
        reloading: {
          ru: "Перезагрузка...",
          en: "Reloading...",
          uk: "Перезавантаження..."
        }
      });
    } catch (e) {
      console.error('[Lang] Error:', e);
    }
  }

  // --- Застосування розміру кнопок і тексту ---
  function applyTextMode() {
    var mode = Lampa.Storage.get('text_mode', 'default');
    var $buttons = $('.full-start-new__buttons .full-start__button');

    // Скидаємо стилі
    $buttons.css({ minWidth: '', padding: '', fontSize: '' });
    $buttons.find('span').css({ display: '' });

    if (mode === 'hide') {
      $buttons.find('span').hide();
    } else if (mode === 'show') {
      $buttons.find('span').show();
      $buttons.css({ minWidth: '120px', padding: '8px 12px', fontSize: '14px' });
    } else {
      // default
      $buttons.find('span').hide();
      $buttons.off('hover:focus').on('hover:focus', function () {
        $(this).find('span').show();
        $(this).css({ minWidth: '120px', padding: '8px 12px', fontSize: '14px' });
      });
      $buttons.off('hover:blur').on('hover:blur', function () {
        $(this).find('span').hide();
        $(this).css({ minWidth: '', padding: '', fontSize: '' });
      });
    }
  }

  // --- Показати всі кнопки ---
  function ShowAllButtons() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type !== 'complite') return;
      setTimeout(function () {
        var enabled = Lampa.Storage.get('show_all_buttons', false) === true;
        if (!enabled) return;

        var fullContainer = e.object.activity.render();
        var targetContainer = fullContainer.find('.full-start-new__buttons');
        if (!targetContainer.length) return;

        fullContainer.find('.button--play').remove();
        var allButtons = fullContainer.find('.buttons--container .full-start__button').add(targetContainer.find('.full-start__button'));

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
          categories[c].forEach(function ($b) {
            targetContainer.append($b);
          });
        });

        targetContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });

        applyTextMode();
        Lampa.Controller.toggle('full_start');
      }, 100);
    });
  }

  // --- Налаштування ---
  function Settings() {
    // Показувати всі кнопки
    Lampa.SettingsApi.addParam({
      component: 'accent_color_plugin',
      param: { name: 'show_all_buttons', type: 'trigger', default: false },
      field: {
        name: Lampa.Lang.translate('show_all_buttons_name'),
        description: Lampa.Lang.translate('show_all_buttons_desc')
      },
      onChange: function (v) {
        Lampa.Storage.set('show_all_buttons', v);
        Lampa.Noty.show(Lampa.Lang.translate('reloading'));
        setTimeout(function () { location.reload(); }, 300);
      }
    });

    // Режими відображення тексту
    Lampa.SettingsApi.addParam({
      component: 'accent_color_plugin',
      param: { name: 'text_mode', type: 'select', default: 'default', options: [
        { value: 'default', name: Lampa.Lang.translate('text_mode_default') },
        { value: 'hide', name: Lampa.Lang.translate('text_mode_hide') },
        { value: 'show', name: Lampa.Lang.translate('text_mode_show') }
      ]},
      field: {
        name: Lampa.Lang.translate('text_mode_name'),
        description: Lampa.Lang.translate('text_mode_desc')
      },
      onChange: function (v) {
        Lampa.Storage.set('text_mode', v);
        applyTextMode();
      }
    });
  }

  // --- Ініціалізація ---
  function init() {
    Lang();

    if (Lampa.Storage.get('show_all_buttons') === undefined) Lampa.Storage.set('show_all_buttons', false);
    if (Lampa.Storage.get('text_mode') === undefined) Lampa.Storage.set('text_mode', 'default');

    Settings();
    ShowAllButtons();

    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        applyTextMode();
      }
    });
  }

  if (window.appready) init();
  else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });

})();
