// Плагін KUV studios для Lampa.
// Plugin KUV studios for Lampa.

// Додає кнопку студії/телеканалу (джерело — TMDb) до картки.
// Adds a studio/network button (source — TMDb) to the card.
// Додає оригінальну назву другою рядком до картки.
// Adds the original title as a second line to the card.
// Додає логотип фільму/серіалу (джерело — TMDb) до картки в портретному режимі.
// Adds the movie/series logo (source — TMDb) to the card in portrait mode.
// Підходить як для окремого використання, так і в комплексі з kuv-style.
// Suitable for standalone use or in combination with kuv-style.

// Частково базується на плагіні tmdb-networks v2.0.3 від levende[](https://t.me/levende)
// Partially based on the tmdb-networks v2.0.3 plugin by levende[](https://t.me/levende)
// https://levende.github.io/lampa-plugins/tmdb-networks.js

(function () {
    'use strict';

    // Додавання перекладів для пунктів меню (трьома мовами)
    // Adding translations for menu items (in three languages)
    Lampa.Lang.add({
        network_popular: {
            ru: 'Популярные',
            en: 'Popular',
            uk: 'Популярні'
        },
        network_new: {
            ru: 'Новые',
            en: 'New',
            uk: 'Нові'
        }
    });

    // Об'єкт для виконання запитів
    // Request object
    var network = new Lampa.Reguest();

    // Кеш для даних (з TTL 1 година)
    // Cache for data (with TTL 1 hour)
    var cache = {
        data: new Map(),
        ttl: 3600000, // 1 година в мілісекундах / 1 hour in milliseconds
        set: function(key, value) {
            this.data.set(key, {
                value: value,
                timestamp: Date.now()
            });
        },
        get: function(key) {
            var item = this.data.get(key);
            if (item && Date.now() - item.timestamp < this.ttl) {
                return item.value;
            }
            this.data.delete(key);
            return null;
        }
    };

    // Функція для перевірки типу інтерфейсу (новий чи старий)
    // Function to check interface type (new or old)
    function isNewInterface(render) {
        return $('.full-start-new', render).length > 0;
    }

    // Отримання постачальників контенту для фільму
    // Get content providers for a movie
    function getMovieProviders(movie, callback) {
        var cacheKey = 'providers_' + movie.id;
        var cachedData = cache.get(cacheKey);
        if (cachedData) {
            return callback(cachedData);
        }

        var url = Lampa.TMDB.api('movie/' + movie.id + '/watch/providers');
        network.silent(url, 
            function(data) {
                var providers = [];
                var allowedCountryCodes = ['US', 'RU'];

                allowedCountryCodes.forEach(function(countryCode) {
                    var countryData = data.results && data.results[countryCode];
                    if (countryData) {
                        if (countryData.flatrate) providers = providers.concat(countryData.flatrate);
                        if (countryData.rent) providers = providers.concat(countryData.rent);
                        if (countryData.buy) providers = providers.concat(countryData.buy);
                    }
                });

                var filteredProviders = providers.filter(function(p) {
                    return p.logo_path;
                });
                cache.set(cacheKey, filteredProviders);
                callback(filteredProviders);
            },
            function() {
                callback([]);
            }
        );
    }

    // Отримання мереж/студій для об'єкта
    // Get networks/studios for the object
    function getNetworks(object, callback) {
        if (!object || !object.card || object.card.source !== 'tmdb') {
            return callback([]);
        }

        if (object.card.networks && object.card.networks.length) {
            return callback(object.card.networks);
        }
        if (object.card.production_companies && object.card.production_companies.length) {
            return callback(object.card.production_companies);
        }

        getMovieProviders(object.card, callback);
    }

    // Показ меню при натисканні на кнопку студії/мережі
    // Show menu when pressing the studio/network button
    function showNetworkMenu(network, type, element) {
        var isTv = type === 'tv';
        var controller = Lampa.Controller.enabled().name;
        var dateField = isTv ? 'first_air_date' : 'primary_release_date';
        var currentDate = new Date().toISOString().split('T')[0];

        var menuItems = [
            { 
                title: Lampa.Lang.translate('network_popular'), // Популярні / Popular / Популярные
                sort: '', 
                filter: { 'vote_count.gte': 10 } 
            },
            { 
                title: Lampa.Lang.translate('network_new'), // Нові / New / Новые
                sort: dateField + '.desc', 
                filter: { 
                    'vote_count.gte': 10
                } 
            }
        ];
        // Додаємо дату динамічно для уникнення проблем з ES5
        // Add date dynamically to avoid ES5 issues
        menuItems[1].filter[dateField + '.lte'] = currentDate;

        Lampa.Select.show({
            title: network.name || 'Network',
            items: menuItems,
            onBack: function() {
                Lampa.Controller.toggle(controller);
            },
            onSelect: function(action) {
                var filter = { 'vote_count.gte': action.filter['vote_count.gte'] };
                filter[isTv ? 'with_networks' : 'with_companies'] = network.id;
                if (action.filter[dateField + '.lte']) {
                    filter[dateField + '.lte'] = action.filter[dateField + '.lte'];
                }

                Lampa.Activity.push({
                    url: 'discover/' + type,
                    title: (network.name || 'Network') + ' ' + action.title,
                    component: 'category_full',
                    source: 'tmdb',
                    card_type: true,
                    page: 1,
                    sort_by: action.sort,
                    filter: filter
                });
            }
        });

        // Фокус на кнопку після закриття меню (виправлення для нових версій Lampa v3+)
        // Focus back on the button after menu close (fix for newer Lampa v3+ versions)
        if (element) {
            Lampa.Controller.collectionFocus(element, Lampa.Activity.active().activity.render());
        }
    }

    // Додавання кнопки студії/мережі
    // Add studio/network button
    function addNetworkButton(render, networks, type) {
        $('.button--network, .button--studio', render).remove();

        if (!networks || !networks.length || !networks[0] || !networks[0].logo_path) return;

        var network = networks[0];
        var imgSrc = Lampa.TMDB.image('t/p/w154' + network.logo_path);
        var imgAlt = (network.name || '').replace(/"/g, '"');

        var $networkButton = $('<div>')
            .addClass('full-start__button selector button--network')
            .append(
                $('<div>')
                    .addClass('network-innie')
                    .append(
                        $('<img>')
                            .attr('src', imgSrc)
                            .attr('alt', imgAlt)
                            .on('error', function() {
                                $(this).parent().parent().remove();
                            })
                    )
            );

        $networkButton.on('hover:enter', function() {
            showNetworkMenu(network, type, this);
        });

        // Додаємо кнопку залежно від інтерфейсу
        // Add button depending on the interface
        if (isNewInterface(render)) {
            $('.full-start-new__buttons', render).append($networkButton);
        } else {
            $('.full-start__buttons', render).append($networkButton);
        }
    }

    // Додавання оригінальної назви
    // Add original title
    function addOriginalTitle(render, card) {
        var $titleElement = isNewInterface(render) 
            ? $('.full-start-new__title', render) 
            : $('.full-start__title', render);
            
        if (!$titleElement.length || !card) return;

        var originalTitle = card.original_title || card.original_name;
        var currentTitle = card.title || card.name;

        if (originalTitle && originalTitle !== currentTitle) {
            $titleElement.find('.original-title').remove();
            $('<div>')
                .addClass('original-title')
                .text(originalTitle)
                .appendTo($titleElement);
        }
    }

    // Функція для застосування логотипу до картки
    // Function to apply logo to the card
    function applyLogo(render, $poster, logoPath) {
        var isNew = isNewInterface(render);
        var $titleElement = isNew 
            ? $('.full-start-new__title', render) 
            : $('.full-start__title', render);
        
        // Видаляємо старий логотип, якщо є
        // Remove old logo if exists
        $('.logo-container').remove();
        
        // Обгортаємо текст назви для подальшого приховування
        // Wrap title text to hide it later
        $titleElement.contents().filter(function() {
            return this.nodeType === 3;
        }).wrap('<span class="title-text"></span>');
        
        // Приховуємо тільки обгорнутий текст
        // Hide only wrapped text
        $('.title-text', $titleElement).hide();
        
        $poster.css('position', 'relative');

        var $container = $('<div>')
            .addClass('logo-container')
            .css({
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: '999'
            });

        $('<img>')
            .attr('src', Lampa.TMDB.image('/t/p/w300' + logoPath))
            .css({
                'max-width': '20em',
                'max-height': '10em',
                'object-fit': 'contain',
                'filter': 'drop-shadow(0px 0px 1em rgba(0,0,0,0.8))'
            })
            .appendTo($container);

        $poster.append($container);
    }

    // Функція додавання логотипу з кешуванням
    // Function to add logo with caching
    function addLogo(render, movie) {
        if (!$('body').hasClass('orientation--portrait') || !$('body').hasClass('true--mobile')) return;

        var isNew = isNewInterface(render);
        var $poster = isNew 
            ? $('.full-start-new__poster', render) 
            : $('.full-start__poster', render);
            
        if (!$poster.length) return;

        // Перевіряємо кеш для логотипу
        // Check cache for logo
        var cacheKey = 'logo_' + movie.id;
        var cachedLogo = cache.get(cacheKey);
        
        if (cachedLogo) {
            if (cachedLogo.logo_path) {
                applyLogo(render, $poster, cachedLogo.logo_path);
            }
            return;
        }

        var url = Lampa.TMDB.api((movie.name ? 'tv' : 'movie') + '/' + movie.id + '/images?api_key=' + Lampa.TMDB.key() + '&language=' + Lampa.Storage.get('language'));
        
        $.get(url, function(response) {
            var logoData = { logo_path: null };
            if (response.logos && response.logos[0]) {
                logoData.logo_path = response.logos[0].file_path;
            }
            cache.set(cacheKey, logoData);

            if (logoData.logo_path) {
                applyLogo(render, $poster, logoData.logo_path);
            }
        });
    }

    // Обробник зміни орієнтації екрана
    // Handler for screen orientation change
    function handleOrientation() {
        if ($('body').hasClass('orientation--portrait')) {
            var e = Lampa.Activity.active();
            if (e && e.activity.render()) {
                addLogo(e.activity.render(), e.card);
            }
        } else {
            $('.logo-container').remove();
            $('.title-text').show();
        }
    }

    // Ініціалізація плагіна
    // Plugin initialization
    function initPlugin() {
        // Додавання CSS-стилів (одноразово)
        // Add CSS styles (once)
        if ($('style#network-plugin').length === 0) {
            $('<style>')
                .attr('id', 'network-plugin')
                .html([
                    '.button--network, .button--studio { padding: .3em; }',
                    '.network-innie {',
                    '    background-color: #fff;',
                    '    width: 100%;',
                    '    height: 100%;',
                    '    border-radius: .7em;',
                    '    display: flex;',
                    '    align-items: center;',
                    '    padding: 0 1em;',
                    '}',
                    '.button--network img, .button--studio img {',
                    '    height: 100%;',
                    '    max-height: 1.5em;',
                    '    max-width: 4.5em;',
                    '    object-fit: contain;',
                    '}',
                    '.full-start-new__title, .full-start__title {',
                    '    position: relative;',
                    '    margin-bottom: 0.6em !important;',
                    '}',
                    '.full--tagline {',
                    '    margin-bottom: 0.6em !important;',
                    '}',
                    '.original-title {',
                    '    font-size: 0.8em;',
                    '    color: rgba(255, 255, 255, 0.7);',
                    '    font-weight: normal;',
                    '}'
                ].join('\n'))
                .appendTo('head');
        }

        // Слухач події завершення завантаження повної картки
        // Listener for full card load completion
        Lampa.Listener.follow('full', function(e) {
            if (e.type === 'complite') {
                var render = e.object.activity.render();
                
                addOriginalTitle(render, e.object.card);
                addLogo(render, e.data.movie);
                
                getNetworks(e.object, function(networks) {
                    if (networks.length) {
                        addNetworkButton(render, networks, e.object.method);
                    }
                });
            }
        });

        // Слухач зміни класів body (включає зміну орієнтації)
        // Listener for body class changes (includes orientation change)
        $('body').on('class', function() {
            handleOrientation();
        });
    }

    // Запуск ініціалізації після готовності додатка
    // Run initialization after app is ready
    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                initPlugin();
            }
        });
    }
})();
