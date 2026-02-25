(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_select_v3) return;
    window.keyboard_settings_select_v3 = true;

    var LANGUAGES = [
        { title: 'Українська', code: 'uk' },
        { title: 'Русский', code: 'ru' },
        { title: 'English', code: 'en' },
        { title: 'עִברִית', code: 'he' }
    ];

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
        return stored.split(',');
    }

    function setHiddenLangs(list) {
        var defaultLang = getDefaultLang();
        var clean = [];
        var i;

        for (i = 0; i < list.length; i++) {
            if (list[i] && list[i] !== defaultLang) {
                clean.push(list[i]);
            }
        }

        Lampa.Storage.set(
            'keyboard_hidden_layouts',
            clean.length ? clean.join(',') : ''
        );
    }

    function getHiddenText() {
        var hidden = getHiddenLangs();
        var titles = [];
        var i, j;

        for (i = 0; i < LANGUAGES.length; i++) {
            for (j = 0; j < hidden.length; j++) {
                if (LANGUAGES[i].code === hidden[j]) {
                    titles.push(LANGUAGES[i].title);
                }
            }
        }

        return titles.length ? titles.join(', ') : 'жодна';
    }

    function updateHiddenLabel() {
        setTimeout(function () {
            var el = document.querySelector(
                '[data-name="keyboard_hide_layouts"] .settings-param__value'
            );
            if (el) el.textContent = getHiddenText();
        }, 50);
    }

    function openHiddenDialog() {

        var defaultLang = getDefaultLang();
        var values = {};
        var i;

        for (i = 0; i < LANGUAGES.length; i++) {
            if (LANGUAGES[i].code !== defaultLang) {
                values[LANGUAGES[i].code] = LANGUAGES[i].title;
            }
        }

        Lampa.Select.show({
            title: 'Приховати розкладки',
            type: 'multiselect',
            values: values,
            selected: getHiddenLangs(),

            onChange: function (selected) {

                if (!selected || typeof selected.length === 'undefined') {
                    selected = [];
                }

                setHiddenLangs(selected);
                updateHiddenLabel();
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

        var i, j;

        for (i = 0; i < buttons.length; i++) {

            var btn = buttons[i];
            var text = btn.textContent.replace(/^\s+|\s+$/g, '');
            var lang = null;

            for (j = 0; j < LANGUAGES.length; j++) {
                if (LANGUAGES[j].title === text) {
                    lang = LANGUAGES[j];
                    break;
                }
            }

            if (!lang) continue;

            var shouldHide = false;

            for (j = 0; j < hidden.length; j++) {
                if (hidden[j] === lang.code && lang.code !== defaultLang) {
                    shouldHide = true;
                }
            }

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
            type: 'button'
        },
        field: {
            name: 'Приховати розкладки'
        },
        onChange: openHiddenDialog,
        onRender: function (el) {
            el.find('.settings-param__value')
                .text(getHiddenText());
        }
    });

    function init() {

        if (!isLampaKeyboard()) return;

        var observer = new MutationObserver(function (mutations) {

            var i, j;

            for (i = 0; i < mutations.length; i++) {

                var nodes = mutations[i].addedNodes;

                for (j = 0; j < nodes.length; j++) {

                    var node = nodes[j];

                    if (
                        node.nodeType === 1 &&
                        node.classList &&
                        node.classList.contains('selectbox')
                    ) {
                        setTimeout(function () {
                            applyHide(node);
                        }, 100);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }

})();
