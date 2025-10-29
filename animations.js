(function () {
    'use strict';

    Lampa.Lang.add({
        animations: {
            ru: "Анимации",
            en: "Animations",
            uk: "Анімації"
        }
    });

    var STYLE_ID = 'animations_style';
    var animEnabled = false;

    function applyAnimations() {
        // Завжди видаляємо старий стиль
        $('#' + STYLE_ID).remove();

        if (animEnabled) {
            var css = '<style id="' + STYLE_ID + '">' +
                '.card{transform:scale(1);transition:transform .3s ease}' +
                '.card.focus{transform:scale(1.03)}' +
                '.torrent-item,.online-prestige{transform:scale(1);transition:transform .3s ease}' +
                '.torrent-item.focus,.online-prestige.focus{transform:scale(1.01)}' +
                '.extensions__item,.extensions__block-add,.full-review-add,.full-review,.tag-count,.full-person,.full-episode,.simple-button,.full-start__button,.items-cards .selector,.card-more,.explorer-card__head-img.selector,.card-episode{transform:scale(1);transition:transform .3s ease}' +
                '.extensions__item.focus,.extensions__block-add.focus,.full-review-add.focus,.full-review.focus,.tag-count.focus,.full-person.focus,.full-episode.focus,.simple-button.focus,.full-start__button.focus,.items-cards .selector.focus,.card-more.focus,.explorer-card__head-img.selector.focus,.card-episode.focus{transform:scale(1.03)}' +
                '.menu__item{transition:transform .3s ease}' +
                '.menu__item.focus{transform:translateX(-.2em)}' +
                '.selectbox-item,.settings-folder,.settings-param{transition:transform .3s ease}' +
                '.selectbox-item.focus,.settings-folder.focus,.settings-param.focus{transform:translateX(.2em)}' +
                '</style>';
            $('head').append(css);
        }
    }

    function startPlugin() {
        // Читаємо збережене значення
        var saved = localStorage.getItem('animations');
        if (saved === null) {
            localStorage.setItem('animations', 'true');
            animEnabled = true;
        } else {
            animEnabled = saved === 'true';
        }

        // Додаємо пункт у меню "Налаштування кольору акценту"
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
                animEnabled = !!val; // true/false
                localStorage.setItem('animations', animEnabled);
                applyAnimations();
            }
        });

        // Застосовуємо при старті
        applyAnimations();
    }

    // Запуск
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }

    Lampa.Manifest.plugins = {
        name: 'animations',
        version: '1.1',
        description: 'animations toggle in accent color settings'
    };
})();
