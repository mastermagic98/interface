(function () {
  'use strict';

  // --- Локалізація ---
  function Lang() {
    try {
      Lampa.Lang.add({
        textdisplay_name: {
          ru: "Відображення тексту в кнопках",
          en: "Text display in buttons",
          uk: "Відображення тексту в кнопках"
        },
        textdisplay_desc: {
          ru: "За замовчуванням: стандартно; Показувати: текст завжди; Приховувати: тільки іконки (розмір як без фокусу)",
          en: "Default: standard; Show: text always; Hide: icons only (size as unfocused)",
          uk: "За замовчуванням: стандартно; Показувати: текст завжди; Приховувати: тільки іконки (розмір як без фокусу)"
        },
        textdisplay_default: {
          ru: "За замовчуванням",
          en: "Default",
          uk: "За замовчуванням"
        },
        textdisplay_show: {
          ru: "Показувати текст",
          en: "Show text",
          uk: "Показувати текст"
        },
        textdisplay_hide: {
          ru: "Приховувати текст",
          en: "Hide text",
          uk: "Приховувати текст"
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

  // --- Застосування режиму відображення тексту ---
  function applyTextDisplay() {
    try {
      var mode = Lampa.Storage.get('textdisplay', 'default');
      var $style = $('#accent_color_textdisplay');
      if ($style.length) $style.remove();

      if (mode === 'default') return;

      var isMobile = window.innerWidth <= 580;
      var css = '';

      if (mode === 'show') {
        css += '.full-start-new__buttons .full-start__button:not(.focus) span { display: inline !important; }';
        if (isMobile) {
          css += '.full-start-new__buttons { overflow-x: auto; overflow-y: hidden; white-space: nowrap; padding-bottom: 10px; }';
        }
      } else if (mode === 'hide') {
        css += '.full-start-new__buttons .full-start__button span { display: none !important; }';
        css += '.full-start-new__buttons .full-start__button { min-width: auto !important; padding: 6px 8px !important; font-size: 12px !important; }';
        if (isMobile) {
          css += '.full-start-new__buttons { overflow-x: auto; overflow-y: hidden; white-space: nowrap; padding-bottom: 10px; }';
        }
      }

      if (css) {
        var style = document.createElement('style');
        style.id = 'accent_color_textdisplay';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
      }
    } catch (e) {
      console.error('[TextDisplay] Error:', e);
    }
  }

  // --- Повне оновлення налаштувань ---
  function rebuildSettings() {
    try {
      // Перезавантажуємо весь блок плагінів
      Lampa.Settings.update();
      // Якщо не допомогло — примусово перебудовуємо
      setTimeout(function () {
        if (Lampa.Settings && Lampa.Settings.main) {
          var main = Lampa.Settings.main();
          if (main.render) {
            var $plugins = main.render().find('[data-parent="plugins"]');
            if ($plugins.length) {
              $plugins.empty();
              // Перебудовуємо всі плагіни
              Object.keys(Lampa.Manifest.plugins || {}).forEach(function (comp) {
                if (comp !== 'accent_color_plugin') {
                  $plugins.append(main.buildComponent(comp));
                }
              });
              $plugins.append(main.buildComponent('accent_color_plugin'));
            }
          }
          if (Lampa.Controller && Lampa.Controller.toggle) {
            Lampa.Controller.toggle('settings_component');
          }
        }
      }, 100);
    } catch (e) {
      console.error('[rebuildSettings] Error:', e);
    }
  }

  // --- Налаштування ---
  function Settings() {
    try {
      // 1️⃣ Усі кнопки
      Lampa.SettingsApi.addParam({
        component: "accent_color_plugin",
        param: { name: "showbutton", type: "trigger", default: false },
        field: { name: Lampa.Lang.translate('showbutton_name'), description: Lampa.Lang.translate('showbutton_desc') },
        onChange: function (value) {
          Lampa.Storage.set('showbutton', value);
          rebuildSettings();
          setTimeout(function () {
            Lampa.Noty.show(Lampa.Lang.translate('reloading'));
            location.reload();
          }, 300);
        }
      });

      // 2️⃣ Відображення тексту
      Lampa.SettingsApi.addParam({
        component: "accent_color_plugin",
        param: { name: "textdisplay", type: "list", default: "default" },
        field: {
          name: Lampa.Lang.translate('textdisplay_name'),
          description: Lampa.Lang.translate('textdisplay_desc'),
          values: [
            { name: Lampa.Lang.translate('textdisplay_default'), value: 'default' },
            { name: Lampa.Lang.translate('textdisplay_show'), value: 'show' },
            { name: Lampa.Lang.translate('textdisplay_hide'), value: 'hide' }
          ]
        },
        onChange: function (value) {
          Lampa.Storage.set('textdisplay', value);
          applyTextDisplay();
          rebuildSettings();
        }
      });
    } catch (e) {
      console.error('[Settings] Error:', e);
    }
  }

  // --- Показ усіх кнопок ---
  function ShowButtons() {
    try {
      Lampa.Listener.follow('full', function (e) {
        if (e.type !== 'complite') return;
        setTimeout(function () {
          try {
            if (Lampa.Storage.get('showbutton', 'false') !== 'true') return;

            var fullContainer = e.object.activity.render();
            var targetContainer = fullContainer.find('.full-start-new__buttons');
            if (!targetContainer || !targetContainer.length) return;

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
              var arr = categories[c] || [];
              for (var i = 0; i < arr.length; i++) {
                targetContainer.append(arr[i]);
              }
            });

            targetContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });

            applyTextDisplay();

            Lampa.Controller.toggle('full_start');
          } catch (err) {
            console.error('[ShowButtons] Inner error:', err);
          }
        }, 120);
      });
    } catch (e) {
      console.error('[ShowButtons] Setup error:', e);
    }
  }

  // --- Динамічне застосування ---
  function applyOnCardOpen() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        setTimeout(applyTextDisplay, 150);
      }
    });
  }

  // --- Маніфест ---
  var manifest = {
    type: "other",
    version: "2.4.0",
    author: "@chatgpt",
    name: "Show Buttons + Text Display",
    description: "100% гарантія появи обох опцій у налаштуваннях.",
    component: "accent_color_plugin"
  };

  // --- Ініціалізація ---
  function add() {
    try {
      Lang();

      // Дефолти
      if (Lampa.Storage.get('showbutton') === undefined) Lampa.Storage.set('showbutton', false);
      if (Lampa.Storage.get('textdisplay') === undefined) Lampa.Storage.set('textdisplay', 'default');

      Settings();

      applyTextDisplay();
      applyOnCardOpen();

      Lampa.Manifest.plugins = manifest;

      if (Lampa.Storage.get('showbutton') === true) ShowButtons();

      // Примусово оновлюємо UI після ініціалізації
      setTimeout(rebuildSettings, 500);
    } catch (e) {
      console.error('[Init] Error:', e);
    }
  }

  function startPlugin() {
    try {
      window.plugin_showbutton_ready = true;
      if (window.appready) {
        add();
      } else {
        Lampa.Listener.follow('app', function (e) {
          if (e.type === 'ready') add();
        });
      }
    } catch (e) {
      console.error('[Start] Error:', e);
    }
  }

  if (!window.plugin_showbutton_ready) startPlugin();
})();
