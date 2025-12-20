// плагін попередження завантаження  
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
  
    // Додаємо параметр в налаштування  
    function addSettingsParam() {    
    Lampa.SettingsApi.addParam({    
        component: 'interface_customization',    
        param: {    
            name: 'attention_enabled',    
            type: 'trigger',    
            default: true    
        },    
        field: {    
            name: '<div style="display: flex; align-items: center;"><svg width="32" height="32" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 10px; flex-shrink: 0;"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M7.89 1.05a1 1 0 0 0-1.78 0l-5.5 11a1 1 0 0 0 .89 1.45h11a1 1 0 0 0 .89-1.45zM7 5v3.25"/><path d="M7 11a.25.25 0 1 1 0-.5m0 .5a.25.25 0 1 0 0-.5"/></g></svg>' + Lampa.Lang.translate('attention_enabled') + '</div>',    
            description: Lampa.Lang.translate('attention_description')    
        },    
        onChange: function(value) {    
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
  
    function createHintText(hintText, id) {  
        return '<div id="' + id + '" style="overflow: hidden; display: flex; align-items: center; background-color: rgba(0, 0, 0, 0.07); border-radius: 0.5em; margin-left: 1.2em; margin-right: 1.2em; padding: 0.8em; font-size: 1.2em; transition: opacity 0.5s; line-height: 1.4;">' + hintText + '</div>';  
    }  
      
    function createHintText_incard(hintText, id) {  
        return '<div id="' + id + '" style="overflow: hidden; display: flex; align-items: center; background-color: rgba(0, 0, 0, 0.15); border-radius: 0.5em; margin-bottom: 1.2em; padding: 0.8em;  font-size: 1.2em; transition: opacity 0.5s; line-height: 1.4;">' + hintText + '</div>';  
    }  
      
    function fadeOutAndRemove($el, duration) {  
        var height = $el[0].scrollHeight;  
      
        $el.css({  
            maxHeight: height + 'px',  
            overflow: 'hidden'  
        });  
      
        // Force reflow  
        $el[0].offsetHeight;  
      
        // Схлопывание  
        $el.css({  
            transition: 'opacity ' + duration + 'ms, max-height ' + duration + 'ms, margin-bottom ' + duration + 'ms, padding ' + duration + 'ms',  
            opacity: '0',  
            maxHeight: '0px',  
            marginBottom: '0px',  
            paddingTop: '0px',  
            paddingBottom: '0px'  
        });  
      
        // Подождём чуть дольше, чем сама анимация, чтобы DOM спокойно переварил  
        setTimeout(function () {  
            $el.remove();  
        }, duration + 50); // буфер для плавності  
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
        var shown = {  
            online: false,  
            torrents: false,  
            incard: false  
        };  
  
        // Отримуємо початковий стан з налаштувань  
        var attentionEnabled = Lampa.Storage.field('attention_enabled', true);  
        CONFIG.online.enabled = attentionEnabled;  
        CONFIG.torrents.enabled = attentionEnabled;  
        CONFIG.incard.enabled = attentionEnabled;  
  
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
        // Ініціалізуємо функціонал  
        initializeHintFeature();  
    }  
  
    // Важливо: реєструємо параметр негайно, не чекаючи appready  
    addSettingsParam();  
  
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
