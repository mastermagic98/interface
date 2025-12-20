(function () {
    'use strict';

    // Додаємо переклади
    Lampa.Lang.add({
        hints_torrents: {
            ru: "Видео не загружается или тормозит? Попробуйте выбрать другую раздачу.",
            en: "Video not loading or lagging? Try a different torrent.",
            uk: "Відео не завантажується чи гальмує? Спробуйте іншу роздачу."
        },
        hints_online: {
            ru: "Видео не загружается или тормозит? Попробуйте выбрать другой источник или озвучку.",
            en: "Video not loading or lagging? Try a different source or audio track.",
            uk: "Відео не завантажується чи гальмує? Спробуйте інше джерело або озвучення.",
        },
        hints_incard: {
            ru: "Информация о фильме может появиться раньше, чем он станет доступен для просмотра.",
            en: "A film may appear in the catalog before it's available to watch.",
            uk: "Інформація про фільм може з'явитися раніше, ніж він стане доступним для перегляду."
        },
        attention_enabled: {
            ru: 'Попередження вмикати',
            en: 'Enable warnings',
            uk: 'Попередження вмикати'
        },
        attention_description: {
            ru: 'Включает предупреждения о том, что видео еще недоступно для просмотра, доступна только информация о нем',
            en: 'Enables warnings that video is not yet available for viewing, only information about it is available',
            uk: 'Вмикає попередження про те, що відео ще недоступне для перегляду, доступна тільки інформація про нього'
        }
    });

    var CONFIG = {
        online: {
            id: 'hint-online-banner',
            showDuration: 3000,
            fadeDuration: 500,
            repeat: false,
            enabled: true
        },
        torrents: {
            id: 'hint-torrent-banner',
            showDuration: 4000,
            fadeDuration: 500,
            repeat: false,
            enabled: true
        },
        incard: {
            id: 'hint-incard-banner',
            showDuration: 4000,
            fadeDuration: 500,
            repeat: false,
            enabled: true
        }
    };

    // Додаємо параметр в налаштування з іконкою
    function addSettingsParam() {
        Lampa.SettingsApi.addParam({
            component: 'interface_customization',
            param: {
                name: 'attention_enabled',
                type: 'trigger',
                default: true
            },
            field: {
                name: `
                    <div style="display: flex; align-items: center;">
                        <!-- Іконка SVG -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14" fill="#000000" style="margin-right: 10px;">
                            <g fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M7.89 1.05a1 1 0 0 0-1.78 0l-5.5 11a1 1 0 0 0 .89 1.45h11a1 1 0 0 0 .89-1.45zM7 5v3.25"/>
                                <path d="M7 11a.25.25 0 1 1 0-.5m0 .5a.25.25 0 1 0 0-.5"/>
                            </g>
                        </svg>
                        ${Lampa.Lang.translate('attention_enabled')}
                    </div>
                `,
                description: Lampa.Lang.translate('attention_description')
            },
            onChange: function(value) {
                // Оновлюємо CONFIG при зміні
                CONFIG.online.enabled = value;
                CONFIG.torrents.enabled = value;
                CONFIG.incard.enabled = value;
            }
        });

        // Примусово оновлюємо відображення налаштувань після додавання параметра
        if (Lampa.Settings && Lampa.Settings.main) {
            Lampa.Settings.main().render();
        }
    }

    function startPlugin() {
        // Ініціалізуємо функціонал
        addSettingsParam();
    }

    // Важливо: реєструємо параметр негайно, не чекаючи appready
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                startPlugin();
            }
        });
    }
})();
