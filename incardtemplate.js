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
        ru: "Показывать только иконки без текста",
        en: "Show only icons without text",
        uk: "Відображати тільки іконки без тексту"
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

  function processCard() {
    const active = Lampa.Activity.active();
    if (!active) return;

    const full = active.render();
    if (!full || !full.length) return;

    const buttonsContainer = full.find('.full-start-new__buttons');
    if (!buttonsContainer.length) return;

    full.find('.button--play').remove();

    const allBtns = full.find('.buttons--container .full-start__button')
      .add(buttonsContainer.find('.full-start__button'));

    const cats = { online: [], torrent: [], trailer: [], other: [] };
    allBtns.each(function () {
      const el = $(this);
      const c = el.attr('class') || '';
      if (c.includes('online')) cats.online.push(el);
      else if (c.includes('torrent')) cats.torrent.push(el);
      else if (c.includes('trailer')) cats.trailer.push(el);
      else cats.other.push(el.clone(true));
    });

    const order = Lampa.Storage.get('buttonsort') || ['torrent', 'online', 'trailer', 'other'];
    buttonsContainer.empty();
    order.forEach(k => cats[k].forEach(b => buttonsContainer.append(b)));

    if (Lampa.Storage.get('showbuttonwn') === true) {
      buttonsContainer.find('span').remove();
    }

    buttonsContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px' });
    Lampa.Controller.toggle('full_start');
  }

  // — очікуємо появи компонента у налаштуваннях
  function waitForAccentSettings(callback) {
    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (Lampa.SettingsApi.getComponent('accent_color_plugin')) {
        clearInterval(interval);
        callback();
      } else if (tries > 50) {
        clearInterval(interval);
        console.warn('[ShowButtons] accent_color_plugin not found');
      }
    }, 200);
  }

  function addSettings() {
    const SettingsApi = Lampa.SettingsApi;

    SettingsApi.addParam({
      component: 'accent_color_plugin',
      param: {
        name: 'showbutton',
        type: 'trigger',
        default: false
      },
      field: {
        name: Lampa.Lang.translate('showbutton_name'),
        description: Lampa.Lang.translate('showbutton_desc')
      },
      onChange: (val) => {
        Lampa.Storage.set('showbutton', val);
        if (val) {
          addHideTextOption();
          processCard();
        } else {
          Lampa.Storage.set('showbuttonwn', false);
          processCard();
        }
        Lampa.Settings.update();
      }
    });

    if (Lampa.Storage.get('showbutton') === true) addHideTextOption();
  }

  function addHideTextOption() {
    const SettingsApi = Lampa.SettingsApi;

    SettingsApi.addParam({
      component: 'accent_color_plugin',
      param: {
        name: 'showbuttonwn',
        type: 'trigger',
        default: false
      },
      field: {
        name: Lampa.Lang.translate('showbuttonwn_name'),
        description: Lampa.Lang.translate('showbuttonwn_desc')
      },
      onChange: (val) => {
        Lampa.Storage.set('showbuttonwn', val);
        processCard();
        Lampa.Settings.update();
      }
    });
  }

  function startListeners() {
    Lampa.Listener.follow('full', (e) => {
      if (e.type === 'complite' && Lampa.Storage.get('showbutton')) {
        setTimeout(processCard, 100);
      }
    });
  }

  function init() {
    Lang();
    waitForAccentSettings(() => {
      addSettings();
      startListeners();
      if (Lampa.Storage.get('showbutton')) processCard();
    });
  }

  if (window.appready) init();
  else {
    Lampa.Listener.follow('app', (e) => {
      if (e.type === 'ready') init();
    });
  }
})();
