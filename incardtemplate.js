(function () {
  'use strict';

  // --- Локалізація ---
  function Lang() {
    try {
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
    } catch (e) {
      console.error('[Lang] Error:', e);
    }
  }

  // --- Застосування великих кнопок ---
  function applyBigButtons() {
    try {
      var enabled = Lampa.Storage.get('bigbuttons', 'false') === 'true';
      $('#accent_color_bigbuttons').remove();
      if (enabled) {
        var style = '<style id="accent_color_bigbuttons">' +
          '.full-start-new__buttons .full-start__button {min-width:120px !important;padding:8px 12px !important;font-size:14px !important;}' +
          '.full-start-new__buttons .full-start__button:not(.focus) span {display:inline !important;}' +
          '@media screen and (max-width:580px){' +
          '.full-start-new__buttons {overflow-x:auto;overflow-y:hidden;white-space:nowrap;padding-bottom:10px;}' +
          '.full-start-new__buttons .full-start__button {min-width:80px !important;padding:6px 8px !important;font-size:12px !important;}' +
          '.full-start-new__buttons .full-start__button:not(.focus) span {display:none !important;}' +
          '}' +
          '</style>';
        $('body').append(style);
      }
    } catch (e) {
      console.error('[BigButtons] Apply error:', e);
    }
  }

  // --- Приховування тексту ---
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

  // --- Оновлення налаштувань (без render) ---
  function updateSettings() {
    try {
      if (typeof Lampa.Settings !== 'undefined' && Lampa.Settings.main && typeof Lampa.Settings.main === 'function') {
        var main = Lampa.Settings.main();
        if (main && main.render) {
          var $comp = main.render().find('[data-component="accent_color_plugin"]');
          if ($comp.length) {
            $comp.remove();
            var $parent = main.render().find('[data-parent="plugins"]');
            if ($parent.length) {
              $parent.append(main.buildComponent('accent_color_plugin'));
            }
          }
          if (typeof Lampa.Controller !== 'undefined' && Lampa.Controller.toggle) {
            Lampa.Controller.toggle('settings_component');
          }
        }
      }
    } catch (e) {
      console.error('[Settings] Update error:', e);
    }
  }

  // --- Налаштування ---
  function Settings() {
    try {
      var showAll = Lampa.Storage.get('showbutton', 'false') === 'true';

      Lampa.SettingsApi.addParam({
        component: "accent_color_plugin",
        param: { name: "showbutton", type: "trigger", default: false },
        field: { name: Lampa.Lang.translate('showbutton_name'), description: Lampa.Lang.translate('showbutton_desc') },
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

      if (showAll) {
        Lampa.SettingsApi.addParam({
          component: "accent_color_plugin",
          param: { name: "bigbuttons", type: "trigger", default: false },
          field: { name: Lampa.Lang.translate('bigbuttons_name'), description: Lampa.Lang.translate('bigbuttons_desc') },
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
          field: { name: Lampa.Lang.translate('showbuttonwn_name'), description: Lampa.Lang.translate('showbuttonwn_desc') },
          onChange: function (value) {
            Lampa.Storage.set('showbuttonwn', value);
            if (value) Lampa.Storage.set('bigbuttons', false);
            applyHideText();
            applyBigButtons();
            updateSettings();
          }
        });
      } else {
        Lampa.SettingsApi.addParam({
          component: "accent_color_plugin",
          param: { name: "bigbuttons", type: "trigger", default: false },
          field: { name: Lampa.Lang.translate('bigbuttons_name'), description: Lampa.Lang.translate('bigbuttons_desc') },
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

  // --- Показ усіх кнопок ---
  function ShowButtons() {
    try {
      Lampa.Listener.follow('full', function (e) {
        if (e.type !== 'complite') return;
        setTimeout(function () {
          try {
            if (Lampa.Storage.get('showbutton') !== true) return;
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
            order.forEach(function (c) { categories[c].forEach(function ($b) { targetContainer.append($b); }); });
            targetContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });
            applyBigButtons();
            applyHideText();
            Lampa.Controller.toggle('full_start');
          } catch (err) {
            console.error('[ShowButtons] Inner error:', err);
          }
        }, 150);
      });
    } catch (e) {
      console.error('[ShowButtons] Setup error:', e);
    }
  }

  // --- Динамічне застосування ---
  function applyToCurrentCard() {
    setTimeout(function () {
      applyBigButtons();
      applyHideText();
    }, 200);
  }

  // --- Маніфест ---
  var manifest = {
    type: "other",
    version: "1.9.0",
    author: "@chatgpt",
    name: "Show Buttons + Large Buttons",
    description: "Суперстабільна версія без помилок при підключенні.",
    component: "accent_color_plugin"
  };

  // --- Ініціалізація ---
  function add() {
    try {
      Lang();

      // Значення за замовчуванням
      ['bigbuttons', 'showbuttonwn', 'showbutton'].forEach(function (k) {
        if (Lampa.Storage.get(k) === undefined) Lampa.Storage.set(k, false);
      });

      Settings();

      if (Lampa.Storage.get('bigbuttons', 'false') === 'true') applyBigButtons();
      if (Lampa.Storage.get('showbuttonwn', 'false') === 'true') applyHideText();

      Lampa.Listener.follow('full', function (e) {
        if (e.type === 'complite') applyToCurrentCard();
      });

      Lampa.Manifest.plugins = manifest;

      if (Lampa.Storage.get('showbutton') === true) ShowButtons();
    } catch (e) {
      console.error('[Plugin Init] Critical error:', e);
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
      console.error('[StartPlugin] Error:', e);
    }
  }

  if (!window.plugin_showbutton_ready) startPlugin();
})();
