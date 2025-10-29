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
        var style = $('#animations_style');
        if (animEnabled) {
            if (!style.length) {
                var css = "\n<style id=\"animations_style\">\n" +
                    ".card{transform:scale(1);transition:transform .3s ease}\n" +
                    ".card.focus{transform:scale(1.03)}\n" +
                    ".torrent-item,.online-prestige{transform:scale(1);transition:transform .3s ease}\n" +
                    ".torrent-item.focus,.online-prestige.focus{transform:scale(1.01)}\n" +
                    ".extensions__item,.extensions__block-add,.full-review-add,.full-review,.tag-count,.full-person,.full-episode,.simple-button,.full-start__button,.items-cards .selector,.card-more,.explorer-card__head-img.selector,.card-episode{transform:scale(1);transition:transform .3s ease}\n" +
                    ".extensions__item.focus,.extensions__block-add.focus,.full-review-add.focus,.full-review.focus,.tag-count.focus,.full-person.focus,.full-episode.focus,.simple-button.focus,.full-start__button.focus,.items-cards .selector.focus,.card-more.focus,.explorer-card__head-img.selector.focus,.card-episode.focus{transform:scale(1.03)}\n" +
                    ".menu__item{transition:transform .3s ease}\n" +
                    ".menu__item.focus{transform:translateX(-.2em)}\n" +
                    ".selectbox-item,.settings-folder,.settings-param{transition:transform .3s ease}\n" +
                    ".selectbox-item.focus,.settings-folder.focus,.settings-param.focus{transform:translateX(.2em)}\n" +
                    "</style>";
                $('head').append(css);
            }
        } else {
            style.remove();
        }
    }

    function startPlugin() {
        if (!localStorage.getItem('animations')) {
            localStorage.setItem('animations', 'true');
        }

        // Додаємо пункт у вже існуюче меню "Налаштування кольору акценту"
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
            if (e.type == 'ready') startPlugin();
        });
    }

    Lampa.Manifest.plugins = {
        name: 'animations',
        version: '1.0',
        description: 'animations toggle'
    };
})();
