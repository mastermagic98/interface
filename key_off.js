(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_select) return;
    window.keyboard_settings_select = true;

    const LANGUAGES = [
        { title: 'Українська', code: 'uk' },
        { title: 'Русский', code: 'ru' },
        { title: 'English', code: 'en' },
        { title: 'עִברִית', code: 'he' }
    ];

    function isLampaKeyboard() {
        return Lampa.Storage.get('keyboard_type', 'lampa') === 'lampa';
    }

    function getDefaultCode() {
        return Lampa.Storage.get('keyboard_default_lang', 'uk');
    }

    function getHiddenLanguages() {
        let stored = Lampa.Storage.get('keyboard_hidden_layouts', '');
        if (!stored || stored === 'undefined' || stored === 'null') return [];
        return stored.split(',').filter(Boolean);
    }

    function saveHiddenLanguages(hidden) {
        const defaultCode = getDefaultCode();

        // гарантія: default не може бути прихованим
        hidden = hidden.filter(code => code !== defaultCode);

        Lampa.Storage.set('keyboard_hidden_layouts',
            hidden.length ? hidden.join(',') : ''
        );
    }

    function getHiddenLanguagesText() {
        const hidden = getHiddenLanguages();
        const titles = LANGUAGES
            .filter(l => hidden.includes(l.code))
            .map(l => l.title);

        return titles.length ? titles.join(', ') : 'жодна';
    }

    function isKeyboardLanguageSelector() {
        const selectbox = document.querySelector('.selectbox');
        if (!selectbox) return false;

        const items = selectbox.querySelectorAll('.selectbox-item.selector');
        return items.length === LANGUAGES.length;
    }

    function applyHidingToSelector() {
        if (!isLampaKeyboard()) return;
        if (!isKeyboardLanguageSelector()) return;

        const defaultCode = getDefaultCode();
        const hidden = getHiddenLanguages();

        document.querySelectorAll('.selectbox-item.selector').forEach(btn => {
            const text = btn.textContent.trim();
            const lang = LANGUAGES.find(l => l.title === text);
            if (!lang) return;

            const hide = hidden.includes(lang.code) && lang.code !== defaultCode;
            btn.style.display = hide ? 'none' : '';
        });
    }

    function showHideLayoutsDialog() {
        const defaultCode = getDefaultCode();
        let currentHidden = getHiddenLanguages().slice();

        function openDialog() {

            const items = LANGUAGES
                .filter(l => l.code !== defaultCode)
                .map(l => ({
                    title: l.title,
                    checkbox: true,
                    selected: currentHidden.includes(l.code),
                    code: l.code
                }));

            Lampa.Select.show({
                title: 'Приховати розкладки',
                items: items,

                onSelect: function (item) {
                    const index = currentHidden.indexOf(item.code);

                    if (index > -1)
                        currentHidden.splice(index, 1);
                    else
                        currentHidden.push(item.code);

                    saveHiddenLanguages(currentHidden);

                    Lampa.Select.destroy();
                    setTimeout(openDialog, 0);
                },

                onBack: function () {
                    saveHiddenLanguages(currentHidden);
                    updateHideDisplay();
                    Lampa.Controller.toggle('settings_component');
                }
            });
        }

        openDialog();
    }

    function updateHideDisplay() {
        setTimeout(() => {
            const el = document.querySelector('[data-name="keyboard_hide_button"] .settings-param__value');
            if (el) el.textContent = getHiddenLanguagesText();
        }, 50);
    }

    // ================= SETTINGS =================

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
            Lampa.Storage.set('keyboard_default_lang', value);

            // видаляємо default із hidden
            let hidden = getHiddenLanguages();
            hidden = hidden.filter(code => code !== value);
            saveHiddenLanguages(hidden);

            updateHideDisplay();
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_select',
        param: {
            name: 'keyboard_hide_button',
            type: 'button'
        },
        field: {
            name: 'Приховати розкладки'
        },
        onChange: showHideLayoutsDialog,
        onRender: function (el) {
            el.find('.settings-param__value')
                .text(getHiddenLanguagesText());
        }
    });

    // ================= INIT =================

    function init() {
        if (!isLampaKeyboard()) return;

        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1 &&
                        node.classList &&
                        node.classList.contains('selectbox')) {

                        setTimeout(applyHidingToSelector, 100);
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
