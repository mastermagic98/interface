(function () {
    'use strict';

    Lampa.Lang.add({
        animations: {
            ru: "Анимации",
            en: "Animations",
            uk: "Анімації"
        }
    });

    var STYLE_ID = 'animations_plugin_style';
    var animEnabled = false;

    function applyAnimations() {
        // 1. Видаляємо будь-який попередній стиль плагіна
        $('#' + STYLE_ID).remove();

        var $style = $('<style id="' + STYLE_ID + '"></style>');

        if (animEnabled) {
            // === УВІМКНЕНО: додаємо плавні анімації ===
            $style.html(
                '.card{' +
                'transform:scale(1);' +
                'transition:transform .3s ease;' +
                '}' +
                '.card.focus{' +
                'transform:scale(1.03);' +
                '}' +
                '.torrent-item,.online-prestige{' +
                'transform:scale(1);' +
                'transition:transform .3s ease;' +
                '}' +
                '.torrent-item.focus,.online-prestige.focus{' +
                'transform:scale(1.01);' +
                '}' +
                '.extensions__item,.extensions__block-add,.full-review-add,.full-review,.tag-count,.full-person,.full-episode,.simple-button,.full-start__button,.items-cards .selector,.card-more,.explorer-card__head-img.selector,.card-episode{' +
                'transform:scale(1);' +
                'transition:transform .3s ease;' +
                '}' +
                '.extensions__item.focus,.extensions__block-add.focus,.full-review-add.focus,.full-review.focus,.tag-count.focus,.full-person.focus,.full-episode.focus,.simple-button.focus,.full-start__button.focus,.items-cards .selector.focus,.card-more.focus,.explorer-card__head-img.selector.focus,.card-episode.focus{' +
                'transform:scale(1.03);' +
                '}' +
                '.menu__item{' +
                'transition:transform .3s ease;' +
                '}' +
                '.menu__item.focus{' +
                'transform:translateX(-.2em);' +
                '}' +
                '.selectbox-item,.settings-folder,.settings-param{' +
                'transition:transform .3s ease;' +
                '}' +
                '.selectbox-item.focus,.settings-folder.focus,.settings-param.focus{' +
                'transform:translateX(.2em);' +
                '}'
            );
        } else {
            // === ВИМКНЕНО: БЛОКУЄМО ВСІ АНІМАЦІЇ ===
            $style.html(
                '/* Анімації вимкнено плагіном */' +
                '.card,.torrent-item,.online-prestige,' +
                '.extensions__item,.extensions__block-add,.full-review-add,.full-review,' +
                '.tag-count,.full-person,.full-episode,.simple-button,.full-start__button,' +
                '.items-cards .selector,.card-more,.explorer-card__head-img.selector,.card-episode,' +
                '.menu__item,.selectbox-item,.settings-folder,.settings-param{' +
                'transform:none !important;' +
                'transition:none !important;' +
                'animation:none !important;' +
                '}'
            );
        }

        // Додаємо в <head> (гарантовано в кінці)
        $('head').append($style);
    }

    function startPlugin() {
        // --- Читаємо збережене значення ---
        var saved = localStorage.getItem('animations');
        if (saved === null) {
            localStorage.setItem('animations', 'true');
            animEnabled = true;
        } else {
            animEnabled = saved === 'true';
        }

        // --- Додаємо пункт у меню "Налаштування кольору акценту" ---
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'animations',
                type: 'trigger',
                "default": true
            },
            field: {
                name: Lampa.Lang.translate('animations'),
                description: ''
            },
            onChange: function (val) {
                animEnabled = !!val;
                localStorage.setItem('animations', animEnabled);
                applyAnimations(); // Миттєве оновлення
            }
        });

        // --- Застосовуємо при запуску ---
        applyAnimations();

        // --- Додатковий захист: оновлюємо при відкритті налаштувань ---
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name === 'accent_color_plugin') {
                setTimeout(applyAnimations, 100); // Невелика затримка на випадок динамічного рендеру
            }
        });
    }

    // === ЗАПУСК ПЛАГІНУ ===
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }

    // === МАНІФЕСТ ===
    Lampa.Manifest.plugins = {
        name: 'animations',
        version: '1.3',
        description: 'Повне вмикання/вимикання анімацій у "Налаштування кольору акценту"'
    };
})();
