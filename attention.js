(function () {
    'use strict';

    // Додаємо переклади для підказок
    Lampa.Lang.add({
        hints_torrents: {
            ru: "Видео не загружается или тормозит? Попробуйте выбрать другую раздачу.",
            en: "Video not loading or lagging? Try a different torrent.",
            uk: "Відео не завантажується чи гальмує? Спробуйте іншу роздачу."
        },
        hints_online: {
            ru: "Видео не загружается или тормозит? Попробуйте выбрать другой источник или озвучку.",
            en: "Video not loading or lagging? Try a different source or audio track.",
            uk: "Відео не завантажується чи гальмує? Спробуйте інше джерело або озвучення."
        },
        hints_incard: {
            ru: "Информация о фильме может появиться раньше, чем он станет доступен для просмотра.",
            en: "A film may appear in the catalog before it's available to watch.",
            uk: "Інформація про фільм може з’явитися раніше, ніж він стане доступним для перегляду."
        },
        hints_enable_title: {
            ru: 'Увімкнути попередження',
            en: 'Enable hints',
            uk: 'Увімкнути попередження'
        },
        hints_enable_desc: {
            ru: 'Відображає попередження про те, що відеоматеріал може бути ще недоступним.',
            en: 'Displays warnings that the video material may not yet be available.',
            uk: 'Відображає попередження про те, що відеоматеріал може бути ще недоступним.'
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

    // Основна змінна стану увімкнення (зберігається в Lampa.Storage)
    var hintsEnabled = Lampa.Storage.get('hints_enabled', true);

    function createHintText(hintText, id) {
        return '<div id="' + id + '" style="overflow: hidden; display: flex; align-items: center; background-color: rgba(0, 0, 0, 0.07); border-radius: 0.5em; margin-left: 1.2em; margin-right: 1.2em; padding: 0.8em; font-size: 1.2em; transition: opacity 0.5s; line-height: 1.4;">' + hintText + '</div>';
    }

    function createHintText_incard(hintText, id) {
        return '<div id="' + id + '" style="overflow: hidden; display: flex; align-items: center; background-color: rgba(0, 0, 0, 0.15); border-radius: 0.5em; margin-bottom: 1.2em; padding: 0.8em; font-size: 1.2em; transition: opacity 0.5s; line-height: 1.4;">' + hintText + '</div>';
    }

    function fadeOutAndRemove($el, duration) {
        var height = $el[0].scrollHeight;

        $el.css({
            maxHeight: height + 'px',
            overflow: 'hidden'
        });

        // Force reflow
        $el[0].offsetHeight;

        $el.css({
            transition: 'opacity ' + duration + 'ms, max-height ' + duration + 'ms, margin-bottom ' + duration + 'ms, padding ' + duration + 'ms',
            opacity: '0',
            maxHeight: '0px',
            marginBottom: '0px',
            paddingTop: '0px',
            paddingBottom: '0px'
        });

        setTimeout(function () {
            $el.remove();
        }, duration + 50);
    }

    function waitForElement(selector, callback) {
        var check = function () {
            var el = document.querySelector(selector);
            if (el) {
                callback(el);
                return true;
            }
            return false;
        };
        if (typeof MutationObserver !== 'undefined') {
            if (check()) return;
            var observer = new MutationObserver(function () {
                if (check()) observer.disconnect();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            var interval = setInterval(function () {
                if (check()) clearInterval(interval);
            }, 500);
        }
    }

    function initializeHintFeature() {
        if (!hintsEnabled) return; // Якщо вимкнено — нічого не робимо

        var shown = {
            online: false,
            torrents: false,
            incard: false
        };

        Lampa.Storage.listener.follow('change', function (event) {
            if (event.name === 'activity') {
                var component = Lampa.Activity.active().component;

                if (component === 'lampac' && CONFIG.online.enabled && (CONFIG.online.repeat || !shown.online)) {
                    waitForElement('.explorer__files-head', function (el) {
                        var $hint = $(createHintText(Lampa.Lang.translate('hints_online'), CONFIG.online.id));
                        $(el).before($hint);
                        setTimeout(function () {
                            fadeOutAndRemove($hint, CONFIG.online.fadeDuration);
                        }, CONFIG.online.showDuration);
                        shown.online = true;
                    });
                }

                if (component === 'torrents' && CONFIG.torrents.enabled && (CONFIG.torrents.repeat || !shown.torrents)) {
                    waitForElement('.explorer__files-head', function (el) {
                        var $hint = $(createHintText(Lampa.Lang.translate('hints_torrents'), CONFIG.torrents.id));
                        $(el).before($hint);
                        setTimeout(function () {
                            fadeOutAndRemove($hint, CONFIG.torrents.fadeDuration);
                        }, CONFIG.torrents.showDuration);
                        shown.torrents = true;
                    });
                }

                if (component === 'full' && CONFIG.incard.enabled && (CONFIG.incard.repeat || !shown.incard)) {
                    waitForElement('.full-start-new__head', function (el) {
                        var $hint = $(createHintText_incard(Lampa.Lang.translate('hints_incard'), CONFIG.incard.id));
                        $(el).before($hint);
                        setTimeout(function () {
                            fadeOutAndRemove($hint, CONFIG.incard.fadeDuration);
                        }, CONFIG.incard.showDuration);
                        shown.incard = true;
                    });
                }
            }
        });
    }

    function startPlugin() {
        // Додаємо перемикач у розділ custom_interface_plugin
        Lampa.SettingsApi.addParam({
            component: 'custom_interface_plugin',
            param: {
                name: 'hints_enabled',
                type: 'toggle',
                title: Lampa.Lang.translate('hints_enable_title'),
                description: Lampa.Lang.translate('hints_enable_desc'),
                default: true
            },
            icon: '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="m4.5 12.5l-4 1l1-3v-9a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1Zm3-9.5v3"/><circle cx="7.5" cy="9" r=".5"/></g></svg>',
            onChange: function (value) {
                hintsEnabled = value;
                Lampa.Storage.set('hints_enabled', value);
                // Якщо вимкнули — видаляємо всі існуючі банери
                if (!value) {
                    $('#hint-online-banner, #hint-torrent-banner, #hint-incard-banner').remove();
                }
            },
            onRender: function (element) {
                // Встановлюємо поточне значення при рендері
                element.toggle(hintsEnabled);
            }
        });

        // Ініціалізуємо функціонал підказок
        initializeHintFeature();
    }

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
