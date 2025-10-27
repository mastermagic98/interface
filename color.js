(function () {
    'use strict';

    // Додаємо переклади
    Lampa.Lang.add({
        color_plugin: {ru: 'Настройка цветов', en: 'Color settings', uk: 'Налаштування кольорів'},
        color_plugin_enabled: {ru: 'Включить плагин', en: 'Enable plugin', uk: 'Увімкнути плагін'},
        color_plugin_enabled_description: {ru: 'Изменяет вид некоторых элементов интерфейса Lampa', en: 'Changes the appearance of some Lampa interface elements', uk: 'Змінює вигляд деяких елементів інтерфейсу Lampa'},
        main_color: {ru: 'Цвет выделения', en: 'Highlight color', uk: 'Колір виділення'},
        main_color_description: {ru: 'Выберите или укажите цвет', en: 'Select or specify a color', uk: 'Виберіть чи вкажіть колір'},
        enable_highlight: {ru: 'Показать рамку', en: 'Show border', uk: 'Показати рамку'},
        enable_highlight_description: {ru: 'Включает белую рамку вокруг некоторых выделенных элементов интерфейса', en: 'Enables a white border around some highlighted interface elements', uk: 'Вмикає білу рамку навколо деяких виділених елементів інтерфейсу'},
        enable_dimming: {ru: 'Применить цвет затемнения', en: 'Apply dimming color', uk: 'Застосувати колір затемнення'},
        enable_dimming_description: {ru: 'Изменяет цвет затемненных элементов интерфейса на темный оттенок выбранного цвета выделения', en: 'Changes the color of dimmed interface elements to a dark shade of the selected highlight color', uk: 'Змінює колір затемнених елементів інтерфейсу на темний відтінок вибраного кольору виділення'},
        default_color: {ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням'},
        custom_hex_input: {ru: 'Введи HEX-код цвета', en: 'Enter HEX color code', uk: 'Введи HEX-код кольору'},
        hex_input_hint: {ru: 'Используйте формат #FFFFFF, например #123524', en: 'Use the format #FFFFFF, for example #123524', uk: 'Використовуйте формат #FFFFFF, наприклад #123524'},
        red: { ru: 'Красный', en: 'Red', uk: 'Червоний' },
        orange: { ru: 'Оранжевый', en: 'Orange', uk: 'Помаранчевий' },
        amber: { ru: 'Янтарный', en: 'Amber', uk: 'Бурштиновий' },
        yellow: { ru: 'Желтый', en: 'Yellow', uk: 'Жовтий' },
        lime: { ru: 'Лаймовый', en: 'Lime', uk: 'Лаймовий' },
        green: { ru: 'Зеленый', en: 'Green', uk: 'Зелений' },
        emerald: { ru: 'Изумрудный', en: 'Emerald', uk: 'Смарагдовий' },
        teal: { ru: 'Бирюзовый', en: 'Teal', uk: 'Бірюзовий' },
        cyan: { ru: 'Голубой', en: 'Cyan', uk: 'Блакитний' },
        sky: { ru: 'Небесный', en: 'Sky', uk: 'Небесний' },
        blue: { ru: 'Синий', en: 'Blue', uk: 'Синій' },
        indigo: { ru: 'Индиго', en: 'Indigo', uk: 'Індиго' },
        violet: { ru: 'Фиолетовый', en: 'Violet', uk: 'Фіолетовий' },
        purple: { ru: 'Пурпурный', en: 'Purple', uk: 'Пурпуровий' },
        fuchsia: { ru: 'Фуксия', en: 'Fuchsia', uk: 'Фуксія' },
        pink: { ru: 'Розовый', en: 'Pink', uk: 'Рожевий' },
        rose: { ru: 'Розовый', en: 'Rose', uk: 'Трояндовий' },
        slate: { ru: 'Сланцевый', en: 'Slate', uk: 'Сланцевий' },
        gray: { ru: 'Серый', en: 'Gray', uk: 'Сірий' },
        zinc: { ru: 'Цинковый', en: 'Zinc', uk: 'Цинковий' },
        neutral: { ru: 'Нейтральный', en: 'Neutral', uk: 'Нейтральний' },
        stone: { ru: 'Каменный', en: 'Stone', uk: 'Кам’яний' }
    });

    var ColorPlugin = {
        settings: {
            main_color: '#353535',
            enabled: true,
            highlight_enabled: true,
            dimming_enabled: true
        },
        colors: {
            main: {
                'default': Lampa.Lang.translate('default_color'),
                '#fb2c36': 'Red 1', '#e7000b': 'Red 2', '#c10007': 'Red 3', '#9f0712': 'Red 4', '#82181a': 'Red 5', '#460809': 'Red 6',
                '#ff6900': 'Orange 1', '#f54900': 'Orange 2', '#ca3500': 'Orange 3', '#9f2d00': 'Orange 4', '#7e2a0c': 'Orange 5', '#441306': 'Orange 6',
                '#fe9a00': 'Amber 1', '#e17100': 'Amber 2', '#bb4d00': 'Amber 3', '#973c00': 'Amber 4', '#7b3306': 'Amber 5', '#461901': 'Amber 6',
                '#f0b100': 'Yellow 1', '#d08700': 'Yellow 2', '#a65f00': 'Yellow 3', '#894b00': 'Yellow 4', '#733e0a': 'Yellow 5', '#432004': 'Yellow 6',
                '#7ccf00': 'Lime 1', '#5ea500': 'Lime 2', '#497d00': 'Lime 3', '#3c6300': 'Lime 4', '#35530e': 'Lime 5', '#192e03': 'Lime 6',
                '#00c950': 'Green 1', '#00a63e': 'Green 2', '#008236': 'Green 3', '#016630': 'Green 4', '#0d542b': 'Green 5', '#032e15': 'Green 6',
                '#00bc7d': 'Emerald 1', '#009966': 'Emerald 2', '#007a55': 'Emerald 3', '#006045': 'Emerald 4', '#004f3b': 'Emerald 5', '#002c22': 'Emerald 6',
                '#00bba7': 'Teal 1', '#009689': 'Teal 2', '#00786f': 'Teal 3', '#005f5a': 'Teal 4', '#0b4f4a': 'Teal 5', '#022f2e': 'Teal 6',
                '#00b8db': 'Cyan 1', '#0092b8': 'Cyan 2', '#007595': 'Cyan 3', '#005f78': 'Cyan 4', '#104e64': 'Cyan 5', '#053345': 'Cyan 6',
                '#00a6f4': 'Sky 1', '#0084d1': 'Sky 2', '#0069a8': 'Sky 3', '#00598a': 'Sky 4', '#024a70': 'Sky 5', '#052f4a': 'Sky 6',
                '#2b7fff': 'Blue 1', '#155dfc': 'Blue 2', '#1447e6': 'Blue 3', '#193cb8': 'Blue 4', '#1c398e': 'Blue 5', '#162456': 'Blue 6',
                '#615fff': 'Indigo 1', '#4f39f6': 'Indigo 2', '#432dd7': 'Indigo 3', '#372aac': 'Indigo 4', '#312c85': 'Indigo 5', '#1e1a4d': 'Indigo 6',
                '#8e51ff': 'Violet 1', '#7f22fe': 'Violet 2', '#7008e7': 'Violet 3', '#5d0ec0': 'Violet 4', '#4d179a': 'Violet 5', '#2f0d68': 'Violet 6',
                '#ad46ff': 'Purple 1', '#9810fa': 'Purple 2', '#8200db': 'Purple 3', '#6e11b0': 'Purple 4', '#59168b': 'Purple 5', '#3c0366': 'Purple 6',
                '#e12afb': 'Fuchsia 1', '#c800de': 'Fuchsia 2', '#a800b7': 'Fuchsia 3', '#8a0194': 'Fuchsia 4', '#721378': 'Fuchsia 5', '#4b004f': 'Fuchsia 6',
                '#f6339a': 'Pink 1', '#e60076': 'Pink 2', '#c6005c': 'Pink 3', '#a3004c': 'Pink 4', '#861043': 'Pink 5', '#510424': 'Pink 6',
                '#ff2056': 'Rose 1', '#ec003f': 'Rose 2', '#c70036': 'Rose 3', '#a50036': 'Rose 4', '#8b0836': 'Rose 5', '#4d0218': 'Rose 6',
                '#62748e': 'Slate 1', '#45556c': 'Slate 2', '#314158': 'Slate 3', '#1d293d': 'Slate 4', '#0f172b': 'Slate 5', '#020618': 'Slate 6',
                '#6a7282': 'Gray 1', '#4a5565': 'Gray 2', '#364153': 'Gray 3', '#1e2939': 'Gray 4', '#101828': 'Gray 5', '#030712': 'Gray 6',
                '#71717b': 'Zinc 1', '#52525c': 'Zinc 2', '#3f3f46': 'Zinc 3', '#27272a': 'Zinc 4', '#18181b': 'Zinc 5', '#09090b': 'Zinc 6',
                '#737373': 'Neutral 1', '#525252': 'Neutral 2', '#404040': 'Neutral 3', '#262626': 'Neutral 4', '#171717': 'Neutral 5', '#0a0a0a': 'Neutral 6',
                '#79716b': 'Stone 1', '#57534d': 'Stone 2', '#44403b': 'Stone 3', '#292524': 'Stone 4', '#1c1917': 'Stone 5', '#0c0a09': 'Stone 6'
            }
        }
    };

    var isSaving = false;

    function hexToRgb(hex) {
        var h = hex.replace('#', '');
        return parseInt(h.substring(0,2),16) + ', ' + parseInt(h.substring(2,4),16) + ', ' + parseInt(h.substring(4,6),16);
    }

    function rgbToHex(rgb) {
        var matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!matches) return rgb;
        function hex(n) { return ('0' + parseInt(n).toString(16)).slice(-2); }
        return '#' + hex(matches[1]) + hex(matches[2]) + hex(matches[3]);
    }

    function isValidHex(c) { return /^#[0-9A-Fa-f]{6}$/.test(c); }

    function updateDateElementStyles() {
        var els = document.querySelectorAll('div[style*="position: absolute; left: 1em; top: 1em;"]');
        for (var i = 0; i < els.length; i++) {
            if (els[i].querySelector('div[style*="font-size: 2.6em"]')) {
                els[i].style.background = 'var(--main-color)';
            }
        }
    }

    function saveSettings() {
        if (isSaving) return;
        isSaving = true;
        Lampa.Storage.set('color_plugin_main_color', ColorPlugin.settings.main_color);
        Lampa.Storage.set('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
        Lampa.Storage.set('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
        Lampa.Storage.set('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
        localStorage.setItem('color_plugin_main_color', ColorPlugin.settings.main_color);
        localStorage.setItem('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
        localStorage.setItem('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
        localStorage.setItem('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
        isSaving = false;
    }

    function applyStyles() {
        var style = document.getElementById('color-plugin-styles');
        if (!ColorPlugin.settings.enabled) {
            if (style) style.remove();
            return;
        }
        if (!isValidHex(ColorPlugin.settings.main_color)) ColorPlugin.settings.main_color = '#353535';

        if (!style) {
            style = document.createElement('style');
            style.id = 'color-plugin-styles';
            document.head.appendChild(style);
        }

        var rgb = hexToRgb(ColorPlugin.settings.main_color);
        var focusBorder = ColorPlugin.settings.main_color === '#353535' ? '#ffffff' : 'var(--main-color)';
        var highlight = ColorPlugin.settings.highlight_enabled ? '-webkit-box-shadow: inset 0 0 0 0.15em #fff !important;box-shadow: inset 0 0 0 0.15em #fff !important;' : '';
        var dim = ColorPlugin.settings.dimming_enabled ? '.full-start__rate{background: rgba(var(--main-color-rgb), 0.15) !important;}.full-start__rate > div:first-child{background: rgba(var(--main-color-rgb), 0.15) !important;}.reaction{background-color: rgba(var(--main-color-rgb), 0.3) !important;}.full-start__button{background-color: rgba(var(--main-color-rgb), 0.3) !important;}.card__vote{background: rgba(var(--main-color-rgb), 0.5) !important;}.items-line__more{background: rgba(var(--main-color-rgb), 0.3) !important;}.card__icons-inner{background: rgba(var(--main-color-rgb), 0.5) !important;}' : '';

        style.innerHTML = [
            ':root{--main-color:'+ColorPlugin.settings.main_color+' !important;--main-color-rgb:'+rgb+' !important;--accent-color:'+ColorPlugin.settings.main_color+' !important;}',
            '.modal__title{font-size:1.7em !important;}.modal__head{margin-bottom:0 !important;}.modal .scroll__content{padding:1.0em 0 !important;}',
            '.menu__ico,.menu__ico:hover,.menu__ico.traverse,.head__action,.head__action.focus,.head__action:hover,.settings-param__ico{color:#fff !important;fill:#fff !important;}',
            '.menu__ico.focus{color:#fff !important;fill:#fff !important;stroke:none !important;}',
            '.menu__item.focus .menu__ico path[fill],.menu__item.traverse .menu__ico path[fill],.menu__item:hover .menu__ico path[fill]{fill:#fff !important;}',
            '.menu__item.focus .menu__ico [stroke],.menu__item.traverse .menu__ico [stroke],.menu__item:hover .menu__ico [stroke]{stroke:#fff !important;}',
            '.menu__item,.menu__item.focus,.menu__item.traverse,.menu__item:hover,.console__tab,.console__tab.focus,.settings-param,.settings-param.focus,.selectbox-item,.selectbox-item.focus,.selectbox-item:hover,.full-person,.full-person.focus,.full-start__button,.full-start__button.focus,.full-descr__tag,.full-descr__tag.focus,.simple-button,.simple-button.focus,.player-panel .button,.player-panel .button.focus,.search-source,.search-source.active,.radio-item,.radio-item.focus,.lang__selector-item,.lang__selector-item.focus,.modal__button,.modal__button.focus,.search-history-key,.search-history-key.focus,.simple-keyboard-mic,.simple-keyboard-mic.focus,.full-review-add,.full-review-add.focus,.full-review,.full-review.focus,.tag-count,.tag-count.focus,.settings-folder,.settings-folder.focus,.noty,.radio-player,.radio-player.focus{color:#fff !important;}',
            '.console__tab{background-color:var(--main-color) !important;}',
            '.console__tab.focus{background:var(--main-color) !important;color:#fff !important;'+highlight+'}',
            '.menu__item.focus,.menu__item.traverse,.menu__item:hover,.full-person.focus,.full-start__button.focus,.full-descr__tag.focus,.simple-button.focus,.head__action.focus,.head__action:hover,.player-panel .button.focus,.search-source.active{background:var(--main-color) !important;}',
            '.player-panel .button.focus{background-color:var(--main-color) !important;color:#fff !important;}',
            '.full-start__button.focus,.settings-param.focus,.items-line__more.focus,.menu__item.focus,.settings-folder.focus,.head__action.focus,.selectbox-item.focus,.simple-button.focus,.navigation-tabs__button.focus{'+highlight+'}',
            '.timetable__item.focus::before{background-color:var(--main-color) !important;'+highlight+'}',
            '.navigation-tabs__button.focus{background-color:var(--main-color) !important;color:#fff !important;'+highlight+'}',
            '.items-line__more.focus{color:#fff !important;background-color:var(--main-color) !important;}',
            '.timetable__item.focus{color:#fff !important;}',
            '.broadcast__device.focus{background-color:var(--main-color) !important;color:#fff !important;}',
            '.iptv-menu__list-item.focus,.iptv-program__timeline>div{background-color:var(--main-color) !important;}',
            '.radio-item.focus,.lang__selector-item.focus,.simple-keyboard .hg-button.focus,.modal__button.focus,.search-history-key.focus,.simple-keyboard-mic.focus,.full-review-add.focus,.full-review.focus,.tag-count.focus,.settings-folder.focus,.settings-param.focus,.selectbox-item.focus,.selectbox-item:hover{background:var(--main-color) !important;}',
            '.online.focus{box-shadow:0 0 0 .2em var(--main-color) !important;}',
            '.online_modss.focus::after,.online-prestige.focus::after,.radio-item.focus .radio-item__imgbox:after,.iptv-channel.focus::before,.iptv-channel.last--focus::before{border-color:var(--main-color) !important;}',
            '.card-more.focus .card-more__box::after{border:.3em solid var(--main-color) !important;}',
            '.iptv-playlist-item.focus::after,.iptv-playlist-item:hover::after{border-color:var(--main-color) !important;}',
            '.ad-bot.focus .ad-bot__content::after,.ad-bot:hover .ad-bot__content::after,.card-episode.focus .full-episode::after,.register.focus::after,.season-episode.focus::after,.full-episode.focus::after,.full-review-add.focus::after,.card.focus .card__view::after,.card:hover .card__view::after,.extensions__item.focus:after,.torrent-item.focus::after,.extensions__block-add.focus:after{border-color:var(--main-color) !important;}',
            '.broadcast__scan > div{background-color:var(--main-color) !important;}',
            '.card:hover .card__view,.card.focus .card__view{border-color:var(--main-color) !important;}',
            '.noty{background:var(--main-color) !important;}',
            '.radio-player.focus{background-color:var(--main-color) !important;}',
            '.explorer-card__head-img.focus::after{border:.3em solid var(--main-color) !important;}',
            '.color_square.focus{border:.3em solid '+focusBorder+' !important;transform:scale(1.1) !important;}',
            '.hex-input.focus{border:.2em solid '+focusBorder+' !important;transform:scale(1.1) !important;}',
            dim,
            '.timetable__item--any::before{background-color:rgba(var(--main-color-rgb),.3) !important;}',
            '.element{background:none !important;width:253px !important;}',
            '.bookmarks-folder__layer{background-color:var(--main-color) !important;}',
            '.color_square.default{background-color:#fff !important;width:35px !important;height:35px !important;border-radius:4px !important;position:relative !important;}',
            '.color_square.default::after,.color_square.default::before{content:"" !important;position:absolute !important;top:50% !important;left:10% !important;right:10% !important;height:3px !important;background-color:#353535 !important;}',
            '.color_square.default::after{transform:rotate(45deg) !important;}',
            '.color_square.default::before{transform:rotate(-45deg) !important;}',
            '.color_square{width:35px !important;height:35px !important;border-radius:4px !important;display:flex !important;flex-direction:column !important;justify-content:center !important;align-items:center !important;cursor:pointer !important;color:#fff !important;font-size:10px !important;text-align:center !important;}',
            '.color-family-outline{display:flex !important;flex-direction:row !important;overflow:hidden !important;gap:10px !important;border-radius:8px !important;margin-bottom:1px !important;padding:5px !important;}',
            '.color-family-name{width:80px !important;height:35px !important;border-width:2px !important;border-style:solid !important;border-radius:4px !important;display:flex !important;flex-direction:column !important;justify-content:center !important;align-items:center !important;cursor:default !important;color:#fff !important;font-size:10px !important;font-weight:bold !important;text-align:center !important;text-transform:capitalize !important;}',
            '.color_square .hex{font-size:9px !important;opacity:.9 !important;text-transform:uppercase !important;z-index:1 !important;}',
            '.hex-input{width:266px !important;height:35px !important;border-radius:8px !important;border:2px solid #ddd !important;position:relative !important;cursor:pointer !important;display:flex !important;flex-direction:column !important;align-items:center !important;justify-content:center !important;color:#fff !important;font-size:12px !important;font-weight:bold !important;text-shadow:0 0 2px #000 !important;background-color:#353535 !important;}',
            '.hex-input.focus{border:.2em solid '+focusBorder+' !important;transform:scale(1.1) !important;}',
            '.color-picker-container{display:grid !important;grid-template-columns:1fr 1fr !important;gap:10px !important;padding:0 !important;}',
            '.color-picker-container > div:nth-child(2){display:flex !important;flex-direction:column !important;justify-content:flex-end !important;}',
            '@media (max-width:768px){.color-picker-container{grid-template-columns:1fr !important;}.color-picker-container > div:nth-child(2){justify-content:flex-start !important;}}'
        ].join('');

        updateDateElementStyles();
    }

    function updateParamsVisibility(body) {
        var disp = ColorPlugin.settings.enabled ? 'block' : 'none';
        var names = ['color_plugin_main_color', 'color_plugin_highlight_enabled', 'color_plugin_dimming_enabled'];
        names.forEach(function(name) {
            var els = (body || document).querySelectorAll('.settings-param[data-name="' + name + '"]');
            for (var i = 0; i < els.length; i++) {
                els[i].style.display = disp;
            }
        });
        if (Lampa.Settings && Lampa.Settings.render) {
            setTimeout(Lampa.Settings.render, 0);
        }
    }

    function openColorPicker() {
        var modalHtml = '<div class="color-picker-container"><div></div><div></div></div>';
        Lampa.Modal.open({
            title: Lampa.Lang.translate('main_color'),
            html: $(modalHtml),
            size: 'large',
            onBack: function() {
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
            },
            onSelect: function(el) {
                if (!el || !el[0]) return;
                var selected = el[0];
                var hex = '';

                if (selected.classList.contains('default')) {
                    hex = '#353535';
                    Lampa.Storage.set('color_plugin_main_color', '');
                } else if (selected.classList.contains('hex-input')) {
                    Lampa.Noty.show(Lampa.Lang.translate('hex_input_hint'));
                    Lampa.Modal.close();
                    Lampa.Input.edit({
                        name: 'color_plugin_main_color',
                        value: ColorPlugin.settings.main_color,
                        placeholder: '#FFFFFF'
                    }, function(v) {
                        if (v && isValidHex(v)) {
                            ColorPlugin.settings.main_color = v;
                            Lampa.Storage.set('color_plugin_main_color', v);
                            applyStyles();
                        } else if (v === '') {
                            ColorPlugin.settings.main_color = '#353535';
                            Lampa.Storage.set('color_plugin_main_color', '');
                            applyStyles();
                        }
                        Lampa.Controller.toggle('settings_component');
                    });
                    return;
                } else {
                    hex = selected.getAttribute('data-hex');
                    if (hex && isValidHex(hex)) {
                        ColorPlugin.settings.main_color = hex;
                        Lampa.Storage.set('color_plugin_main_color', hex);
                    }
                }
                if (hex) applyStyles();
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
            }
        });

        setTimeout(function() {
            var left = $('.color-picker-container > div:first-child');
            var right = $('.color-picker-container > div:last-child');

            // По замовчуванню
            left.append('<div class="color_square default selector" tabindex="0" title="' + Lampa.Lang.translate('default_color') + '"></div>');

            // Палітра
            var colors = ColorPlugin.colors.main;
            var families = {};
            for (var h in colors) {
                if (h === 'default') continue;
                var name = colors[h];
                var fam = name.split(' ')[0].toLowerCase();
                if (!families[fam]) families[fam] = [];
                families[fam].push(h);
            }
            var order = ['red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose','slate','gray','zinc','neutral','stone'];
            order.forEach(function(f) {
                if (!families[f]) return;
                var name = Lampa.Lang.translate(f) || f;
                var row = '<div class="color-family-outline">';
                row += '<div class="color-family-name" style="background:' + families[f][0] + ';">' + name + '</div>';
                families[f].forEach(function(h) {
                    row += '<div class="color_square selector" data-hex="' + h + '" style="background:' + h + ';" tabindex="0"><span class="hex">' + h + '</span></div>';
                });
                row += '</div>';
                left.append(row);
            });

            // HEX
            var current = ColorPlugin.settings.main_color;
            right.append('<div class="hex-input selector" tabindex="0"><div class="label">' + Lampa.Lang.translate('custom_hex_input') + '</div><div class="value">' + current + '</div></div>');
        }, 100);
    }

    function initPlugin() {
        // Завантаження
        ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
        ColorPlugin.settings.enabled = (Lampa.Storage.get('color_plugin_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_enabled') === 'true');
        ColorPlugin.settings.highlight_enabled = (Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_highlight_enabled') === 'true');
        ColorPlugin.settings.dimming_enabled = (Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_dimming_enabled') === 'true');

        Lampa.SettingsApi.addComponent({
            component: 'color_plugin',
            name: Lampa.Lang.translate('color_plugin'),
            icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.30 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.90.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: {name: 'color_plugin_enabled', type: 'trigger', default: ColorPlugin.settings.enabled.toString()},
            field: {name: Lampa.Lang.translate('color_plugin_enabled'), description: Lampa.Lang.translate('color_plugin_enabled_description')},
            onChange: function(v) {
                ColorPlugin.settings.enabled = (v === 'true');
                Lampa.Storage.set('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
                localStorage.setItem('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
                applyStyles();
                updateParamsVisibility();
                saveSettings();
                if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: {name: 'color_plugin_main_color', type: 'button'},
            field: {name: Lampa.Lang.translate('main_color'), description: Lampa.Lang.translate('main_color_description')},
            onRender: function(item) { $(item).css('display', ColorPlugin.settings.enabled ? 'block' : 'none'); },
            onChange: openColorPicker
        });

        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: {name: 'color_plugin_highlight_enabled', type: 'trigger', default: ColorPlugin.settings.highlight_enabled.toString()},
            field: {name: Lampa.Lang.translate('enable_highlight'), description: Lampa.Lang.translate('enable_highlight_description')},
            onRender: function(item) { $(item).css('display', ColorPlugin.settings.enabled ? 'block' : 'none'); },
            onChange: function(v) {
                ColorPlugin.settings.highlight_enabled = (v === 'true');
                Lampa.Storage.set('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
                localStorage.setItem('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
                applyStyles();
                saveSettings();
                if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: {name: 'color_plugin_dimming_enabled', type: 'trigger', default: ColorPlugin.settings.dimming_enabled.toString()},
            field: {name: Lampa.Lang.translate('enable_dimming'), description: Lampa.Lang.translate('enable_dimming_description')},
            onRender: function(item) { $(item).css('display', ColorPlugin.settings.enabled ? 'block' : 'none'); },
            onChange: function(v) {
                ColorPlugin.settings.dimming_enabled = (v === 'true');
                Lampa.Storage.set('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
                localStorage.setItem('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
                applyStyles();
                saveSettings();
                if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
            }
        });

        applyStyles();
        updateParamsVisibility();
    }

    if (window.appready && Lampa.SettingsApi && Lampa.Storage) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') initPlugin();
        });
    }

    // Слухання Storage
    Lampa.Storage.listener.follow('change', function(e) {
        if (e.name.indexOf('color_plugin_') !== 0) return;
        ColorPlugin.settings.enabled = (Lampa.Storage.get('color_plugin_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_enabled') === 'true');
        ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
        ColorPlugin.settings.highlight_enabled = (Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_highlight_enabled') === 'true');
        ColorPlugin.settings.dimming_enabled = (Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_dimming_enabled') === 'true');
        applyStyles();
        updateParamsVisibility();
    });

    // Ключове: при відкритті меню — завжди оновлюємо видимість
    Lampa.Listener.follow('settings_component', function(e) {
        if (e.type === 'open') {
            setTimeout(function() {
                ColorPlugin.settings.enabled = (Lampa.Storage.get('color_plugin_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_enabled') === 'true');
                updateParamsVisibility(e.body);
            }, 150);
        } else if (e.type === 'close') {
            saveSettings();
        }
    });

})();
