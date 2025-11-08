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

  // Безпечна функція обробки картки
  function processCard() {
    try {
      const active = Lampa.Activity.active();
      if (!active || typeof active.render !== 'function') return;

      const fullContainer = active.render();
      if (!fullContainer || !fullContainer.length) return;

      const targetContainer = fullContainer.find('.full-start-new__buttons');
      if (!targetContainer.length) return;

      // Перевіряємо, чи є кнопки взагалі
      const allButtons = fullContainer.find('.buttons--container .full-start__button')
        .add(targetContainer.find('.full-start__button'));
      if (!allButtons.length) return;

      // Видаляємо "play" (якщо є)
      fullContainer.find('.button--play').remove();

      const categories = {
        online: [],
        torrent: [],
        trailer: [],
        other: []
      };

      allButtons.each(function () {
        const $button = $(this);
        const className = $button.attr('class') || '';
        if (className.includes('online')) categories.online.push($button);
        else if (className.includes('torrent')) categories.torrent.push($button);
        else if (className.includes('trailer')) categories.trailer.push($button);
        else categories.other.push($button.clone(true));
      });

      const buttonSortOrder = Lampa.Storage.get('buttonsort') || ['torrent', 'online', 'trailer', 'other'];

      targetContainer.empty();
      buttonSortOrder.forEach(function (category) {
        (categories[category] || []).forEach(function ($button) {
          targetContainer.append($button);
        });
      });

      // Стилі для переносу кнопок
      targetContainer.css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px'
      });

      // Якщо ввімкнено “лише іконки” — видаляємо текст
      if (Lampa.Storage.get('showbuttonwn') === true) {
        targetContainer.find("span").remove();
      }

      // Безпечне оновлення контролера
      if (Lampa.Controller && typeof Lampa.Controller.toggle === 'function') {
        Lampa.Controller.toggle("full_start");
      }
    } catch (err) {
      console.error('ShowButtons plugin error:', err);
    }
  }

  // Налаштування
  function Settings() {
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
          setTimeout(processCard, 200); // затримка для безпечного оновлення
        } else {
          Lampa.Storage.set('showbuttonwn', false);
          setTimeout(processCard, 200);
        }
        Lampa.Settings.update();
      }
    });

    if (Lampa.Storage.get('showbutton') === true) {
      addHideTextOption();
    }
  }

  // Друга опція
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
        setTimeout(processCard, 200);
        Lampa.Settings.update();
      }
    });
  }

  // Обробник відкриття картки
  function initListener() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite' && Lampa.Storage.get('showbutton') === true) {
        setTimeout(processCard, 150);
      }
    });
  }

  const manifest = {
    type: "other",
    version: "1.0.4",
    author: "@chatgpt",
    name: "Show Buttons in Card",
    description: "Показує всі кнопки дій у картці з можливістю приховати текст, без помилок",
    component: "accent_color_plugin"
  };

  function add() {
    Lang();
    Settings();
    initListener();
    Lampa.Manifest.plugins = manifest;
    if (Lampa.Storage.get('showbutton') === true) setTimeout(processCard, 300);
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
