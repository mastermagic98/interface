(function(){
    'use strict';
 
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_hide_plugin) return;
    window.keyboard_hide_plugin = true;

    const LANGUAGES = [
        { title: 'Українська' },
        { title: 'Русский' },
        { title: 'English' },
        { title: 'עִברִית' }
    ];

    function getHidden() {
        try {
            const hidden = JSON.parse(localStorage.getItem('keyboard_hidden_layouts') || '[]');
            console.log('[keyboard_hide] localStorage GET: ' + JSON.stringify(hidden));
            return hidden;
        } catch (e) {
            return [];
        }
    }

    function setHidden(hidden) {
        localStorage.setItem('keyboard_hidden_layouts', JSON.stringify(hidden));
        console.log('[keyboard_hide] localStorage SET: ' + JSON.stringify(hidden));
    }

    function parseHtml(str) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(str, "text/html");
        return doc.querySelector("parsererror") ? null : doc;
    }

    function filterHtml(doc) {
        var hidden = getHidden();
        var items = doc.querySelectorAll('.selectbox-item.selector');

        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var title = item.querySelector('.selectbox-item__title');
            if (title) {
                var text = title.textContent.trim();
                if (hidden.includes(text)) {
                    item.remove();
                    console.log('[keyboard_hide] Hidden: ' + text);
                }
            }
        }

        return doc.body.innerHTML;
    }

    function applyHiding() {
        var selectContent = $('.selectbox__content.layer--height');
        if (selectContent.length) {
            var html = selectContent.prop('outerHTML');
            var doc = parseHtml(html);
            if (doc) {
                var newHtml = filterHtml(doc);
                selectContent.html($(newHtml).html());
                console.log('[keyboard_hide] Applied hiding to menu');
            }
        } else {
            console.log('[keyboard_hide] Menu not found');
        }
    }

    function openHideMenu() {
        var hidden = getHidden();
        var items = LANGUAGES.map(lang => ({
            title: lang.title,
            checkbox: true,
            selected: hidden.includes(lang.title),
            lang: lang.title
        }));

        Lampa.Select.show({
            title: 'Приховати розкладки',
            items: items,
            onSelect: function(item) {
                if (item.lang) {
                    var newHidden = hidden.slice();
                    var index = newHidden.indexOf(item.lang);
                    if (index > -1) {
                        newHidden.splice(index, 1);
                    } else {
                        newHidden.push(item.lang);
                    }
                    setHidden(newHidden);
                    updateDisplays();
                }
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
                setTimeout(updateDisplays, 500);
            }
        });
    }

    function openDefaultMenu() {
        var current = Lampa.Storage.get('keyboard_default_lang', 'uk');
        var items = LANGUAGES.map(lang => ({
            title: lang.title,
            value: lang.title,
            selected: lang.title === current
        }));

        Lampa.Select.show({
            title: 'Розкладка за замовчуванням',
            items: items,
            onSelect: function(item) {
                Lampa.Storage.set('keyboard_default_lang', item.value);
                updateDisplays();
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
                setTimeout(updateDisplays, 500);
            }
        });
    }

    function updateDisplays() {
        setTimeout(() => {
            var hidden = getHidden();
            $('.settings-param[data-name="keyboard_hide_trigger"] .settings-param__value').text(hidden.length ? hidden.join(', ') : 'жодна');
            $('.settings-param[data-name="keyboard_default_trigger"] .settings-param__value').text(Lampa.Storage.get('keyboard_default_lang', 'Українська'));
        }, 300);
    }

    Lampa.SettingsApi.addComponent({
        component: 'keyboard_hide_plugin',
        name: 'Приховати розкладки',
        icon: '<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });
 
    Lampa.SettingsApi.addParam({
        component: 'keyboard_hide_plugin',
        param: { name: 'keyboard_default_trigger', type: 'trigger', default: false },
        field: { name: 'Розкладка за замовчуванням', description: 'Вибір розкладки за замовчуванням' },
        onRender: function(el) {
            setTimeout(() => {
                el.find('.settings-param__value').text(Lampa.Storage.get('keyboard_default_lang', 'Українська'));
            }, 100);
            el.on('hover:enter', openDefaultMenu);
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_hide_plugin',
        param: { name: 'keyboard_hide_trigger', type: 'trigger', default: false },
        field: { name: 'Приховати розкладки', description: 'Вибір розкладок для приховування' },
        onRender: function(el) {
            setTimeout(() => {
                var hidden = getHidden();
                el.find('.settings-param__value').text(hidden.length ? hidden.join(', ') : 'жодна');
            }, 100);
            el.on('hover:enter', openHideMenu);
        }
    });

    // Твій робочий інтервал
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            setTimeout(applyHiding, 100);
        }
    }, 0);

    setTimeout(updateDisplays, 500);
 
    if (window.appready) updateDisplays();
    else Lampa.Listener.follow('app', e => { if (e.type === 'ready') updateDisplays(); });
 
})();
