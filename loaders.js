(function () {
    'use strict';

    window.svg_loaders = [
        'data:image/svg+xml,' + encodeURIComponent('<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="3" r="1" fill="currentColor"><animate id="spinner_7Z73" begin="0;spinner_tKsu.end-0.5s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="16.50" cy="4.21" r="1" fill="currentColor"><animate id="spinner_Wd87" begin="spinner_7Z73.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="7.50" cy="4.21" r="1" fill="currentColor"><animate id="spinner_tKsu" begin="spinner_9Qlc.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="19.79" cy="7.50" r="1" fill="currentColor"><animate id="spinner_lMMO" begin="spinner_Wd87.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="4.21" cy="7.50" r="1" fill="currentColor"><animate id="spinner_9Qlc" begin="spinner_Khxv.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="21.00" cy="12.00" r="1" fill="currentColor"><animate id="spinner_5L9t" begin="spinner_lMMO.begin+0.1s" attributeName="r" calcMode="spline" dur="0.6s" values="1;2;1" keySplines=".27,.42,.37,.99;.53,0,.61,.73"/></circle><circle cx="3.00" cy="12.00" r=" industry-standard software, which ensures compatibility with Lampa's rendering requirements.

```javascript
(function () {
    'use strict';

    Lampa.Lang.add({
        loader_select: {
            ru: 'Выбор анимации загрузки',
            en: 'Select loading animation',
            uk: 'Вибір анімації завантаження'
        }
    });

    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    function createLoaderHtml(loader, index) {
        return '<div class="loader_square selector" tabindex="0" data-index="' + index + '" style="background-image: url(\'' + loader + '\');"></div>';
    }

    Lampa.Template.add('loader_modal', '<div class="loader_modal_root"><div class="loader_grid">{loader_content}</div></div>');

    function createLoaderModal() {
        var style = document.createElement('style');
        style.id = 'loadermodal';
        style.textContent = '.loader_grid { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 80px; gap: 15px; justify-items: center; width: 100%; padding: 10px; }' +
                            '.loader_square { display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; background-size: contain; background-repeat: no-repeat; background-position: center; cursor: pointer; }' +
                            '.loader_square.focus { border: 2px solid #fff; transform: scale(1.1); }';
        document.head.appendChild(style);
        console.log('Модальне вікно анімацій створено, кількість анімацій: ' + window.svg_loaders.length);
    }

    function initLoaderPicker() {
        console.log('Ініціалізація loader picker');
        try {
            Lampa.SettingsApi.addParam({
                component: 'loader_plugin',
                param: {
                    name: 'select_loader',
                    type: 'button'
                },
                field: {
                    name: Lampa.Lang.translate('loader_select'),
                    description: '<div style="width: 2em; height: 2em; background-image: url(\'' + Lampa.Storage.get('loader_selected', window.svg_loaders[0]) + '\'); background-size: contain; background-repeat: no-repeat; background-position: center; display: inline-block; border: 1px solid #fff;"></div>'
                },
                onRender: function (item) {
                    var loader = Lampa.Storage.get('loader_selected', window.svg_loaders[0]);
                    item.find('.settings-param__descr div').css('background-image', 'url(\'' + loader + '\')');
                    console.log('Рендеринг кнопки вибору анімації, поточна анімація: ' + loader);
                },
                onChange: function () {
                    createLoaderModal();
                    var groupedLoaders = chunkArray(window.svg_loaders, 6);
                    var loader_content = groupedLoaders.map(function (group) {
                        var groupContent = group.map(function (loader, idx) {
                            return createLoaderHtml(loader, window.svg_loaders.indexOf(loader));
                        }).join('');
                        return '<div class="loader_grid">' + groupContent + '</div>';
                    }).join('');
                    var loader_templates = Lampa.Template.get('loader_modal', {
                        loader_content: loader_content
                    });
                    try {
                        Lampa.Modal.open({
                            title: '',
                            size: 'medium',
                            align: 'center',
                            html: loader_templates,
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                            },
                            onSelect: function (a) {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var index = parseInt(a[0].getAttribute('data-index'), 10);
                                    if (index >= 0 && index < window.svg_loaders.length) {
                                        var selectedLoader = window.svg_loaders[index];
                                        Lampa.Storage.set('loader_selected', selectedLoader);
                                        console.log('Вибрано анімацію: ' + selectedLoader);
                                        var settingsItem = Lampa.Settings.content().find('.settings-param[data-name="select_loader"] .settings-param__descr div');
                                        if (settingsItem.length) {
                                            settingsItem.css('background-image', 'url(\'' + selectedLoader + '\')');
                                        }
                                        var event = new Event('loader-change');
                                        document.dispatchEvent(event);
                                    } else {
                                        console.error('Невірний індекс анімації: ' + index);
                                    }
                                } else {
                                    console.error('Невірний елемент вибору:', a);
                                }
                            }
                        });
                        console.log('Модальне вікно анімацій відкрито, відображено ' + window.svg_loaders.length + ' анімацій');
                    } catch (e) {
                        console.error('Помилка відкриття модального вікна анімацій: ' + e.message);
                    }
                }
            });
            console.log('Кнопка вибору анімації додана до loader_plugin');
        } catch (e) {
            console.error('Помилка додавання кнопки вибору анімації: ' + e.message);
        }

        var savedLoader = Lampa.Storage.get('loader_selected', window.svg_loaders[0]);
        console.log('Застосовано збережену анімацію: ' + savedLoader);
    }

    function delayedInit() {
        if (window.appready) {
            console.log('Lampa готова, ініціалізація loader picker');
            initLoaderPicker();
        } else {
            var attempts = 0;
            var maxAttempts = 10;
            var interval = setInterval(function () {
                attempts++;
                if (window.appready || attempts >= maxAttempts) {
                    clearInterval(interval);
                    if (window.appready) {
                        console.log('Lampa готова після затримки, ініціалізація loader picker');
                        initLoaderPicker();
                    } else {
                        console.error('Lampa не готова після ' + maxAttempts + ' спроб');
                    }
                }
            }, 500);
        }
    }

    if (window.appready) {
        console.log('Lampa готова, виклик delayedInit');
        delayedInit();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                console.log('Lampa готова, виклик delayedInit');
                delayedInit();
            }
        });
    }

    Lampa.Listener.follow('settings_component', function (event) {
        if (event.type === 'open') {
            console.log('Меню налаштувань відкрито');
            var savedLoader = Lampa.Storage.get('loader_selected', window.svg_loaders[0]);
            var settingsItem = Lampa.Settings.content().find('.settings-param[data-name="select_loader"] .settings-param__descr div');
            if (settingsItem.length) {
                settingsItem.css('background-image', 'url(\'' + savedLoader + '\')');
            }
        }
    });
})();
