(function () {
  'use strict';

  // --- Локалізація ---
  function Lang() {
    Lampa.Lang.add({
      bigbuttons_name: {
        ru: "Великі кнопки",
        en: "Large buttons",
        uk: "Великі кнопки"
      },
      bigbuttons_desc: {
        ru: "Збільшує розмір кнопок і показує текст на всіх (на мобільних — компактний режим)",
        en: "Increases button size and shows text on all (compact on mobile)",
        uk: "Збільшує розмір кнопок і показує текст на всіх (на мобільних — компактний режим)"
      },
      showbutton_name: {
        ru: "Все кнопки в карточке",
        en: "All buttons in card",
        uk: "Усі кнопки в картці"
      },
      showbutton_desc: {
        ru: "Выводит все кнопки действий в карточке",
        en: "Show all action buttons in card",
        uk: "Виводить усі кнопки дій у картці"
      },
      showbuttonwn_name: {
        ru: "Скрыть текст на кнопках",
        en: "Hide text on buttons",
        uk: "Сховати текст на кнопках"
      },
      showbuttonwn_desc: {
        ru: "Показывает только иконки на кнопках (работает при включении всех кнопок)",
        en: "Show only icons on buttons (works when all buttons are enabled)",
        uk: "Показує лише іконки на кнопках (працює при ввімкненні всіх кнопок)"
      },
      reloading: {
        ru: "Перезагрузка...",
        en: "Reloading...",
        uk: "Перезавантаження..."
      }
    });
  }

  // --- Стилі для великих кнопок (збільшення розміру + текст без фокусу) ---
  function applyBigButtons() {
    var enabled = Lampa.Storage.get('bigbuttons', 'false') === 'true';
    $('#accent_color_bigbuttons').remove();

    if (enabled) {
      var style = '<style id="accent_color_bigbuttons">' +
        // Збільшення кнопок
        '.full-start-new__buttons .full-start__button {' +
        '  min-width: 120px !important;' +
        '  padding: 8px 12px !important;' +
        '  font-size: 14px !important;' +
        '}' +
        // Текст на всіх кнопках (без фокусу)
        '.full-start-new__buttons .full-start__button:not(.focus) span {' +
        '  display: inline !important;' +
        '}' +
        // Мобільна адаптація
        '@media screen and (max-width: 580px) {' +
        '  .full-start-new__buttons {' +
        '    overflow-x: auto;' +
        '    overflow-y: hidden;' +
        '    white-space: nowrap;' +
        '    padding-bottom: 10px;' +
        '  }' +
        '  .full-start-new__buttons .full-start__button {' +
        '    min-width: 80px !important;' +
        '    padding: 6px 8px !important;' +
        '    font-size: 12px !important;' +
        '  }' +
        '  .full-start-new__buttons .full-start__button:not(.focus) span {' +
        '    display: none !important;' +
        '  }' +
        '}' +
        '</style>';
      $('body').append(style);
    }
  }

  // --- Налаштування ---
  function Settings() {
    // 1️⃣ Великі кнопки (без перезавантаження)
    Lampa.SettingsApi.addParam({
      component: "accent_color_plugin",
      param: {
        name: "bigbuttons",
        type: "trigger",
        default: false
      },
      field: {
        name: Lampa.Lang.translate('bigbuttons_name'),
        description: Lampa.Lang.translate('bigbuttons_desc')
      },
      onChange: function (value) {
        Lampa.Storage.set('bigbuttons', value);
        applyBigButtons(); // Миттєве застосування
        Lampa.Settings.update();
      }
    });

    // 2️⃣ Усі кнопки в картці (з перезавантаженням)
    Lampa.SettingsApi.addParam({
      component: "accent_color_plugin",
      param: {
        name: "showbutton",
        type: "trigger",
        default: false
      },
      field: {
        name: Lampa.Lang.translate('showbutton_name'),
        description: Lampa.Lang.translate('showbutton_desc')
      },
      onChange: function (value) {
        Lampa.Storage.set('showbutton', value);
        Lampa.Settings.update();
        setTimeout(function () {
          Lampa.Noty.show(Lampa.Lang.translate('reloading'));
          location.reload();
        }, 300);
      }
    });

    // 3️⃣ Сховати текст — тільки якщо showbutton увімкнено
    if (Lampa.Storage.get('showbutton') === true) {
      Lampa.SettingsApi.addParam({
        component: "accent_color_plugin",
        param: {
          name: "showbuttonwn",
          type: "trigger",
          default: false
        },
        field: {
          name: Lampa.Lang.translate('showbuttonwn_name'),
          description: Lampa.Lang.translate('showbuttonwn_desc')
        },
        onChange: function (value) {
          Lampa.Storage.set('showbuttonwn', value);
          Lampa.Settings.update();
          setTimeout(function () {
            Lampa.Noty.show(Lampa.Lang.translate('reloading'));
            location.reload();
          }, 300);
        }
      });
    }
  }

  // --- Основна логіка: показ усіх кнопок ---
  function ShowButtons() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        setTimeout(function () {
          try {
            if (Lampa.Storage.get('showbutton') !== true) return;

            var fullContainer = e.object.activity.render();
            var targetContainer = fullContainer.find('.full-start-new__buttons');
            fullContainer.find('.button--play').remove();

            var allButtons = fullContainer
              .find('.buttons--container .full-start__button')
              .add(targetContainer.find('.full-start__button'));

            var categories = { online: [], torrent: [], trailer: [], other: [] };
            allButtons.each(function () {
              var $button = $(this);
              var className = $button.attr('class') || '';
              if (className.indexOf('online') !== -1) categories.online.push($button);
              else if (className.indexOf('torrent') !== -1) categories.torrent.push($button);
              else if (className.indexOf('trailer') !== -1) categories.trailer.push($button);
              else categories.other.push($button.clone(true));
            });

            var order = ['torrent', 'online', 'trailer', 'other'];
            targetContainer.empty();
            order.forEach(function (c) {
              categories[c].forEach(function ($b) {
                targetContainer.append($b);
              });
            });

            // Сховати текст, якщо увімкнено
            if (Lampa.Storage.get('showbuttonwn') === true) {
              targetContainer.find('span').remove();
            }

            targetContainer.css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'flex-start'
            });

            Lampa.Controller.toggle('full_start');
          } catch (err) {
            console.error('[ShowButtons Plugin Error]', err);
          }
        }, 150);
      }
    });
  }

  // --- Маніфест ---
  var manifest = {
    type: "other",
    version: "1.5.0",
    author: "@chatgpt",
    name: "Show Buttons + Large Buttons",
    description: "Виводить усі кнопки в картці + збільшує їх розмір і показує текст на всіх (без перезавантаження).",
    component: "accent_color_plugin"
  };

  // --- Ініціалізація ---
  function add() {
    Lang();
    Settings();
    applyBigButtons(); // Застосовуємо стилі одразу

    // Динамічне оновлення при відкритті картки
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        setTimeout(function () {
          var fullContainer = e.object.activity.render();
          var targetContainer = fullContainer.find('.full-start-new__buttons');
          if (Lampa.Storage.get('bigbuttons', 'false') === 'true') {
            targetContainer.find('.full-start__button').css({
              'min-width': (window.innerWidth <= 580 ? '80px' : '120px'),
              'padding': (window.innerWidth <= 580 ? '6px 8px' : '8px 12px'),
              'font-size': (window.innerWidth <= 580 ? '12px' : '14px')
            });
          }
        }, 200);
      }
    });

    Lampa.Manifest.plugins = manifest;

    if (Lampa.Storage.get('showbutton') === true) {
      ShowButtons();
    }
  }

  function startPlugin() {
    window.plugin_showbutton_ready = true;
    if (window.appready) {
      add();
    } else {
      Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') {
          add();
        }
      });
    }
  }

  if (!window.plugin_showbutton_ready) {
    startPlugin();
  }
})();
