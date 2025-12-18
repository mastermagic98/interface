(function () {
    'use strict';

    // Додаємо переклади для підказок та меню
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
        hints_plugin_title: {
            ru: "Підказки завантаження",
            en: "Loading hints",
            uk: "Підказки завантаження"
        },
        hints_online_title: {
            ru: "Онлайн-перегляд",
            en: "Online viewing",
            uk: "Онлайн-перегляд"
        },
        hints_torrents_title: {
            ru: "Торренти",
            en: "Torrents",
            uk: "Торренти"
        },
        hints_incard_title: {
            ru: "В картці фільму",
            en: "In movie card",
            uk: "В картці фільму"
        },
        hints_online_subtitle: {
            ru: "Підказка при онлайн-перегляді",
            en: "Hint for online viewing",
            uk: "Підказка при онлайн-перегляді"
        },
        hints_torrents_subtitle: {
            ru: "Підказка при торрентах",
            en: "Hint for torrents",
            uk: "Підказка при торрентах"
        },
        hints_incard_subtitle: {
            ru: "Підказка в картці фільму",
            en: "Hint in movie card",
            uk: "Підказка в картці фільму"
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

    // Функція створення банера підказки (для онлайн і торрентів)
    function createHintText(hintText, id) {
        return '<div id="' + id + '" style="overflow: hidden; display: flex; align-items: center; background-color: rgba(0, 0, 0, 0.07); border-radius: 0.5em; margin-left: 1.2em; margin-right: 1.2em; padding: 0.8em; font-size: 1.2em; transition: opacity 0.5s; line-height: 1.4;">' + hintText + '</div>';
    }

    // Функція створення банера підказки в картці фільму
    function createHintText_incard(hintText, id) {
        return '<div id="' + id + '" style="overflow: hidden; display: flex; align-items: center; background-color: rgba(0, 0, 0, 0.15); border-radius: 0.5em; margin-bottom: 1.2em; padding: 0.8em; font-size: 1.2em; transition: opacity 0.5s; line-height: 1.4;">' + hintText + '</div>';
    }

    // Функція плавного зникнення та видалення елемента
    function fadeOutAndRemove($el, duration) {
        var height = $el[0].scrollHeight;

        $el.css({
            maxHeight: height + 'px',
            overflow: 'hidden'
        });

        // Примусово викликаємо reflow
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

    // Очікування появи елемента в DOM
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

    // Основна функція ініціалізації підказок
    function initializeHintFeature() {
        var shown = {
            online: false,
            torrents: false,
            incard: false
        };

        Lampa.Storage.listener.follow('change', function (event) {
            if (event.name === 'activity') {
                var component = Lampa.Activity.active().component;

                // Підказка для онлайн-перегляду (lampac)
                if (component === 'lampac' && Lampa.Storage.get('hints_online_enabled', true) && (CONFIG.online.repeat || !shown.online)) {
                    waitForElement('.explorer__files-head', function (el) {
                        var $hint = $(createHintText(Lampa.Lang.translate('hints_online'), CONFIG.online.id));
                        $(el).before($hint);
                        setTimeout(function () {
                            fadeOutAndRemove($hint, CONFIG.online.fadeDuration);
                        }, CONFIG.online.showDuration);
                        shown.online = true;
                    });
                }

                // Підказка для торрентів
                if (component === 'torrents' && Lampa.Storage.get('hints_torrents_enabled', true) && (CONFIG.torrents.repeat || !shown.torrents)) {
                    waitForElement('.explorer__files-head', function (el) {
                        var $hint = $(createHintText(Lampa.Lang.translate('hints_torrents'), CONFIG.torrents.id));
                        $(el).before($hint);
                        setTimeout(function () {
                            fadeOutAndRemove($hint, CONFIG.torrents.fadeDuration);
                        }, CONFIG.torrents.showDuration);
                        shown.torrents = true;
                    });
                }

                // Підказка в картці фільму
                if (component === 'full' && Lampa.Storage.get('hints_incard_enabled', true) && (CONFIG.incard.repeat || !shown.incard)) {
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

    // Функція додавання пункту в меню (виконується тільки після готовності app)
    function addMenuItem() {
        Lampa.Menu.addButton(
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4l3 3"></path></svg>',
            Lampa.Lang.translate('hints_plugin_title'),
            function () {
                Lampa.Select.show({
                    title: Lampa.Lang.translate('hints_plugin_title'),
                    items: [
                        {
                            title: Lampa.Lang.translate('hints_online_title'),
                            subtitle: Lampa.Lang.translate('hints_online_subtitle'),
                            checkbox: true,
                            checked: Lampa.Storage.get('hints_online_enabled', true),
                            onSelect: function (item) {
                                Lampa.Storage.set('hints_online_enabled', item.checked);
                            }
                        },
                        {
                            title: Lampa.Lang.translate('hints_torrents_title'),
                            subtitle: Lampa.Lang.translate('hints_torrents_subtitle'),
                            checkbox: true,
                            checked: Lampa.Storage.get('hints_torrents_enabled', true),
                            onSelect: function (item) {
                                Lampa.Storage.set('hints_torrents_enabled', item.checked);
                            }
                        },
                        {
                            title: Lampa.Lang.translate('hints_incard_title'),
                            subtitle: Lampa.Lang.translate('hints_incard_subtitle'),
                            checkbox: true,
                            checked: Lampa.Storage.get('hints_incard_enabled', true),
                            onSelect: function (item) {
                                Lampa.Storage.set('hints_incard_enabled', item.checked);
                            }
                        }
                    ],
                    onBack: function () {
                        Lampa.Controller.toggle('menu');
                    }
                });
            }
        );
    }

    // Запуск після готовності додатка
    if (window.appready) {
        initializeHintFeature();
        addMenuItem();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initializeHintFeature();
                addMenuItem();
            }
        });
    }
})();
