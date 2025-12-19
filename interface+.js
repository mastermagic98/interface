(function () {  
    'use strict';  
  
    // Додаємо переклад для назви плагіна  
    Lampa.Lang.add({  
        custom_interface_plugin: {  
            ru: 'Кастомізація інтерфейсу',  
            en: 'Customization interface',  
            uk: 'Кастомізація інтерфейсу'  
        }  
    });  
  
    // Додаємо стилі для радіокнопок  
    Lampa.Template.add('interface_radio_style', `  
        <style>  
        .interface-radio-button {  
            display: flex;  
            align-items: center;  
            height: 34px;  
            padding: 0 1.5em;  
            background-color: rgba(255,255,255,0.06);  
            border-radius: 0.3em;  
            margin-bottom: 0.8em;  
            cursor: pointer;  
            transition: background-color 0.2s;  
        }  
          
        .interface-radio-button.focus {  
            background-color: #fff;  
            color: #000;  
        }  
          
        .interface-radio-button__icon {  
            width: 24px;  
            height: 24px;  
            margin-right: 1em;  
            flex-shrink: 0;  
        }  
          
        .interface-radio-button__text {  
            font-size: 1.3em;  
            flex-grow: 1;  
        }  
          
        .interface-radio-button__radio {  
            width: 20px;  
            height: 20px;  
            border: 2px solid currentColor;  
            border-radius: 50%;  
            position: relative;  
            margin-left: auto;  
            flex-shrink: 0;  
        }  
          
        .interface-radio-button.enabled .interface-radio-button__radio::after {  
            content: '';  
            position: absolute;  
            top: 50%;  
            left: 50%;  
            transform: translate(-50%, -50%);  
            width: 8px;  
            height: 8px;  
            background-color: currentColor;  
            border-radius: 50%;  
        }  
        </style>  
    `);  
  
    // Список модулів для підключення  
    var modules = [  
        'https://mastermagic98.github.io/interface/attention.js',  
        'https://mastermagic98.github.io/interface/cardify.js',  
        'https://mastermagic98.github.io/interface/color.js',  
        'https://mastermagic98.github.io/interface/aloader.js',  
        'https://mastermagic98.github.io/interface/loaders.js',  
        'https://mastermagic98.github.io/interface/animations.js',  
        'https://mastermagic98.github.io/interface/incardtemplate.js',  
        'https://mastermagic98.github.io/interface/fix_lang.js'  
    ];  
  
    // Асинхронне підключення модулів  
    modules.forEach(function (url) {  
        Lampa.Utils.putScriptAsync([url], function () {}, function () {});  
    });  
  
    // Функція створення радіокнопки  
    function createRadioButton(key, icon, text, defaultValue, description) {  
        var enabled = Lampa.Storage.field(key, defaultValue);  
        var button = $(`  
            <div class="interface-radio-button selector ${enabled ? 'enabled' : ''}" data-key="${key}">  
                <div class="interface-radio-button__icon">${icon}</div>  
                <div class="interface-radio-button__text">${text}</div>  
                <div class="interface-radio-button__radio"></div>  
            </div>  
        `);  
          
        var descr = $(`<div class="settings-param__descr" style="margin-top: -0.5em; margin-bottom: 1em; padding-left: 3.5em; font-size: 1.1em; opacity: 0.7;">${description}</div>`);  
          
        button.on('hover:enter', function() {  
            var newState = !Lampa.Storage.field(key);  
            Lampa.Storage.set(key, newState);  
              
            if (newState) {  
                button.addClass('enabled');  
            } else {  
                button.removeClass('enabled');  
            }  
              
            // Повідомляємо attention.js про зміну  
            Lampa.Listener.trigger('attention_setting_changed', {key: key, enabled: newState});  
        });  
          
        return button.add(descr);  
    }  
  
    // Функція ініціалізації плагіна  
    function startPlugin() {  
        // Додаємо стилі  
        $('body').append(Lampa.Template.get('interface_radio_style', {}, true));  
          
        // Додаємо новий розділ у Налаштуваннях  
        Lampa.SettingsApi.addComponent({  
            component: 'interface_customization',  
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14" fill="none"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H1a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2m-7 9l-1 2.5M8 11l1 2.5m-5 0h6M7.5 2v9M3 5h2M3 8h1"/><path d="m7.5 7l1.21-1a2 2 0 0 1 2.55 0l2.24 2"/></g></svg>',  
            name: Lampa.Lang.translate('custom_interface_plugin'),  
            render: function() {  
                var container = $('<div></div>');  
                  
                // Додаємо кнопку для attention.js  
                var attentionIcon = '<svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style="width: 24px; height: 24px; stroke: white; fill: none;"><path d="M7 5v3"/><circle cx="7" cy="11" r=".5"/><path d="M7.89 1.05a1 1 0 0 0-1.78 0l-5.5 11a1 1 0 0 0 .89 1.45h11a1 1 0 0 0 .89-1.45Z"/></svg>';  
                var attentionButton = createRadioButton(  
                    'attention_enabled',   
                    attentionIcon,   
                    Lampa.Lang.translate('attention_enabled'),   
                    true,  
                    Lampa.Lang.translate('attention_description')  
                );  
                  
                container.append(attentionButton);  
                  
                return container;  
            }  
        });  
  
        // Оновлюємо відображення налаштувань  
        if (Lampa.Settings && Lampa.Settings.main) {  
            Lampa.Settings.main().render();  
        }  
    }  
  
    // Запускаємо плагін після готовності програми  
    if (window.appready) {  
        startPlugin();  
    } else {  
        Lampa.Listener.follow('app', function (event) {  
            if (event.type === 'ready') {  
                startPlugin();  
            }  
        });  
    }  
  
    // Опис маніфесту плагіна  
    Lampa.Manifest.plugins = {  
        name: 'custom_interface_plugin',  
        version: '1.0.0',  
        description: 'Customization interface'  
    };  
})();
