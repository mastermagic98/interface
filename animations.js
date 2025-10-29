component: 'accent_color_plugin'
(function () {
    'use strict';

    Lampa.Lang.add({
        maxsm_animations: {
            ru: "Анимации",
            en: "Animations",
            uk: "Анімації"
        }
    });

    var animations = function () {
        var enabled = localStorage.getItem('maxsm_animations') === 'true';
        $('#maxsm_animations').remove();
        if (enabled) {
            var style = "<style id=\"maxsm_animations\">" +
                ".card{transform:scale(1);transition:transform .3s ease}" +
                ".card.focus{transform:scale(1.03)}" +
                ".torrent-item,.online-prestige{transform:scale(1);transition:transform .3s ease}" +
                ".torrent-item.focus,.online-prestige.focus{transform:scale(1.01)}" +
                ".extensions__item,.extensions__block-add,.full-review-add,.full-review,.tag-count,.full-person,.full-episode,.simple-button,.full-start__button,.items-cards .selector,.card-more,.explorer-card__head-img.selector,.card-episode{transform:scale(1);transition:transform .3s ease}" +
                ".extensions__item.focus,.extensions__block-add.focus,.full-review-add.focus,.full-review.focus,.tag-count.focus,.full-person.focus,.full-episode.focus,.simple-button.focus,.full-start__button.focus,.items-cards .selector.focus,.card-more.focus,.explorer-card__head-img.selector.focus,.card-episode.focus{transform:scale(1.03)}" +
                ".menu__item{transition:transform .3s ease}" +
                ".menu__item.focus{transform:translateX(-.2em)}" +
                ".selectbox-item,.settings-folder,.settings-param{transition:transform .3s ease}" +
                ".selectbox-item.focus,.settings-folder.focus,.settings-param.focus{transform:translateX(.2em)}" +
                "</style>";
            $('body').append(style);
        }
    };

    var startPlugin = function () {
        if (!localStorage.getItem('maxsm_animations')) {
            localStorage.setItem('maxsm_animations', 'true');
        }

        Lampa.SettingsApi.addComponent({
            component: "accent_color_plugin",
            name: Lampa.Lang.translate('maxsm_animations'),
            icon: ''
        });

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'maxsm_animations',
                type: "trigger",
                "default": true
            },
            field: {
                name: Lampa.Lang.translate('maxsm_animations'),
                description: ''
            },
            onChange: function () {
                animations();
            }
        });

        animations();
    };

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                startPlugin();
            }
        });
    }
})();
