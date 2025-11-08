(function () {
  'use strict';

  // --- Локалізація ---
  Lampa.Lang.add({
    showtextbuttons_name: {
      ru: 'Показывать текст на кнопках без фокуса',
      en: 'Show text on buttons without focus',
      uk: 'Показувати текст на кнопках без фокусу'
    },
    showtextbuttons_desc: {
      ru: 'Всегда отображает подписи на кнопках, даже без фокуса',
      en: 'Always show button labels, even without focus',
      uk: 'Завжди показує підписи на кнопках, навіть без фокусу'
    }
  });

  // --- Основна функція ---
  function showTextButtons() {
    const enabled = Lampa.Storage.get('showtextbuttons', 'false') === 'true';
    $('#accent_color_showtextbuttons').remove();

    if (enabled) {
      const style = `
        <style id="accent_color_showtextbuttons">
          .full-start-new__buttons .full-start__button span {
            display: inline !important;
          }
          @media screen and (max-width: 580px) {
            .full-start-new__buttons {
              overflow: auto;
            }
          }
        </style>`;
      $('body').append(style);
    }
  }

  // --- Ініціалізація налаштування ---
  function initShowTextButtons() {
    Lampa.SettingsApi.addParam({
      component: 'accent_color_plugin',
      param: {
        name: 'showtextbuttons',
        type: 'trigger',
        default: false
      },
      field: {
        name: Lampa.Lang.translate('showtextbuttons_name'),
        description: Lampa.Lang.translate('showtextbuttons_desc')
      },
      onChange: function (value) {
        Lampa.Storage.set('showtextbuttons', value);
        Lampa.Settings.update();

        // 🔄 Перезавантаження для застосування змін
        setTimeout(() => {
          Lampa.Noty.show(Lampa.Lang.translate('reloading') || 'Перезавантаження...');
          location.reload();
        }, 300);
      }
    });

    showTextButtons();
  }

  // --- Запуск після готовності застосунку ---
  if (window.appready) {
    initShowTextButtons();
  } else {
    Lampa.Listener.follow('app', function (event) {
      if (event.type === 'ready') initShowTextButtons();
    });
  }

})();
