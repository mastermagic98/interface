(function () {
    'use strict';

    Lampa.Lang.add({
        params_ani_on: {
            ru: 'Включить',
            en: 'Enable',
            uk: 'Увімкнути'
        },
        params_ani_select: {
            ru: 'Выбор анимации',
            en: 'Select loading animation',
            uk: 'Вибір анімації завантаження'
        },
        params_ani_name: {
            ru: 'Анимация Загрузки',
            en: 'Loading animation',
            uk: 'Анімація завантаження'
        }
    });

    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_grid">{ani_svg_content}</div></div>');

    function setCustomLoader(url) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var filterValue = 'brightness(0) invert(1) !important';
        var newStyle = '.activity__loader { display: none !important; }' +
                       '.activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: rgba(0, 0, 0, 0) !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position-x: 50%; background-position-y: 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; filter: ' + filterValue + '; z-index: 9999 !important; }';
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            if (Lampa.Storage.get('ani_active')) {
                element.classList.add('active');
                element.style.display = 'block';
            }
        }
    }

    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        var newStyle = '.activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; filter: brightness(0) invert(1); }';
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
    }

    function remove_activity_loader() {
        var styleElement = document.getElementById('aniload-id');
        if (styleElement) styleElement.remove();
        var prvStyleElement = document.getElementById('aniload-id-prv');
        if (prvStyleElement) prvStyleElement.remove();
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
        }
    }

    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';
        style.textContent = '.ani_row { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 48px; gap: 10px; justify-items: center; width: 100%; padding: 10px; }' +
                            '.ani_svg { display: flex; align-items: center; justify-content: center; width: 100%; height: 48px; }' +
                            '.ani_svg img { max-width: 40px; max-height: 40px; object-fit: contain; filter: brightness(0) invert(1); }' +
                            '.ani_svg.focus { background-color: #353535; border: 1px solid #9e9e9e; }';
        document.head.appendChild(style);
    }

    function createSvgHtml(src) {
        return '<div class="ani_svg selector" tabindex="0"><img src="' + src + '" style="visibility:visible; max-width:40px; max-height:40px;"></div>';
    }

    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    function aniLoad() {
        var icon_plugin = '<svg fill="hsl(228, 97%, 42%)" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,23a9.63,9.63,0,0,1-8-9.5,9.51,9.51,0,0,1,6.79-9.1A1.66,1.66,0,0,0,12,2.81h0a1.67,1.67,0,0,0-1.94-1.64A11,11,0,0,0,12,23Z"></path></svg>';

        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon_plugin
            });
        } catch (e) {}

        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: {
                    name: 'ani_active',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('params_ani_on')
                },
                onChange: function (item) {
                    if (item === 'true') {
                        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                        }
                    } else {
                        remove_activity_loader();
                    }
                    Lampa.Settings.render();
                }
            });
        } catch (e) {}

        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: {
                    name: 'select_ani_mation',
                    type: 'button'
                },
                field: {
                    name: '<div class="settings-folder__icon" style="display: inline-block; vertical-align: middle; width: 23px; height: 24px; margin-right: 10px;"><div class="activity__loader_prv"></div><svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity=".25"/><path d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z"></path></svg></div>' + Lampa.Lang.translate('params_ani_select')
                },
                onRender: function (item) {
                    if (!Lampa.Storage.get('ani_active')) {
                        item.css('display', 'none');
                    } else {
                        item.css('display', 'block');
                        setTimeout(function () {
                            insert_activity_loader_prv(Lampa.Storage.get('ani_load', window.svg_loaders && window.svg_loaders.length > 0 ? window.svg_loaders[0] : ''));
                        }, 0);
                    }
                },
                onChange: function () {
                    if (!window.svg_loaders || window.svg_loaders.length === 0) return;
                    if (!Lampa.Template.get('ani_modal')) {
                        Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_grid">{ani_svg_content}</div></div>');
                    }
                    create_ani_modal();
                    var groupedSvgLinks = chunkArray(window.svg_loaders, 6);
                    var svg_content = groupedSvgLinks.map(function (group) {
                        var groupContent = group.map(createSvgHtml).join('');
                        return '<div class="ani_row">' + groupContent + '</div>';
                    }).join('');
                    var ani_templates = Lampa.Template.get('ani_modal', {
                        ani_svg_content: svg_content
                    });
                    try {
                        Lampa.Modal.open({
                            title: '',
                            size: 'medium',
                            align: 'left',
                            html: $(ani_templates),
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                            },
                            onSelect: function (a) {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var imgElement = a[0].querySelector('img');
                                    if (imgElement) {
                                        var srcValue = imgElement.getAttribute('src');
                                        Lampa.Storage.set('ani_load', srcValue);
                                        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                                            setCustomLoader(Lampa.Storage.get('ani_load'));
                                            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                                            setTimeout(function () {
                                                var element = document.querySelector('.activity__loader');
                                                if (element) {
                                                    element.classList.add('active');
                                                    element.style.display = 'block';
                                                    setTimeout(function () {
                                                        element.classList.remove('active');
                                                        element.style.display = 'none';
                                                    }, 500);
                                                }
                                            }, 0);
                                        }
                                    }
                                }
                            }
                        });
                    } catch (e) {}
                }
            });
        } catch (e) {}

        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'ani_active') {
                var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                if (selectItem.length) {
                    selectItem.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
                    if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load')) {
                        insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                    }
                }
                Lampa.Settings.render();
            }
        });

        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1 && node.matches('.activity__loader')) {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                            }
                        }
                    });
                    mutation.removedNodes.forEach(function (node) {
                        if (node.nodeType === 1 && node.matches('.activity__loader')) {
                            remove_activity_loader();
                        }
                    });
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }, 1000);

        Lampa.Listener.follow('full', function (e) {
            var element = document.querySelector('.activity__loader');
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (e.type === 'complete' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        Lampa.Listener.follow('activity', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.type === 'loaded' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        Lampa.Activity.listener.follow('push', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
            } else if (event.status === 'ready' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        });

        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'back') {
                var element = document.querySelector('.activity__loader');
                if (element) {
                    element.classList.remove('active');
                    element.style.display = 'none';
                }
            }
        });

        setInterval(function () {
            var element = document.querySelector('.activity__loader');
            if (element && element.classList.contains('active')) {
                element.classList.remove('active');
                element.style.display = 'none';
            }
        }, 500);

        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    if (window.appready) {
        aniLoad();
        byTheme();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                aniLoad();
                byTheme();
            }
        });
    }

    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'accent_color_selected') {
            byTheme();
        }
    });

    window.byTheme = byTheme;
})();
