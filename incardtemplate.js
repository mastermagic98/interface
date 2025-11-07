(function () {
    'use strict';

    Lampa.Lang.add({
        incard_template: {
            ru: 'Картка: всі кнопки в ряд (нічого не ховається)',
            en: 'Card: all buttons in row (nothing hidden)',
            uk: 'Картка: всі кнопки в ряд (нічого не ховається)'
        }
    });

    var finalTemplate = [
        '<div class="full-start-new">',
            '<div class="full-start-new__body">',
                '<div class="full-start-new__left">',
                    '<div class="full-start-new__poster">',
                        '<img class="full-start-new__img full--poster" />',
                    '</div>',
                '</div>',
                '<div class="full-start-new__right">',
                    '<div class="full-start-new__head"></div>',
                    '<div class="full-start-new__title">{title}</div>',
                    '<div class="full-start__title-original">{original_title}</div>',
                    '<div class="full-start-new__tagline full--tagline">{tagline}</div>',

                    '<div class="full-start-new__rate-line">',
                        '<div class="full-start__rate rate--tmdb"><div>{rating}</div><div class="source--name">TMDB</div></div>',
                        '<div class="full-start__rate rate--imdb"><div></div><div class="source--name">IMDb</div></div>',
                        '<div class="full-start__rate rate--kp"><div></div><div class="source--name">Кинопоиск</div></div>',
                        '<div class="full-start__pg"></div>',
                        '<div class="full-start__status"></div>',
                    '</div>',

                    '<div class="full-start-new__details"></div>',
                    '<div class="full-start-new__reactions"><div>#{reactions_none}</div></div>',

                    // === КНОПКИ ===
                    '<div class="full-start-new__buttons">',
                        '<div class="full-start__button selector button--play focusable"><span>#{title_watch}</span></div>',
                        '<div class="full-start__button view--torrent focusable"><span>#{full_torrents}</span></div>',
                        '<div class="full-start__button selector view--trailer focusable"><span>#{full_trailers}</span></div>',
                        '<div class="full-start__button selector button--book focusable"><span>#{settings_input_links}</span></div>',
                        '<div class="full-start__button selector button--reaction focusable"><span>#{title_reactions}</span></div>',
                        '<div class="full-start__button selector button--subscribe focusable"><span>#{title_subscribe}</span></div>',
                        '<div class="full-start__button selector button--options head__action open--settings focusable"><span>•••</span></div>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join('');

    function applyTemplate() {
        if (Lampa.Storage.get('incard_template', 'true') !== 'true') return;

        Lampa.Template.add('full_start_new', finalTemplate);
        Lampa.Template.add('full', finalTemplate);

        setTimeout(function () {
            const styleId = 'incard-buttons-global-fix';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = `
                    /* Скасовуємо стилі Lampa, що ховали кнопки */
                    .full-start__buttons,
                    .full-start-new__buttons {
                        display: flex !important;
                        flex-wrap: nowrap !important;
                        overflow: visible !important;
                        white-space: nowrap !important;
                        justify-content: flex-start !important;
                        align-items: center !important;
                        gap: 12px !important;
                        padding: 10px 0 !important;
                        max-width: none !important;
                        height: auto !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                    }

                    .full-start-new__buttons > div,
                    .full-start__buttons > div {
                        display: flex !important;
                        align-items: center !important;
                        justify-content: center !important;
                        min-width: 70px !important;
                        position: relative !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        pointer-events: auto !important;
                    }

                    /* Повне вимкнення приховування */
                    [class*="hide"], .hide, .hidden {
                        display: flex !important;
                        opacity: 1 !important;
                        visibility: visible !important;
                    }
                `;
                document.head.appendChild(style);
            }

            // Скидаємо приховання, якщо Lampa динамічно застосувала hide
            document.querySelectorAll('.full-start__button, .full-start-new__button').forEach(btn => {
                btn.classList.remove('hide');
                btn.style.display = 'flex';
            });
        }, 300);
    }

    function addSetting() {
        try {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: { name: 'incard_template', type: 'trigger', default: true },
                field: {
                    name: Lampa.Lang.translate('incard_template'),
                    description: 'Усі кнопки в ряд, без приховування'
                },
                onChange: function (v) {
                    Lampa.Storage.set('incard_template', !!v);
                    setTimeout(() => location.reload(), 500);
                }
            });
        } catch (e) {}
    }

    function hookFullRender() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'render') setTimeout(applyTemplate, 100);
        });
    }

    function init() {
        addSetting();
        applyTemplate();
        hookFullRender();
    }

    if (window.appready) init();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }
})();
