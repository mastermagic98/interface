(function () {
  'use strict';

  function Lang() {
    Lampa.Lang.add({
      showbutton_desc: {
        ru: "Выводит все кнопки действий в карточке",
        en: "Show all action buttons in card",
        uk: "Виводить усі кнопки дій у картці"
      },
      showbuttonwn_desc: {
        ru: "Показывать только иконки",
        en: "Show only icons",
        uk: "Відображати тільки іконки"
      },
      showbutton_name: {
        ru: "Все кнопки в карточке",
        en: "All buttons in card",
        uk: "Усі кнопки в картці"
      },
      showbuttonwn_name: {
        ru: "Скрыть текст на кнопках",
        en: "Hide text on buttons",
        uk: "Сховати текст на кнопках"
      }
    });
  }

  function Settings() {
    // Основний параметр
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
        // Якщо активовано — додаємо другу опцію
        if (value === true) {
          addHideTextOption();
        } else {
          // Якщо вимкнено — видаляємо її зі сховища
          Lampa.Storage.set('showbuttonwn', false);
        }
        // Оновлюємо налаштування, щоб одразу зʼявилось
        Lampa.Settings.update();
      }
    });

    // Якщо вже була активована раніше — додаємо другу опцію відразу
    if (Lampa.Storage.get('showbutton') === true) {
      addHideTextOption();
    }
  }

  function addHideTextOption() {
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
      }
    });
  }

  function ShowButtons() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        setTimeout(function () {
          var fullContainer = e.object.activity.render();
          var targetContainer = fullContainer.find('.full-start-new__buttons');
          fullContainer.find('.button--play').remove();

          var allButtons = fullContainer
            .find('.buttons--container .full-start__button')
            .add(targetContainer.find('.full-start__button'));

          var categories = {
            online: [],
            torrent: [],
            trailer: [],
            other: []
          };

          allButtons.each(function () {
            var $button = $(this);
            var className = $button.attr('class') || '';
            if (className.includes('online')) categories.online.push($button);
            else if (className.includes('torrent')) categories.torrent.push($button);
            else if (className.includes('trailer')) categories.trailer.push($button);
            else categories.other.push($button.clone(true));
          });

          var buttonSortOrder = Lampa.Storage.get('buttonsort') || ['torrent', 'online', 'trailer', 'other'];

          targetContainer.empty();
          buttonSortOrder.forEach(function (category) {
            categories[category].forEach(function ($button) {
              targetContainer.append($button);
            });
          });

          // Якщо ввімкнено “показувати тільки іконки”
          if (Lampa.Storage.get('showbuttonwn') === true) {
            targetContainer.find("span").remove();
          }

          targetContainer.css({
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px'
          });

          Lampa.Controller.toggle("full_start");
        }, 100);
      }
    });
  }

  const manifest = {
    type: "other",
    version: "1.0.2",
    author: "@chatgpt",
    name: "Show Buttons in Card",
    description: "Показує всі кнопки дій у картці, з можливістю приховати текст",
    component: "accent_color_plugin"
  };

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
