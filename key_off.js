(function () {  
    'use strict';  
  
    // Унікальний ідентифікатор плагіну  
    var PLUGIN = 'lampac_keyboard';  
  
    // ─── Переклади ───────────────────────────────────────────────────────────  
    Lampa.Lang.add({  
        lampac_keyboard_title: {  
            ru: 'Управление клавиатурой',  
            uk: 'Керування клавіатурою',  
            en: 'Keyboard manager'  
        },  
        lampac_keyboard_default_layout: {  
            ru: 'Раскладка по умолчанию',  
            uk: 'Розкладка за замовчуванням',  
            en: 'Default layout'  
        },  
        lampac_keyboard_default_desc: {  
            ru: 'Активная раскладка при каждом открытии клавиатуры',  
            uk: 'Активна розкладка при кожному відкритті клавіатури',  
            en: 'Active layout every time the keyboard opens'  
        },  
        lampac_keyboard_hide_section: {  
            ru: 'Скрыть раскладки',  
            uk: 'Приховати розкладки',  
            en: 'Hide layouts'  
        },  
        lampac_keyboard_hide_desc: {  
            ru: 'Выбранная по умолчанию раскладка скрывается автоматически',  
            uk: 'Вибрана за замовчуванням розкладка приховується автоматично',  
            en: 'The default layout is hidden automatically'  
        }  
    });  
  
    // ─── Усі підтримувані розкладки Lampa ────────────────────────────────────  
    var LAYOUTS = [  
        { id: 'en',      label: 'English'      },  
        { id: 'ru',      label: 'Русский'       },  
        { id: 'uk',      label: 'Українська'    },  
        { id: 'ar',      label: 'Arabic'        },  
        { id: 'he',      label: 'Hebrew'        },  
        { id: 'zh',      label: 'Chinese'       },  
        { id: 'numbers', label: 'Numbers'       }  
    ];  
  
    // ─── Хелпери збереження ───────────────────────────────────────────────────  
    function getDefaultLayout() {  
        return Lampa.Storage.get(PLUGIN + '_default', 'en');  
    }  
  
    /** Повертає Set ідентифікаторів розкладок, які треба приховати (зі checkbox-ів) */  
    function getUserHiddenLayouts() {  
        return LAYOUTS  
            .filter(function (l) {  
                return Lampa.Storage.get(PLUGIN + '_hide_' + l.id, false);  
            })  
            .map(function (l) { return l.id; });  
    }  
  
    // ─── Застосування налаштувань до відкритої клавіатури ────────────────────  
    function applyToKeyboard() {  
        var defaultId   = getDefaultLayout();  
        var userHidden  = getUserHiddenLayouts();  
  
        // Розкладка за замовчуванням приховується автоматично  
        var allHidden = userHidden.slice();  
        if (allHidden.indexOf(defaultId) === -1) {  
            allHidden.push(defaultId);  
        }  
  
        // Сховати/показати кнопки мов клавіатури (Lampa використовує data-lang)  
        $('.keyboard [data-lang]').each(function () {  
            var lang = $(this).attr('data-lang');  
            if (allHidden.indexOf(lang) !== -1) {  
                $(this).hide();  
            } else {  
                $(this).show();  
            }  
        });  
  
        // Активувати розкладку за замовчуванням  
        var $defaultBtn = $('.keyboard [data-lang="' + defaultId + '"]');  
        if ($defaultBtn.length && !$defaultBtn.hasClass('active')) {  
            $defaultBtn.trigger('hover').click();  
        }  
    }  
  
    // ─── Підключення до події відкриття клавіатури ────────────────────────────  
    if (Lampa.Keyboard && Lampa.Keyboard.listener) {  
        Lampa.Keyboard.listener.follow('open', function () {  
            // невелика затримка, щоб DOM клавіатури встиг відрендеритись  
            setTimeout(applyToKeyboard, 30);  
        });  
    }  
  
    // ─── Реєстрація у налаштуваннях Lampa ─────────────────────────────────────  
    function registerSettings() {  
        if (!Lampa.SettingsApi) return;  
  
        // Секція плагіну  
        Lampa.SettingsApi.addComponent({  
            component: PLUGIN,  
            name: Lampa.Lang.translate('lampac_keyboard_title'),  
            icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">'  
                + '<path d="M20 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5'  
                + 'a2 2 0 0 0-2-2zm-9 3h2v2h-2V6zm0 4h2v2h-2v-2zM6 6h2v2H6V6zm0 4h2v2H6v-2z'  
                + 'm-1 5h14v2H5v-2zm13-3h-2v-2h2v2zm0-4h-2V6h2v2zm-4 4h-2v-2h2v2zm0-4h-2V6h2v2z'  
                + '</path></svg>'  
        });  
  
        // ── 1. Вибір розкладки за замовчуванням (ОДНА відповідь — select) ──  
        var layoutOptions = {};  
        LAYOUTS.forEach(function (l) { layoutOptions[l.id] = l.label; });  
  
        Lampa.SettingsApi.addParam({  
            component: PLUGIN,  
            param: {  
                name:    PLUGIN + '_default',  
                type:    'select',  
                values:  layoutOptions,  
                default: 'en'  
            },  
            field: {  
                name:        Lampa.Lang.translate('lampac_keyboard_default_layout'),  
                description: Lampa.Lang.translate('lampac_keyboard_default_desc')  
            },  
            onChange: function () {  
                applyToKeyboard();  
            }  
        });  
  
        // ── 2. Заголовок секції для checkbox-ів ──  
        Lampa.SettingsApi.addParam({  
            component: PLUGIN,  
            param: {  
                name:    PLUGIN + '_hide_header',  
                type:    'title',  
                default: ''  
            },  
            field: {  
                name:        Lampa.Lang.translate('lampac_keyboard_hide_section'),  
                description: Lampa.Lang.translate('lampac_keyboard_hide_desc')  
            }  
        });  
  
        // ── 3. Приховання розкладок (КІЛЬКА відповідей — checkbox per layout) ──  
        LAYOUTS.forEach(function (layout) {  
            Lampa.SettingsApi.addParam({  
                component: PLUGIN,  
                param: {  
                    name:    PLUGIN + '_hide_' + layout.id,  
                    type:    'checkbox',  
                    default: false  
                },  
                field: {  
                    name:        layout.label,  
                    description: ''  
                },  
                onChange: function () {  
                    applyToKeyboard();  
                }  
            });  
        });  
    }  
  
    // ─── Ініціалізація після готовності Lampa ─────────────────────────────────  
    Lampa.Listener.follow('ready', function () {  
        registerSettings();  
    });  
  
})();
