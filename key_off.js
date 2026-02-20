(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_v3) return;
    window.keyboard_settings_v3 = true;

    const LANGUAGES = [
        { title: 'Українська', code: 'uk', hideKey: 'keyboard_hide_uk' },
        { title: 'Русский',    code: 'ru', hideKey: 'keyboard_hide_ru' },
        { title: 'English',    code: 'en', hideKey: 'keyboard_hide_en' },
        { title: 'עִברִית',   code: 'he', hideKey: 'keyboard_hide_he' }
    ];

    function getDefaultCode() {
        let code = Lampa.Storage.get('keyboard_default_lang', 'en');
        if (code === 'Українська') code = 'uk';
        if (code === 'Русский') code = 'ru';
        if (code === 'English') code = 'en';
        if (code === 'עִברִית') code = 'he';
        return code;
    }

    // Головна функція — тепер максимально надійна
    function applySettings() {
        try {
            const defaultCode = getDefaultCode();
            console.log('[Keyboard v3] Застосовую налаштування. Default:', defaultCode);

            // Твій оригінальний надійний селектор + .each()
            $('.selectbox-item.selector').each(function() {
                const item = $(this);
                const textDiv = item.find('> div').first();
                const text = textDiv.text().trim();

                const lang = LANGUAGES.find(l => l.title === text);
                if (!lang) return;

                const shouldHide = Lampa.Storage.get(lang.hideKey, 'false') === 'true' && lang.code !== defaultCode;

                if (shouldHide) {
                    item.css('display', 'none');
                    console.log('[Keyboard v3] СХОВАНО:', text);
                } else {
                    item.css('display', 'block');
                    console.log('[Keyboard v3] ПОКАЗАНО:', text);
                }
            });

            Lampa.Storage.set('keyboard_default_lang', defaultCode);
        } catch(e) {
            console.log('[Keyboard v3] Помилка applySettings:', e.message);
        }
    }

    // Меню вибору розкладки за замовчуванням
    function openDefaultMenu() {
        const current = getDefaultCode();
        const items = LANGUAGES.map(function(lang) {
            return {
                title: lang.title,
                value: lang.code,
                selected: lang.code === current
            };
        });

        Lampa.Select.show({
            title: 'Розкладка за замовчуванням',
            items: items,
            onSelect: function(item) {
                if (item.value) {
                    const langObj = LANGUAGES.find(l => l.code === item.value);
                    if (langObj) Lampa.Storage.set(langObj.hideKey, 'false');
                    Lampa.Storage.set('keyboard_default_lang', item.value);
                    applySettings();
                    console.log('[Keyboard v3] Default змінено на:', item.title);
                }
            },
            onBack: function() { Lampa.Controller.toggle('settings_component'); }
        });
    }

    // Меню вимкнення розкладок
    function openHideMenu() {
        const defaultCode = getDefaultCode();
        const items = LANGUAGES.map(function(lang) {
            const isHidden = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
            return {
                title: lang.title + (lang.code === defaultCode ? ' ← за замовчуванням' : ''),
                checkbox: true,
                selected: isHidden,
                disabled: lang.code === defaultCode,
                key: lang.hideKey
            };
        });

        Lampa.Select.show({
            title: 'Вимкнути розкладки',
            items: items,
            onSelect: function(item) {
                if (item.disabled) return;
                const newVal = item.selected ? 'false' : 'true';
                Lampa.Storage.set(item.key, newVal);
                applySettings();
                setTimeout(openHideMenu, 80);
            },
            onBack: function() { Lampa.Controller.toggle('settings_component'); }
        });
    }

    // === Налаштування в меню Лампи ===
    Lampa.SettingsApi.addComponent({
        component: 'keyboard_settings_v3',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v3',
        param: { name: 'keyboard_default', type: 'trigger' },
        field: { name: 'Розкладка за замовчуванням', description: 'Яка мова активна при відкритті клавіатури' },
        onRender: function(el) { el.on('hover:enter', openDefaultMenu); }
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v3',
        param: { name: 'keyboard_hide', type: 'trigger' },
        field: { name: 'Вимкнути розкладки', description: 'Приховати непотрібні (крім default)' },
        onRender: function(el) { el.on('hover:enter', openHideMenu); }
    });

    // Твій перевірений інтервал (50ms)
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            applySettings();
        }
    }, 50);

    // Запуск
    function start() {
        applySettings();
        setTimeout(applySettings, 600);
        setTimeout(applySettings, 1200);
        setTimeout(applySettings, 2000);
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function(e) {
        if (e.type === 'ready') start();
    });

    Lampa.Listener.follow('full', function(e) {
        if (e.type === 'start') setTimeout(start, 1500);
    });

    Lampa.Listener.follow('select', function(e) {
        if (e.type === 'open') {
            setTimeout(applySettings, 100);
            setTimeout(applySettings, 400);
            setTimeout(applySettings, 800);
        }
    });

})();
