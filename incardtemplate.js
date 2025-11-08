(function () {
  'use strict';

  // --- Локалізація ---
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

  // --- Налаштування ---
  function Settings() {
    // Основний параметр: показати всі кнопки
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
        if (value === true) {
          addHideTextOption();
        } else {
          Lampa.Storage.set('showbuttonwn', false);
        }
        Lampa.Settings.update();
      }
    });

    // Якщо була активована — додаємо одразу другу
    if (Lampa.Storage.get('showbutton') === true) addHideTextOption();
  }

  // --- Друга опція ---
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

  // --- Основна логіка виводу кнопок ---
  function ShowButtons() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite') {
        setTimeout(function () {
          try {
            var fullContainer = e.object.activity.render();
            var targetContainer = fullContainer.find('.full-start-new__buttons');

            // Видаляємо стандартну кнопку "Play", бо дублюється
            fullContainer.find('.button--play').remove();

            // Збираємо всі кнопки з двох блоків
            var allButtons = fullContainer
              .find('.buttons--container .full-start__button')
              .add(targetContainer.find('.full-start__button'));

            // Категоризація за типами
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
              else categories.other.push($button.clone(true)); // клонуємо з подіями
            });

            // Порядок сортування (якщо збережено у Storage)
            var buttonSortOrder = Lampa.Storage.get('buttonsort') || ['torrent', 'online', 'trailer', 'other'];

            // Очищаємо та формуємо в потрібному порядку
            targetContainer.empty();
            buttonSortOrder.forEach(function (category) {
              categories[category].forEach(function ($button) {
                targetContainer.append($button);
              });
            });

            // Якщо активовано «Сховати текст»
            if (Lampa.Storage.get('showbuttonwn') === true) {
              targetContainer.find("span").remove();
            }

            // Вирівнювання стилів
            targetContainer.css({
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'flex-start',
              gap: '10px',
              marginTop: '10px'
            });

            // Увімкнути контроль кнопок після оновлення
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
    version: "1.0.3",
    author: "@chatgpt",
    name: "Show Buttons in Card",
    description: "Виводить усі кнопки дій у картці, з можливістю відображати лише іконки",
    component: "accent_color_plugin"
  };

  // --- Ініціалізація ---
  function add() {
    Lang();
    Settings();
    Lampa.Manifest.plugins = manifest;

    // Якщо користувач активував опцію — запускаємо основну логіку
    if (Lampa.Storage.get('showbutton') === true) {
      ShowButtons();
    }
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
