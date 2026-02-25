(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_select_v2) return;
    window.keyboard_settings_select_v2 = true;

    // ================= CONFIG =================

    const LANGUAGES = [
        { title: 'Українська', code: 'uk' },
        { title: 'Русский', code: 'ru' },
        { title: 'English', code: 'en' },
        { title: 'עִברִית', code: 'he' }
    ];

    // ================= STORAGE =================

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
        let stored = Lampa.Storage.get('keyboard_hidden_layouts', '');
        if (!stored || stored === 'undefined' || stored === 'null') return [];
        return stored.split(',').filter(Boolean);
    }

    function setHiddenLangs(list) {
        const defaultLang = getDefaultLang();

        // default не може бути прихованим
        list = list.filter(code => code !== defaultLang);

        Lampa.Storage.set(
            'keyboard_hidden_layouts',
            list.length ? list.join(',') : ''
        );
    }

    // ================= UI TEXT =================

    function getHiddenText() {
        const hidden = getHiddenLangs();

        const titles = LANGUAGES
            .filter(l => hidden.includes(l.code))
            .map(l => l.title);

        return titles.length ? titles.join(', ') : 'жодна';
    }

    function updateHiddenLabel() {
        setTimeout(() => {
            const el = document.querySelector(
                '[data-name="keyboard_hide_layouts"] .settings-param__value'
            );
            if (el) el.textContent = getHiddenText();
        }, 50);
    }

    // ================= MULTISELECT DIALOG =================

    function openHiddenDialog() {

        const defaultLang = getDefaultLang();

        const values = {};
        LANGUAGES.forEach(lang => {
            if (lang.code !== defaultLang) {
                values[lang.code] = lang.title;
            }
        });

        Lampa.Select.show({
            title: 'Приховати розкладки',
            type: 'multiselect',
            values: values,
            selected: getHiddenLangs(),

            onChange: function (selected) {

                if (!Array.isArray(selected)) selected = [];

                // гарантія захисту default
                selected = selected.filter(code => code !== defaultLang);

                setHiddenLangs(selected);
                updateHiddenLabel();
            },

            onBack: function () {
                updateHiddenLabel();
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // ================= HIDE LOGIC =================

    function isKeyboardSelector(selectbox) {
        if (!selectbox) return false;

        const items = selectbox.querySelectorAll('.selectbox-item.selector');
        return items.length === LANGUAGES.length;
    }

    function applyHide(selectbox) {

        if (!isLampaKeyboard()) return;
        if (!isKeyboardSelector(selectbox)) return;

        const defaultLang = getDefaultLang();
        const hidden = getHiddenLangs();

        selectbox.querySelectorAll('.selectbox-item.selector')
            .forEach(btn => {

                const text = btn.textContent.trim();
                const lang = LANGUAGES.find(l => l.title === text);
                if (!lang) return;

                const shouldHide =
                    hidden.includes(lang.code) &&
                    lang.code !== defaultLang;

                btn.style.display = shouldHide ? 'none' : '';
            });
    }

    // ================= SETTINGS =================

    Lampa.SettingsApi.addComponent({
        component: 'keyboard_settings_select',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    // DEFAULT LANGUAGE

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

            // прибираємо default із hidden
            let hidden = getHiddenLangs();
            hidden = hidden.filter(code => code !== value);
            setHiddenLangs(hidden);

            updateHiddenLabel();
        }
    });

    // HIDE LAYOUTS BUTTON

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

    // ================= OBSERVER =================

    function init() {

        if (!isLampaKeyboard()) return;

        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {

                    if (
                        node.nodeType === 1 &&
                        node.classList &&
                        node.classList.contains('selectbox')
                    ) {
                        setTimeout(() => applyHide(node), 100);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') init();
        });
    }

})();
