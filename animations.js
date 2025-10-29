(function () {
    'use strict';

    Lampa.Lang.add({
        animations: {
            ru: "Анимации",
            en: "Animations",
            uk: "Анімації"
        }
    });

    var animEnabled = localStorage.getItem('animations') !== 'false';

    function toggleAnimations() {
        var styleId = 'animations_style';
        $('#' + styleId).remove();

        if (animEnabled) {
            var css = '<style id="' + styleId + '">' +
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
        if (localStorage.getItem('animations') === null) {
            localStorage.setItem('animations', 'true');
        } else {
            animEnabled = localStorage.getItem('animations') === 'true';
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
                animEnabled = val;
                localStorage.setItem('animations', val);
                toggleAnimations();
            }
        });

        toggleAnimations();
    }

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
        version: '1.0',
        description: 'animations toggle'
    };
})();
