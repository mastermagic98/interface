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
            uk: "Відео не завантажується чи гальмує? Спробуйте інше джерело або озвучення."
        },
        hints_incard: {
            ru: "Информация о фильме может появиться раньше, чем он станет доступен для просмотра.",
            en: "A film may appear in the catalog before it's available to watch.",
            uk: "Інформація про фільм може з’явитися раніше, ніж він стане доступним для перегляду."
        },
        attention_enable: {
            ru: "Предупреждения о доступности видео",
            en: "Video availability warnings",
            uk: "Попередження про доступність відео"
        }
    });

    // Конфігурація підказок
    var CONFIG = {
        online: {
            id: 'hint-online-banner',
            showDuration: 3000,
            fadeDuration: 500,
            repeat: false
        },
        torrents: {
            id: 'hint-torrent-banner',
            showDuration: 4000,
            fadeDuration: 500,
            repeat: false
        },
        incard: {
            id: 'hint-incard-banner',
            showDuration: 4000,
            fadeDuration: 500,
            repeat: false
        }
    };

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

    // Логіка показу підказок
    function initializeHintFeature() {
        var enabled = Lampa.Storage.get('attention_warnings_enabled', true);

        var shown = {
            online: false,
            torrents: false,
            incard: false
        };

        // Слухаємо зміну налаштування
        Lampa.Storage.listener.follow('change', function (event) {
            if (event.name === 'attention_warnings_enabled') {
                enabled = event.value;
            }
        });

        // Основний слухач активності
        Lampa.Storage.listener.follow('change', function (event) {
            if (event.name === 'activity' && enabled) {
                var component = Lampa.Activity.active().component;

                if (component === 'lampac' && (CONFIG.online.repeat || !shown.online)) {
                    waitForElement('.explorer__files-head', function (el) {
                        var $hint = $(createHintText(Lampa.Lang.translate('hints_online'), CONFIG.online.id));
                        $(el).before($hint);
                        setTimeout(function () {
                            fadeOutAndRemove($hint, CONFIG.online.fadeDuration);
                        }, CONFIG.online.showDuration);
                        shown.online = true;
                    });
                }

                if (component === 'torrents' && (CONFIG.torrents.repeat || !shown.torrents)) {
                    waitForElement('.explorer__files-head', function (el) {
                        var $hint = $(createHintText(Lampa.Lang.translate('hints_torrents'), CONFIG.torrents.id));
                        $(el).before($hint);
                        setTimeout(function () {
                            fadeOutAndRemove($hint, CONFIG.torrents.fadeDuration);
                        }, CONFIG.torrents.showDuration);
                        shown.torrents = true;
                    });
                }

                if (component === 'full' && (CONFIG.incard.repeat || !shown.incard)) {
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

    // Додаємо пункт з іконкою та радіокнопкою (кружечок з галочкою) безпосередньо в розділ
    function addDirectMenuItem() {
        Lampa.SettingsApi.addParam({
            component: 'interface_customization',
            param: {
                type: 'selectbox_icon'
            },
            field: {
                name: Lampa.Lang.translate('attention_enable')
            },
            icon: '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5v3"/><circle cx="7" cy="11" r=".5"/><path d="M7.89 1.05a1 1 0 0 0-1.78 0l-5.5 11a1 1 0 0 0 .89 1.45h11a1 1 0 0 0 .89-1.45Z"/></g></svg>',
            picked: Lampa.Storage.get('attention_warnings_enabled', true),
            onSelect: function () {
                var newState = !Lampa.Storage.get('attention_warnings_enabled', true);
                Lampa.Storage.set('attention_warnings_enabled', newState);

                // Оновлюємо візуальний стан елемента в налаштуваннях
                var $settings = Lampa.Settings.main().render();
                var $item = $settings.find('.settings-param[data-type="selectbox_icon"]').filter(function() {
                    return $(this).find('.settings-param-title span').text() === Lampa.Lang.translate('attention_enable');
                });

                if (newState) {
                    $item.addClass('selected');
                } else {
                    $item.removeClass('selected');
                }
            }
        });
    }

    // Запуск після готовності додатка
    if (window.appready) {
        initializeHintFeature();
        addDirectMenuItem();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initializeHintFeature();
                addDirectMenuItem();
            }
        });
    }
})();
