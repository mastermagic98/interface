(function () {
  'use strict';

  // --- Локалізація ---
  function Lang() {
    Lampa.Lang.add({
      show_all_buttons_name: {
        ru: "Показать все кнопки",
        en: "Show all buttons",
        uk: "Показати всі кнопки"
      },
      show_all_buttons_desc: {
        ru: "Выводит все кнопки действий на карточке",
        en: "Show all action buttons in card",
        uk: "Показує усі кнопки дій на картці"
      },
      text_mode_name: {
        ru: "Режим текста на кнопках",
        en: "Text display mode",
        uk: "Режими відображення тексту"
      },
      text_mode_desc: {
        ru: "Выберите режим отображения текста на кнопках",
        en: "Select mode of text display on buttons",
        uk: "Оберіть режим відображення тексту на кнопках"
      },
      default: {
        ru: "По умолчанию",
        en: "Default",
        uk: "За замовчуванням"
      },
      show: {
        ru: "Показать текст",
        en: "Show text",
        uk: "Показати текст"
      },
      hide: {
        ru: "Скрыть текст",
        en: "Hide text",
        uk: "Приховати текст"
      },
      reloading: {
        ru: "Перезагрузка...",
        en: "Reloading...",
        uk: "Перезавантаження..."
      }
    });
  }

  // --- Застосування режиму тексту ---
  function applyTextMode() {
    var mode = Lampa.Storage.get('text_mode', 'default');

    $('#accent_color_text_mode').remove();

    if (mode === 'default') {
      // Нічого не робимо, стандартні стилі Lampa
      return;
    }

    var style = '<style id="accent_color_text_mode">';
    if (mode === 'show') {
      style += '.full-start-new__buttons .full-start__button span {display:inline !important;}';
    } else if (mode === 'hide') {
      style += '.full-start-new__buttons .full-start__button span {display:none !important;}';
    }
    style += '</style>';

    $('body').append(style);
  }

  // --- Показати всі кнопки ---
  function ShowAllButtons() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type !== 'complite') return;

      setTimeout(function () {
        if (Lampa.Storage.get('show_all_buttons') !== true) return;

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
        order.forEach(function (c) { categories[c].forEach(function ($b) { targetContainer.append($b); }); });

        targetContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });

      }, 150);
    });
  }

  // --- Налаштування ---
  function Settings() {
    // Показати всі кнопки
    Lampa.SettingsApi.addParam({
      component: "accent_color_plugin",
      param: { name: "show_all_buttons", type: "trigger", default: false },
      field: { name: Lampa.Lang.translate('show_all_buttons_name'), description: Lampa.Lang.translate('show_all_buttons_desc') },
      onChange: function (value) {
        Lampa.Storage.set('show_all_buttons', value);
        Lampa.Noty.show(Lampa.Lang.translate('reloading'));
        setTimeout(function () { location.reload(); }, 300);
      }
    });

    // Режим тексту
    var textOptions = [
      { value: 'default', name: Lampa.Lang.translate('default') },
      { value: 'show', name: Lampa.Lang.translate('show') },
      { value: 'hide', name: Lampa.Lang.translate('hide') }
    ];

    Lampa.SettingsApi.addParam({
      component: "accent_color_plugin",
      param: { name: "text_mode", type: "select", default: 'default', options: textOptions },
      field: { name: Lampa.Lang.translate('text_mode_name'), description: Lampa.Lang.translate('text_mode_desc') },
