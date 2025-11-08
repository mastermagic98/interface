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

        // 🔄 Автоматичне перезавантаження
        setTimeout(() => {
          Lampa.Noty.show(Lampa.Lang.translate('reloading'));
          location.reload();
        }, 300);
      }
    });

    // 2️⃣ Сховати текст на кнопках — додається лише якщо showbutton == true
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

          // 🔄 Автоматичне перезавантаження при зміні цієї опції
          setTimeout(() => {
            Lampa.Noty.show(Lampa.Lang.translate('reloading'));
            location.reload();
          }, 300);
        }
      });
    }
  }

  // --- Основна логіка ---
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
            order.forEach(c => categories[c].forEach($b => targetContainer.append($b)));

            if (Lampa.Storage.get('showbuttonwn') === true) {
              targetContainer.find("span").remove();
            }

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
    version: "1.1.0",
    author: "@chatgpt",
    name: "Show Buttons in Card",
    description: "Виводить усі кнопки дій у картці з можливістю приховати текст. Опції автоматично застосовуються після перезавантаження.",
    component: "accent_color_plugin"
  };

  // --- Ініціалізація ---
  function add() {
    Lang();
    Settings();
    Lampa.Manifest.plugins = manifest;
    if (Lampa.Storage.get('showbutton') === true) ShowButtons();
  }

  function startPlugin() {
    window.plugin_showbutton_ready = true;
    if (window.appready) add();
    else {
      Lampa.Listener.follow("app", function (e) {
        if (e.type === "ready") add();
      });
    }
  }

  if (!window.plugin_showbutton_ready) startPlugin();

})();
