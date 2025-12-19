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
  
    // Додаємо стилі для параметрів-папок  
    function addFolderParamStyles() {  
        let style = document.createElement('style');  
        style.textContent = `  
            .settings-folder-param {  
                box-sizing: border-box;  
                color: rgb(255, 255, 255);  
                cursor: pointer;  
                display: flex;  
                font-family: "SegoeUI", sans-serif;  
                font-size: 17.1082px;  
                line-height: 17.1px;  
                outline-color: rgb(255, 255, 255);  
                outline-style: none;  
                outline-width: 0px;  
                padding-bottom: 25.6623px;  
                padding-left: 34.2165px;  
                padding-right: 34.2165px;  
                padding-top: 25.6623px;  
                transition-behavior: normal;  
                transition-delay: 0s;  
                transition-duration: 0s;  
                transition-property: none;  
                transition-timing-function: ease;  
                user-select: none;  
                will-change: transform;  
                align-items: center;  
            }  
              
            .settings-folder-param__icon {  
                box-sizing: border-box;  
                color: rgb(255, 255, 255);  
                cursor: pointer;  
                display: flex;  
                flex-shrink: 0;  
                font-family: "SegoeUI", sans-serif;  
                font-size: 17.1082px;  
                height: 34.2167px;  
                line-height: 17.1px;  
                margin-right: 25.6623px;  
                outline-color: rgb(255, 255, 255);  
                outline-style: none;  
                outline-width: 0px;  
                transition-behavior: normal;  
                transition-delay: 0s;  
                transition-duration: 0s;  
                transition-property: none;  
                transition-timing-function: ease;  
                user-select: none;  
                width: 34.2167px;  
                align-items: center;  
                justify-content: center;  
            }  
              
            .settings-folder-param__icon svg {  
                width: 24px;  
                height: 24px;  
                stroke: currentColor;  
                fill: none;  
            }  
              
            .settings-folder-param__name {  
                font-size: 1.4em;  
                line-height: 1.3;  
            }  
              
            .settings-folder-param.focus {  
                background-color: #353535;  
            }  
        `;  
        document.head.appendChild(style);  
    }  
  
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
  
    // Функція ініціалізації плагіна  
    function startPlugin() {  
        // Додаємо стилі перед завантаженням модулів  
        addFolderParamStyles();  
  
        // Асинхронне підключення модулів  
        modules.forEach(function (url) {  
            Lampa.Utils.putScriptAsync([url], function () {}, function () {});  
        });  
  
        // Додаємо новий розділ у Налаштуваннях  
        Lampa.SettingsApi.addComponent({  
            component: 'interface_customization',  
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14" fill="none"><g fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H1a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2m-7 9l-1 2.5M8 11l1 2.5m-5 0h6M7.5 2v9M3 5h2M3 8h1"/><path d="m7.5 7l1.21-1a2 2 0 0 1 2.55 0l2.24 2"/></g></svg>',  
            name: Lampa.Lang.translate('custom_interface_plugin')  
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
