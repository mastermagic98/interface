(function () {
  'use strict';

  // --- Локалізація ---
  function Lang() {
    Lampa.Lang.add({
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

  // --- Стилі для тексту на всіх кнопках (без перезавантаження) ---
  function applyBigButtons() {
    var enabled = Lampa.Storage.get('bigbuttons', 'false') === 'true';
    $('#accent_color_bigbuttons').remove();

    if (enabled) {
      var style = '<style id="accent_color_bigbuttons">' +
        '.full-start-new__buttons .full-start__button:not(.focus) span { display: inline; }' +
        '@media screen and (max-width: 580px) { ' +
        '  .full-start-new__buttons { overflow: auto; } ' +
        '  .full-start-new__buttons .full-start__button:not(.focus) span { display: none; } ' +
        '}' +
        '</style>';
      $('body').append(style);
    }
  }

  // --- Налаштування ---
  function Settings() {
    // 1️⃣ Текст на всіх кнопках (без перезавантаження)
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

    // 3️⃣ Сховати текст — тільки якщо showbutton увімкнено (з перезавантаженням)
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

            // Застосувати bigbuttons до поточної картки
            applyBigButtonsToCard(targetContainer);

            Lampa.Controller.toggle('full_start');
          } catch (err) {
            console.error('[ShowButtons Plugin Error]', err);
          }
        }, 150);
      }
    });
  }

  // --- Застосування bigbuttons до конкретної картки (для динаміки) ---
  function applyBigButtonsToCard(container) {
    if (Lampa.Storage.get('bigbuttons', 'false') === 'true') {
      container.find('.full-start__button:not(.focus) span').css('display', 'inline');
      if (window.innerWidth <= 580) {
        container.find('.full-start__button:not(.focus) span').css('display', 'none');
      }
    }
  }

  // --- Маніфест ---
  var manifest = {
    type: "other",
    version: "1.4.0",
    author: "@chatgpt",
    name: "Show Buttons + Text in Card",
    description: "Виводить усі кнопки в картці, дозволяє приховати текст та показувати його на всіх кнопках без фокусу (без перезавантаження).",
    component: "accent_color_plugin"
  };

  // --- Ініціалізація ---
  function add() {
    Lang();
    Settings();
    applyBigButtons(); // Застосовуємо глобальні стилі

    // Динамічне застосування при відкритті картки
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        setTimeout(function () {
          var fullContainer = e.object.activity.render();
          var targetContainer = fullContainer.find('.full-start-new__buttons');
          applyBigButtonsToCard(targetContainer);
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
