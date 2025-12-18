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
        attention_title: {
            ru: "Предупреждения о доступности видео",
            en: "Video availability warnings",
            uk: "Попередження про доступність відео"
        },
        attention_enable: {
            ru: "Показывать предупреждения",
            en: "Show warnings",
            uk: "Показувати попередження"
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

        Lampa.Storage.listener.follow('change', function (event) {
            if (event.name === 'attention_warnings_enabled') {
                enabled = event.value;
            }
        });

        Lampa.Storage.listener.follow('change', function (event) {
            if (event.name === 'activity' && enabled) {
                var component = Lampa.Activity.active().component;

                if (component === 'lampac' && (CONFIG.online.repeat || !shown.online)) {
                    if ($('#' + CONFIG.online.id).length === 0) {
                        waitForElement('.explorer__files-head', function (el) {
                            var $hint = $(createHintText(Lampa.Lang.translate('hints_online'), CONFIG.online.id));
                            $(el).before($hint);
                            setTimeout(function () {
                                fadeOutAndRemove($hint, CONFIG.online.fadeDuration);
                            }, CONFIG.online.showDuration);
                            shown.online = true;
                        });
                    }
                }

                if (component === 'torrents' && (CONFIG.torrents.repeat || !shown.torrents)) {
                    if ($('#' + CONFIG.torrents.id).length === 0) {
                        waitForElement('.explorer__files-head', function (el) {
                            var $hint = $(createHintText(Lampa.Lang.translate('hints_torrents'), CONFIG.torrents.id));
                            $(el).before($hint);
                            setTimeout(function () {
                                fadeOutAndRemove($hint, CONFIG.torrents.fadeDuration);
                            }, CONFIG.torrents.showDuration);
                            shown.torrents = true;
                        });
                    }
                }

                if (component === 'full' && (CONFIG.incard.repeat || !shown.incard)) {
                    if ($('#' + CONFIG.incard.id).length === 0) {
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
            }
        });
    }

    // Додаємо параметр-кнопку в розділ Кастомізація інтерфейсу
    function addSettingsButton() {
        // Уникаємо дублювання кнопки
        Lampa.SettingsApi.removeParam('interface_customization', 'attention_warnings_button');

        Lampa.SettingsApi.addParam({
            component: 'interface_customization',
            name: 'attention_warnings_button',
            param: {
                type: 'button'
            },
            field: {
                name: Lampa.Lang.translate('attention_title')
            },
            onChange: function () {
                Lampa.Select.show({
                    title: Lampa.Lang.translate('attention_title'),
                    items: [
                        {
                            title: Lampa.Lang.translate('attention_enable'),
                            checkbox: true,
                            checked: Lampa.Storage.get('attention_warnings_enabled', true),
                            onSelect: function (item) {
                                Lampa.Storage.set('attention_warnings_enabled', item.checked);
                            }
                        }
                    ],
                    onBack: function () {
                        // Правильне повернення в розділ Кастомізація інтерфейсу
                        Lampa.Settings.main().render().find('[data-component="interface_customization"]').trigger('hover').trigger('click');
                    }
                });
            }
        });
    }

    // Запуск після готовності додатка
    if (window.appready) {
        initializeHintFeature();
        addSettingsButton();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initializeHintFeature();
                addSettingsButton();
            }
        });
    }
})();
