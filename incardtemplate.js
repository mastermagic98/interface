(function () {
  'use strict';

  // --- Локалізація ---
  function Lang() {
    Lampa.Lang.add({
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
      bigbuttons_name: {
        ru: "Текст на всех кнопках",
        en: "Text on all buttons",
        uk: "Текст на всіх кнопках"
      },
      bigbuttons_desc: {
        ru: "Показывает текст на всех кнопках, даже без фокуса (на мобильных — скрывается)",
        en: "Shows text on all buttons, even without focus (hidden on mobile)",
        uk: "Показує текст на всіх кнопках, навіть без фокусу (на мобільних — приховується)"
      },
      reloading: {
        ru: "Перезагрузка...",
        en: "Reloading...",
        uk: "Перезавантаження..."
      }
    });
  }

  // --- Налаштування ---
  function Settings() {
    // 1️⃣ Усі кнопки в картці
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
        setTimeout(() => {
          Lampa.Noty.show(Lampa.Lang.translate('reloading'));
          location.reload();
        }, 300);
      }
    });

    // 2️⃣ Сховати текст (тільки якщо showbutton увімкнено)
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
          setTimeout(() => {
            Lampa.Noty.show(Lampa.Lang.translate('reloading'));
            location.reload();
          }, 300);
        }
      });
    }

    // 3️⃣ Текст на всіх кнопках без фокусу
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
      onChange: function () {
        applyBigButtons();
      }
    });
  }

  // --- Стилі для тексту на всіх кнопках ---
  function applyBigButtons() {
    var enabled = Lampa.Storage.get('bigbuttons', 'false') === 'true';
    $('#accent_color_bigbuttons').remove();

    if (enabled) {
      var style = '<style id="accent_color_bigbuttons">' +
        '.full-start-new__buttons .full-start__button:not(.focus) span {' +
        '  display: inline !important;' +
        '}' +
        '@media screen and (max-width: 580px) {' +
        '  .full-start-new__buttons {' +
        '    overflow-x: auto;' +
        '    overflow-y: hidden;' +
        '    white-space: nowrap;' +
        '  }' +
        '  .full-start-new__buttons .full-start__button:not(.focus) span {' +
        '    display: none !important;' +
        '  }' +
        '}' +
        '</style>';
      $('body').append(style);
    }
  }

  // --- Основна логіка: показ усіх кнопок ---
  function ShowButtons() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        setTimeout(function () {
          try {
            if (Lampa.Storage.get('showbutton') !== true) return;

            const fullContainer = e.object.activity.render();
            const targetContainer = fullContainer.find('.full-start-new__buttons');
            fullContainer.find('.button--play').remove();

            const allButtons = fullContainer
              .find('.buttons--container .full-start__button')
              .add(targetContainer.find('.full-start__button'));

            const categories = { online: [], torrent: [], trailer: [], other: [] };
            allButtons.each(function () {
              const $button = $(this);
              const className = $button.attr('class') || '';
              if (className.includes('online')) categories.online.push($button);
              else if (className.includes('torrent')) categories.torrent.push($button);
              else if (className.includes('trailer')) categories.trailer.push($button);
              else categories.other.push($button.clone(true));
            });

            const order = ['torrent', 'online', 'trailer', 'other'];
            targetContainer.empty();
            order.forEach(function (c) {
              categories[c].forEach(function ($b) {
                targetContainer.append($b);
              });
            });

            // Сховати текст, якщо увімкнено
            if (Lampa.Storage.get('showbuttonwn') === true) {
              targetContainer.find("span").remove();
            }

            // Стилі для контейнера
            targetContainer.css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              justifyContent: 'flex-start'
            });

            Lampa.Controller.toggle("full_start");
          } catch (err) {
            console.error('[ShowButtons Plugin Error]', err);
          }
        }, 150);
      }
    });
  }

  // --- Маніфест ---
  const manifest = {
    type: "other",
    version: "1.2.0",
    author: "@chatgpt",
    name: "Show Buttons + Text in Card",
    description: "Виводить усі кнопки в картці, дозволяє приховати текст та показувати його на всіх кнопках без фокусу.",
    component: "accent_color_plugin"
  };

  // --- Ініціалізація ---
  function add() {
    Lang();
    Settings();
    applyBigButtons(); // Застосовуємо стилі одразу
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
      Lampa.Listener.follow("app", function (e) {
        if (e.type === "ready") {
          add();
        }
      });
    }
  }

  if (!window.plugin_showbutton_ready) {
    startPlugin();
  }
})();
