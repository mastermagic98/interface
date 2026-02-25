(function () {  
    'use strict';  
  
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;  
    if (window.keyboard_settings_select_v3) return;  
    window.keyboard_settings_select_v3 = true;  
  
    var LANGUAGES = [  
        { title: 'Українська', code: 'uk' },  
        { title: 'Русский',    code: 'ru' },  
        { title: 'English',    code: 'en' },  
        { title: 'עִברִית',   code: 'he' }  
    ];  
  
    function log(msg) {  
        console.log('[keyboard_settings_select_v3]', msg);  
    }  
  
    function isLampaKeyboard() {  
        return Lampa.Storage.get('keyboard_type', 'lampa') === 'lampa';  
    }  
  
    function getDefaultLang() {  
        return Lampa.Storage.get('keyboard_default_lang', 'uk');  
    }  
  
    function setDefaultLang(code) {  
        Lampa.Storage.set('keyboard_default_lang', code);  
    }  
  
    function getHiddenLangs() {  
        var stored = Lampa.Storage.get('keyboard_hidden_layouts', '');  
        if (!stored || stored === 'undefined' || stored === 'null') return [];  
        return stored.split(',').filter(Boolean);  
    }  
  
    function setHiddenLangs(list) {  
        var defaultLang = getDefaultLang();  
        var clean = list.filter(function (c) { return c && c !== defaultLang; });  
        Lampa.Storage.set('keyboard_hidden_layouts', clean.length ? clean.join(',') : '');  
    }  
  
    function getHiddenText() {  
        var hidden = getHiddenLangs();  
        var titles = hidden.map(function (code) {  
            var lang = LANGUAGES.find(function (l) { return l.code === code; });  
            return lang ? lang.title : '';  
        }).filter(Boolean);  
        return titles.length ? titles.join(', ') : 'жодна';  
    }  
  
    function updateHiddenLabel() {  
        setTimeout(function () {  
            var el = document.querySelector('[data-name="keyboard_hide_layouts"] .settings-param__value');  
            if (el) el.textContent = getHiddenText();  
        }, 50);  
    }  
  
    function openHiddenDialog() {  
        var defaultLang = getDefaultLang();  
        var values = {};  
        LANGUAGES.forEach(function (lang) {  
            if (lang.code !== defaultLang) values[lang.code] = lang.title;  
        });  
  
        function buildItems() {  
            var hidden = getHiddenLangs();  
            return Object.keys(values).map(function (code) {  
                return {  
                    title: values[code],  
                    checkbox: true,  
                    selected: hidden.indexOf(code) !== -1,  
                    code: code  
                };  
            });  
        }  
  
        var items = buildItems();  
  
        Lampa.Select.show({  
            title: 'Приховати розкладки',  
            items: items,  
            onSelect: function (item) {  
                if (!item || !item.code) return;  
                var hidden = getHiddenLangs();  
                var idx = hidden.indexOf(item.code);  
                if (idx === -1) {  
                    hidden.push(item.code);  
                } else {  
                    hidden.splice(idx, 1);  
                }  
                setHiddenLangs(hidden);  
                updateHiddenLabel();  
                // Оновити список без закриття  
                var newItems = buildItems();  
                if (typeof Lampa.Select.update === 'function') {  
                    Lampa.Select.update(newItems);  
                } else {  
                    Lampa.Select.destroy();  
                    setTimeout(openHiddenDialog, 0);  
                }  
            },  
            onBack: function () {  
                updateHiddenLabel();  
                Lampa.Controller.toggle('settings_component');  
            }  
        });  
    }  
  
    function isKeyboardSelector(selectbox) {  
        if (!selectbox) return false;  
        var items = selectbox.querySelectorAll('.selectbox-item.selector');  
        return items.length === LANGUAGES.length;  
    }  
  
    function applyHide(selectbox) {  
        if (!isLampaKeyboard()) return;  
        if (!isKeyboardSelector(selectbox)) return;  
  
        var defaultLang = getDefaultLang();  
        var hidden = getHiddenLangs();  
        var buttons = selectbox.querySelectorAll('.selectbox-item.selector');  
  
        for (var i = 0; i < buttons.length; i++) {  
            var btn = buttons[i];  
            var text = btn.textContent.replace(/^\s+|\s+$/g, '');  
            var lang = LANGUAGES.find(function (l) { return l.title === text; });  
            if (!lang) continue;  
            var shouldHide = hidden.indexOf(lang.code) !== -1 && lang.code !== defaultLang;  
            btn.style.display = shouldHide ? 'none' : '';  
        }  
    }  
  
    Lampa.SettingsApi.addComponent({  
        component: 'keyboard_settings_select',  
        name: 'Налаштування клавіатури',  
        icon: '<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'  
    });  
  
    Lampa.SettingsApi.addParam({  
        component: 'keyboard_settings_select',  
        param: {  
            name: 'keyboard_default_lang',  
            type: 'select',  
            values: {  
                uk: 'Українська',  
                ru: 'Русский',  
                en: 'English',  
                he: 'עִברִית'  
            },  
            default: 'uk'  
        },  
        field: {  
            name: 'Розкладка за замовчуванням'  
        },  
        onChange: function (value) {  
            setDefaultLang(value);  
            var hidden = getHiddenLangs();  
            setHiddenLangs(hidden);  
            updateHiddenLabel();  
        }  
    });  
  
    Lampa.SettingsApi.addParam({  
        component: 'keyboard_settings_select',  
        param: {  
            name: 'keyboard_hide_layouts',  
            type: 'trigger'  
        },  
        field: {  
            name: 'Приховати розкладки'  
        },  
        onRender: function (el) {  
            try {  
                var valueEl = el.querySelector('.settings-param__value');  
                if (valueEl) valueEl.textContent = getHiddenText();  
                el.off('hover:enter').on('hover:enter', openHiddenDialog);  
            } catch (e) {  
                log('onRender hide error: ' + e.message);  
            }  
        }  
    });  
  
    function init() {  
        if (!isLampaKeyboard()) return;  
        var observer = new MutationObserver(function (mutations) {  
            for (var i = 0; i < mutations.length; i++) {  
                var nodes = mutations[i].addedNodes;  
                for (var j = 0; j < nodes.length; j++) {  
                    var node = nodes[j];  
                    if (node.nodeType === 1 && node.classList && node.classList.contains('selectbox')) {  
                        setTimeout(function () { applyHide(node); }, 100);  
                    }  
                }  
            }  
        });  
        observer.observe(document.body, { childList: true, subtree: true });  
    }  
  
    if (window.appready) {  
        init();  
    } else {  
        Lampa.Listener.follow('app', function (e) {  
            if (e.type === 'ready') init();  
        });  
    }  
})();
