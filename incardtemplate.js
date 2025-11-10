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
          ru: "Показывает только иконки (взаємовиключно з 'Великі кнопки')",
          en: "Show only icons (mutually exclusive with 'Large buttons')",
          uk: "Показує лише іконки (взаємовиключно з 'Великі кнопки')"
        }
      });
    } catch (e) {
      console.error('[Lang] Error:', e);
    }
  }

  // --- Допоміжні: робота з Storage (строки 'true'/'false') ---
  function isTrue(key) {
    try {
      var v = Lampa.Storage.get(key);
      return v === true || v === 'true' || v === '1' || v === 1;
    } catch (e) {
      return false;
    }
  }
  function setBool(key, val) {
    try {
      Lampa.Storage.set(key, !!val ? 'true' : 'false');
    } catch (e) {}
  }

  // --- Стилі: bigbuttons ---
  function applyBigButtons() {
    try {
      var enabled = isTrue('bigbuttons');
      var id = 'accent_color_bigbuttons';
      var existing = document.getElementById(id);
      if (existing) existing.parentNode.removeChild(existing);

      if (enabled) {
        var style = document.createElement('style');
        style.id = id;
        style.type = 'text/css';
        style.innerHTML =
          '.full-start-new__buttons .full-start__button { min-width:120px !important; padding:8px 12px !important; font-size:14px !important; }' +
          '.full-start-new__buttons .full-start__button:not(.focus) span { display:inline !important; }' +
          '@media screen and (max-width:580px){' +
          '.full-start-new__buttons { overflow-x:auto; overflow-y:hidden; white-space:nowrap; padding-bottom:10px; }' +
          '.full-start-new__buttons .full-start__button { min-width:80px !important; padding:6px 8px !important; font-size:12px !important; }' +
          '.full-start-new__buttons .full-start__button:not(.focus) span { display:none !important; }' +
          '}';
        document.head.appendChild(style);
      }
    } catch (e) {
      console.error('[BigButtons] Apply error:', e);
    }
  }

  // --- Стилі: hide text (не видаляти DOM) ---
  function applyHideText() {
    try {
      var enabled = isTrue('showbuttonwn');
      var id = 'accent_color_hide_text';
      var existing = document.getElementById(id);
      if (existing) existing.parentNode.removeChild(existing);

      if (enabled) {
        var style = document.createElement('style');
        style.id = id;
        style.type = 'text/css';
        style.innerHTML = '.full-start-new__buttons .full-start__button span, .buttons--container .full-start__button span { display: none !important; }';
        document.head.appendChild(style);
      }
    } catch (e) {
      console.error('[HideText] Apply error:', e);
    }
  }

  // --- Показ усіх кнопок (логіка main$2 -> showAll) ---
  function ShowButtons() {
    try {
      Lampa.Listener.follow('full', function (e) {
        if (e.type !== 'complite') return;

        setTimeout(function () {
          try {
            if (!isTrue('showbutton')) return;

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

            var order = Lampa.Storage.get('buttonsort') || ['torrent', 'online', 'trailer', 'other'];

            targetContainer.empty();
            order.forEach(function (c) {
              if (!categories[c]) return;
              for (var i = 0; i < categories[c].length; i++) {
                targetContainer.append(categories[c][i]);
              }
            });

            // Працює з hide-text опцією (так ми не видаляємо span постійно)
            if (isTrue('showbuttonwn')) {
              // applyHideText() встановлює CSS, тут додатково нічого не треба
            }

            targetContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });

            // додатково оновлюємо стилі
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

  // --- Застосувати прямо до відкритої картки (без перезавантаження) ---
  function applyToCurrentCard() {
    try {
      // оновлюємо CSS-стилі
      applyBigButtons();
      applyHideText();

      // якщо картка вже відкрита, застосувати на ній
      var cont = $('.full-start-new__buttons');
      if (cont && cont.length) {
        // показати/сховати spans відповідно
        if (isTrue('showbuttonwn')) cont.find('span').hide();
        else cont.find('span').show();

        // якщо showbutton увімкнений — виконаємо сортування/додавання кнопок
        if (isTrue('showbutton')) {
          // викличемо ту саму логіку, що і в ShowButtons (аналогічно — менш безпечно, але працює)
          // щоб не дублювати, просто тригеримо подію render -> complite не завжди зряжено,
          // тому виконаємо просте додавання з існуючих елементів
          var fullContainer = $(document);
          var targetContainer = cont;
          var allButtons = $('.buttons--container .full-start__button').add(targetContainer.find('.full-start__button'));
          var categories = { online: [], torrent: [], trailer: [], other: [] };
          allButtons.each(function () {
            var $b = $(this);
            var cls = $b.attr('class') || '';
            if (cls.indexOf('online') !== -1) categories.online.push($b);
            else if (cls.indexOf('torrent') !== -1) categories.torrent.push($b);
            else if (cls.indexOf('trailer') !== -1) categories.trailer.push($b);
            else categories.other.push($b.clone(true));
          });
          var order = Lampa.Storage.get('buttonsort') || ['torrent', 'online', 'trailer', 'other'];
          targetContainer.empty();
          order.forEach(function (c) {
            if (!categories[c]) return;
            for (var i = 0; i < categories[c].length; i++) {
              targetContainer.append(categories[c][i]);
            }
          });
        }
      }
    } catch (e) {
      console.error('[ApplyCurrent] Error:', e);
    }
  }

  // --- Налаштування (додаємо всі опції в accent_color_plugin) ---
  function Settings() {
    try {
      // гарантуємо дефолти (зберігаємо рядки 'true'/'false')
      if (Lampa.Storage.get('showbutton') === undefined) setBool('showbutton', false);
      if (Lampa.Storage.get('bigbuttons') === undefined) setBool('bigbuttons', false);
      if (Lampa.Storage.get('showbuttonwn') === undefined) setBool('showbuttonwn', false);

      // 1) showbutton — завжди додаємо
      Lampa.SettingsApi.addParam({
        component: "accent_color_plugin",
        param: { name: "showbutton", type: "trigger", default: false },
        field: { name: Lampa.Lang.translate('showbutton_name'), description: Lampa.Lang.translate('showbutton_desc') },
        onChange: function (value) {
          setBool('showbutton', value);
          // якщо виключено — нічого автоматично не відключаємо
          // при зміні застосовуємо одразу
          applyToCurrentCard();
        }
      });

      // 2) bigbuttons
      Lampa.SettingsApi.addParam({
        component: "accent_color_plugin",
        param: { name: "bigbuttons", type: "trigger", default: false },
        field: { name: Lampa.Lang.translate('bigbuttons_name'), description: Lampa.Lang.translate('bigbuttons_desc') },
        onChange: function (value) {
          // взаємовиключність: якщо вкл. bigbuttons — вимикаємо showbuttonwn
          setBool('bigbuttons', value);
          if (value) setBool('showbuttonwn', false);
          applyBigButtons();
          applyHideText(); // щоб синхронізувати
          applyToCurrentCard();
        }
      });

      // 3) showbuttonwn (hide text) — взаємовиключно з bigbuttons
      Lampa.SettingsApi.addParam({
        component: "accent_color_plugin",
        param: { name: "showbuttonwn", type: "trigger", default: false },
        field: { name: Lampa.Lang.translate('showbuttonwn_name'), description: Lampa.Lang.translate('showbuttonwn_desc') },
        onChange: function (value) {
          setBool('showbuttonwn', value);
          if (value) setBool('bigbuttons', false);
          applyHideText();
          applyBigButtons();
          applyToCurrentCard();
        }
      });
    } catch (e) {
      console.error('[Settings] Build error:', e);
    }
  }

  // --- Маніфест (не змінює логіку) ---
  var manifest = {
    type: "other",
    version: "1.9.1",
    author: "@chatgpt",
    name: "Show Buttons + Large Buttons",
    description: "Стабільна версія. showbutton завжди доступний; bigbuttons і hide-text взаємовиключні.",
    component: "accent_color_plugin"
  };

  // --- Ініціалізація плагіну ---
  function add() {
    try {
      Lang();
      Settings();

      // застосувати стани відразу
      applyBigButtons();
      applyHideText();
      applyToCurrentCard();

      // слухач для подальших відкриттів карток
      ShowButtons();

      // реєструємо в Manifest
      try { Lampa.Manifest.plugins = manifest; } catch (e) {}

    } catch (e) {
      console.error('[Plugin Init] Critical error:', e);
    }
  }

  function startPlugin() {
    try {
      if (window.appready) add();
      else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') add();
      });
    } catch (e) {
      console.error('[StartPlugin] Error:', e);
    }
  }

  startPlugin();
})();
