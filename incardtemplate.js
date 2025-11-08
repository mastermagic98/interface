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

  // --- Функція оновлення кнопок у картці ---
  function processCard() {
    const active = Lampa.Activity.active();
    if (!active) return;

    const fullContainer = active.render();
    if (!fullContainer || !fullContainer.length) return;

    const targetContainer = fullContainer.find('.full-start-new__buttons');
    if (!targetContainer.length) return;

    fullContainer.find('.button--play').remove();

    const allButtons = fullContainer
      .find('.buttons--container .full-start__button')
      .add(targetContainer.find('.full-start__button'));

    const categories = {
      online: [],
      torrent: [],
      trailer: [],
      other: []
    };

    allButtons.each(function () {
      const $button = $(this);
      const cls = $button.attr('class') || '';
      if (cls.includes('online')) categories.online.push($button);
      else if (cls.includes('torrent')) categories.torrent.push($button);
      else if (cls.includes('trailer')) categories.trailer.push($button);
      else categories.other.push($button.clone(true));
    });

    const order = Lampa.Storage.get('buttonsort') || ['torrent', 'online', 'trailer', 'other'];

    targetContainer.empty();
    order.forEach(cat => {
      categories[cat].forEach(btn => targetContainer.append(btn));
    });

    if (Lampa.Storage.get('showbuttonwn') === true) {
      targetContainer.find('span').remove();
    }

    targetContainer.css({
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px'
    });

    Lampa.Controller.toggle("full_start");
  }

  // --- Безпечне додавання параметрів у розділ accent_color_plugin ---
  function SafeAddSetting(param) {
    try {
      if (Lampa.SettingsApi && Lampa.SettingsApi.addParam) {
        Lampa.SettingsApi.addParam(param);
      }
    } catch (e) {
      console.log('[ShowButtons Plugin] SettingsApi.addParam error:', e);
    }
  }

  // --- Ініціалізація налаштувань ---
  function Settings() {
    SafeAddSetting({
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
          processCard();
        } else {
          Lampa.Storage.set('showbuttonwn', false);
          processCard();
        }
        Lampa.Settings.update();
      }
    });

    if (Lampa.Storage.get('showbutton') === true) {
      addHideTextOption();
    }
  }

  function addHideTextOption() {
    SafeAddSetting({
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
        processCard();
        Lampa.Settings.update();
      }
    });
  }

  function initListener() {
    Lampa.Listener.follow('full', function (e) {
      if (e.type === 'complite' && Lampa.Storage.get('showbutton') === true) {
        setTimeout(processCard, 100);
      }
    });
  }

  const manifest = {
    type: "other",
    version: "1.0.4",
    author: "@chatgpt",
    name: "Show Buttons in Card",
    description: "Показує всі кнопки дій у картці, з можливістю приховати текст. Миттєве застосування без помилок.",
    component: "accent_color_plugin"
  };

  function add() {
    Lang();
    Settings();
    initListener();
    if (Lampa.Manifest && Lampa.Manifest.plugins) {
      Lampa.Manifest.plugins = manifest;
    }
    if (Lampa.Storage.get('showbutton') === true) processCard();
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
