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
            name: '<div style="display: flex; align-items: center;"><svg height="24" width="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xml:space="preserve" fill="none"><g stroke-width="0"/><g stroke-linecap="round" stroke-linejoin="round"/><path class="st0" d="M256.007 357.113c-16.784 0-30.411 13.613-30.411 30.397 0 16.791 13.627 30.405 30.411 30.405s30.397-13.614 30.397-30.405c.001-16.784-13.612-30.397-30.397-30.397"/><path class="st0" d="M505.097 407.119 300.769 53.209c-9.203-15.944-26.356-25.847-44.777-25.847-18.407 0-35.544 9.904-44.747 25.847L6.902 407.104c-9.203 15.943-9.203 35.751 0 51.694 9.204 15.943 26.356 25.84 44.763 25.84h408.67c18.406 0 35.559-9.897 44.762-25.84s9.204-35.751 0-51.679m-40.632 25.286c-2.95 5.103-8.444 8.266-14.35 8.266H61.878c-5.892 0-11.394-3.163-14.329-8.281-2.964-5.11-2.979-11.445-.014-16.548l194.122-336.24c2.943-5.103 8.436-8.274 14.35-8.274a16.59 16.59 0 0 1 14.336 8.282l194.122 336.226a16.62 16.62 0 0 1 0 16.569"/><path class="st0" d="M256.007 152.719c-16.784 0-30.411 13.613-30.411 30.405l11.68 137.487c0 10.346 8.378 18.724 18.731 18.724 10.338 0 18.731-8.378 18.731-18.724l11.666-137.487c.001-16.793-13.612-30.405-30.397-30.405"/></svg>' + Lampa.Lang.translate('attention_enabled') + '</div>',    
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
