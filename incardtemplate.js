(function() {
    'use strict';

    Lampa.Lang.add({
        show_text_buttons: {
            ru: 'Показувати текст на всіх кнопках',
            uk: 'Показувати текст на всіх кнопках',
            en: 'Show text on all buttons'
        },
        hide_text_buttons: {
            ru: 'Залишити тільки іконки',
            uk: 'Залишити тільки іконки',
            en: 'Icons only'
        },
        show_all_buttons: {
            ru: 'Показувати всі кнопки',
            uk: 'Показувати всі кнопки',
            en: 'Show all buttons'
        }
    });

    function plugin_main() {
        const component = 'card_buttons_plugin';
        const storage_key = 'card_buttons_settings';
        const settings = Lampa.Storage.get(storage_key, {
            show_text: false,
            hide_text: false,
            show_all: false
        });

        function applySettings() {
            const buttons = document.querySelectorAll('.full-start__buttons .button');

            buttons.forEach(btn => {
                // Відновлення початкових станів
                btn.style.width = '';
                btn.style.transition = 'width 0.2s ease';

                const text = btn.querySelector('.button__text');

                if (text) {
                    text.style.display = '';
                }

                // --- Показати всі кнопки (у т.ч. приховані під «Дивитись»)
                if (settings.show_all) {
                    btn.classList.remove('hide');
                    btn.style.display = '';
                }

                // --- Режим "Тільки іконки"
                if (settings.hide_text) {
                    if (text) text.style.display = 'none';
                    btn.style.width = '48px';
                }
                // --- Режим "Текст на всіх кнопках"
                else if (settings.show_text) {
                    if (text) text.style.display = '';
                    btn.style.width = 'auto';
                }
                // --- Стандартна поведінка (текст тільки при фокусі)
                else {
                    if (text) text.style.display = '';
                    btn.style.width = '48px';
                    btn.addEventListener('focus', () => {
                        btn.style.width = 'auto';
                    });
                    btn.addEventListener('blur', () => {
                        if (!settings.show_text) btn.style.width = '48px';
                    });
                }
            });
        }

        function updateSetting(key, value) {
            settings[key] = value;
            Lampa.Storage.set(storage_key, settings);
            applySettings();
        }

        // Додавання налаштувань
        Lampa.SettingsApi.addParam({
            component,
            param: {
                name: 'show_text',
                type: 'toggle',
                default: settings.show_text,
                values: [false, true],
                value: settings.show_text,
                label: Lampa.Lang.translate('show_text_buttons'),
                onChange: v => updateSetting('show_text', v)
            }
        });

        Lampa.SettingsApi.addParam({
            component,
            param: {
                name: 'hide_text',
                type: 'toggle',
                default: settings.hide_text,
                values: [false, true],
                value: settings.hide_text,
                label: Lampa.Lang.translate('hide_text_buttons'),
                onChange: v => updateSetting('hide_text', v)
            }
        });

        Lampa.SettingsApi.addParam({
            component,
            param: {
                name: 'show_all',
                type: 'toggle',
                default: settings.show_all,
                values: [false, true],
                value: settings.show_all,
                label: Lampa.Lang.translate('show_all_buttons'),
                onChange: v => updateSetting('show_all', v)
            }
        });

        // Реакція без перезавантаження
        Lampa.Listener.follow('full', e => {
            if (e.type === 'card') setTimeout(applySettings, 100);
        });
    }

    if (!window.plugin_card_buttons_loaded) {
        window.plugin_card_buttons_loaded = true;
        plugin_main();
    }
})();
