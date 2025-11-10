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
        ru: "Збільшує кнопки і показує текст на всіх (на мобільних — компактно)",
        en: "Enlarges buttons and shows text on all (compact on mobile)",
        uk: "Збільшує кнопки і показує текст на всіх (на мобільних — компактно)"
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
        ru: "Показывает только иконки (работает с \"Все кнопки\")",
        en: "Show only icons (works with \"All buttons\")",
        uk: "Показує лише іконки (працює з \"Усі кнопки\")"
      },
      reloading: {
        ru: "Перезагрузка...",
        en: "Reloading...",
        uk: "Перезавантаження..."
      }
    });
  }

  // --- Застосування великих кнопок (миттєво) ---
  function applyBigButtons() {
    try {
      var enabled = Lampa.Storage.get('bigbuttons', 'false') === 'true';
      $('#accent_color_bigbuttons').remove();

      if (enabled) {
        var style = '<style id="accent_color_bigbuttons">' +
          '.full-start-new__buttons .full-start__button {' +
          '  min-width: 120px !important;' +
          '  padding: 8px 12px !important;' +
          '  font-size: 14px !important;' +
          '}' +
          '.full-start-new__buttons .full-start__button:not(.focus) span {' +
          '  display: inline !important;' +
          '}' +
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
    } catch (e) {
      console.error('[BigButtons] Apply error:', e);
    }
  }

  // --- Приховування тексту (миттєво) ---
  function applyHideText() {
    try {
      var hide = Lampa.Storage.get('showbuttonwn', 'false') === 'true';
      if (hide) {
        $('.full-start-new__buttons .full-start__button span').remove();
      }
    } catch (e) {
      console.error('[HideText] Apply error:', e);
    }
  }

  // --- Оновлення налаштувань (безпечне) ---
  function updateSettings() {
    try {
      // Перебудовуємо тільки компонент
      var $component = Lampa.Settings.main().render().find('[data-component="accent_color_plugin"]');
      if ($component.length) {
        $component.remove();
        Lampa.Settings.main().render().find('[data-parent="plugins"]').append(
          Lampa.Settings.main().buildComponent('accent_color_plugin')
        );
      }
      Lampa.Controller.toggle('settings_component');
    } catch (e) {
      console.error('[Settings] Update error:', e);
    }
  }

  // --- Налаштування ---
  function Settings() {
    try {
      var showAll = Lampa.Storage.get('showbutton', 'false') === 'true';

      // 1️⃣ Усі кнопки
      Lampa.SettingsApi.addParam({
        component: "accent_color_plugin",
        param: { name: "showbutton", type: "trigger", default: false },
        field: {
          name: Lampa.Lang.translate('showbutton_name'),
          description: Lampa.Lang.translate('showbutton_desc')
        },
        onChange: function (value) {
          Lampa.Storage.set('showbutton', value);
          if (value) {
            Lampa.Storage.set('bigbuttons', false);
            Lampa.Storage.set('showbuttonwn', false);
          }
          updateSettings();
          setTimeout(function () {
            Lampa.Noty.show(Lampa.Lang.translate('reloading'));
            location.reload();
          }, 300);
        }
      });

      // 2️⃣ Якщо showbutton = true → взаємовиключні
      if (showAll) {
        Lampa.SettingsApi.addParam({
          component: "accent_color_plugin",
          param: { name: "bigbuttons", type: "trigger", default: false },
          field: {
            name: Lampa.Lang.translate('bigbuttons_name'),
            description: Lampa.Lang.translate('bigbuttons_desc')
          },
          onChange: function (value) {
            Lampa.Storage.set('bigbuttons', value);
            if (value) Lampa.Storage.set('showbuttonwn', false);
            applyBigButtons();
            applyHideText();
            updateSettings();
          }
        });

        Lampa.SettingsApi.addParam({
          component: "accent_color_plugin",
          param: { name: "showbuttonwn", type: "trigger", default: false },
          field: {
            name: Lampa.Lang.translate('showbuttonwn_name'),
            description: Lampa.Lang.translate('showbuttonwn_desc')
          },
          onChange: function (value) {
            Lampa.Storage.set('showbuttonwn', value);
            if (value) Lampa.Storage.set('bigbuttons', false);
            applyHideText();
            applyBigButtons();
            updateSettings();
          }
        });
      } else {
        // 3️⃣ Якщо showbutton = false → тільки bigbuttons
        Lampa.SettingsApi.addParam({
          component: "accent_color_plugin",
          param: { name: "bigbuttons", type: "trigger", default: false },
          field: {
            name: Lampa.Lang.translate('bigbuttons_name'),
            description: Lampa.Lang.translate('bigbuttons_desc')
          },
          onChange: function (value) {
            Lampa.Storage.set('bigbuttons', value);
            applyBigButtons();
            updateSettings();
          }
        });
      }
    } catch (e) {
      console.error('[Settings] Build error:', e);
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
            if (!targetContainer.length) return;

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
              categories[c].forEach(function ($b) { targetContainer.append($b); });
            });

            targetContainer.css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'flex-start'
            });

            applyBigButtons();
            applyHideText();

            Lampa.Controller.toggle('full_start');
          } catch (err) {
            console.error('[ShowButtons] Error:', err);
          }
        }, 150);
      }
    });
  }

  // --- Динамічне застосування при відкритті картки ---
  function applyToCurrentCard() {
    setTimeout(function () {
      applyBigButtons();
      applyHideText();
    }, 200);
  }

  // --- Маніфест ---
 --- 
  var manifest = {
    type: "other",
    version: "1.8.0",
    author: "@chatgpt",
    name: "Show Buttons + Large Buttons",
    description: "Стабільна версія: великі кнопки без помилок, динамічні опції.",
    component: "accent_color_plugin"
  };

  // --- Ініціалізація ---
  function add() {
    try {
      Lang();

      // Гарантуємо значення за замовчуванням
      ['bigbuttons', 'showbuttonwn', 'showbutton'].forEach(function (key) {
        if (Lampa.Storage.get(key) === undefined) {
          Lampa.Storage.set(key, false);
        }
      });

      Settings();

      // Застосовуємо тільки якщо увімкнено
      if (Lampa.Storage.get('bigbuttons', 'false') === 'true') {
        applyBigButtons();
      }
      if (Lampa.Storage.get('showbuttonwn', 'false') === 'true') {
        applyHideText();
      }

      Lampa.Listener.follow('full', function (e) {
        if (e.type === 'complite') applyToCurrentCard();
      });

      Lampa.Manifest.plugins = manifest;

      if (Lampa.Storage.get('showbutton') === true) {
        ShowButtons();
      }
    } catch (e) {
      console.error('[Plugin Init] Error:', e);
    }
  }

  function startPlugin() {
    window.plugin_showbutton_ready = true;
    if (window.appready) {
      add();
    } else {
      Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') add();
      });
    }
  }

  if (!window.plugin_showbutton_ready) startPlugin();
})();
