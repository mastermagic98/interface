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
            name: '<div style="display: flex; align-items: center;">  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="margin-right:10px;flex-shrink:0;min-width:24px;min-height:24px;max-width:24px;max-height:24px" fill="currentColor"><g/><g/><path class="s0" d="M12 16.74c-.79 0-1.43.64-1.43 1.42a1.43 1.43 0 1 0 2.86 0c0-.78-.64-1.42-1.43-1.42"/><path class="s0" d="M23.68 19.08 14.1 2.49A2.45 2.45 0 0 0 12 1.28c-.86 0-1.67.47-2.1 1.21L.32 19.08a2.45 2.45 0 0 0 0 2.43c.43.74 1.24 1.21 2.1 1.21h19.16c.86 0 1.67-.47 2.1-1.21.43-.75.43-1.68 0-2.43m-1.91 1.19c-.14.24-.39.39-.67.39H2.9c-.28 0-.53-.15-.67-.39a.78.78 0 0 1 0-.78l9.1-15.76c.14-.24.39-.39.67-.39q.1 0 .2.03t.19.08.16.12.12.16l9.1 15.76q.05.09.08.19t.03.2-.03.2-.08.19"/><path class="s0" d="M12 7.16c-.79 0-1.43.64-1.43 1.42l.55 6.45c0 .48.4.88.88.88s.88-.4.88-.88l.55-6.45c0-.78-.64-1.42-1.43-1.42"/></svg>' + Lampa.Lang.translate('attention_enabled') + '</div>',    
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
