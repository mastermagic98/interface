(function () {
    'use strict';

    function forall() {
        Lampa.Template.add('card', '<div class="card selector layer--visible layer--render">' +
            '<div class="card__view">' +
            '<img src="./img/img_load.svg" class="card__img" />' +
            '<div class="card__icons">' +
            '<div class="card__icons-inner"></div>' +
            '</div>' +
            '<div class="card__age">{release_year}</div>' +
            '</div>' +
            '<div class="card__title">{title}</div>' +
            '</div>');

        Lampa.Template.add('card_episode', '<div class="card-episode selector layer--visible layer--render">' +
            '<div class="card-episode__body">' +
            '<div class="full-episode">' +
            '<div class="full-episode__img"><img /></div>' +
            '<div class="full-episode__body">' +
            '<div class="card__title">{title}</div>' +
            '<div class="card__age">{release_year}</div>' +
            '<div class="full-episode__num hide">{num}</div>' +
            '<div class="full-episode__name">{name}</div>' +
            '<div class="full-episode__date">{date}</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '<div class="card-episode__footer hide">' +
            '<div class="card__imgbox">' +
            '<div class="card__view"><img class="card__img" /></div>' +
            '</div>' +
            '<div class="card__left">' +
            '<div class="card__title">{title}</div>' +
            '<div class="card__age">{release_year}</div>' +
            '</div>' +
            '</div>' +
            '</div>');

        var forall_style = '<style id="accent_color_forall">' +
            '@media screen and (max-width: 480px) { .full-start-new__head, .full-start-new__title, .full-start__title-original, .full-start__rate, .full-start-new__reactions, .full-start-new__rate-line, .full-start-new__buttons, .full-start-new__details, .full-start-new__tagline { -webkit-justify-content: center; justify-content: center; text-align: center; }' +
            '.full-start__title-original { max-width: 100%; } }' +
            '@media screen and (max-width: 480px) { .full-start-new__right { background: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0)), to(rgba(0, 0, 0, 0))); background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%); background: -o-linear-gradient(top, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%); background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 100%); } }' +
            '.selectbox-item__checkbox { border-radius: 100%; }' +
            '.selectbox-item--checked .selectbox-item__checkbox { background: #ccc; }' +
            '.full-start-new__rate-line .full-start__pg { font-size: 1em; background: #fff; color: #000; }' +
            '.full-start__rate { border-radius: 0.25em; padding: 0.3em; background-color: rgba(0, 0, 0, 0.3); }' +
            '.full-start__pg, .full-start__status { font-size: 1em; background: #fff; color: #000; }' +
            '.card__title { height: 3.6em; text-overflow: ellipsis; -o-text-overflow: ellipsis; -webkit-line-clamp: 3; line-clamp: 3; }' +
            '.card__age { position: absolute; right: 0em; bottom: 0em; z-index: 10; background: rgba(0, 0, 0, 0.6); color: #ffffff; font-weight: 700; padding: 0.4em 0.6em; -webkit-border-radius: 0.48em 0 0.48em 0; -moz-border-radius: 0.48em 0 0.48em 0; border-radius: 0.48em 0 0.48em 0; line-height: 1.0; font-size: 1.0em; }' +
            '.card__vote { position: absolute; bottom: auto; right: 0em; top: 0em; background: rgba(0, 0, 0, 0.6); font-weight: 700; color: #fff; -webkit-border-radius: 0 0.34em 0 0.34em; -moz-border-radius: 0 0.34em 0 0.34em; border-radius: 0 0.34em 0 0.34em; line-height: 1.0; font-size: 1.4em; }' +
            '.card__icons { position: absolute; top: 2em; left: 0; right: auto; display: -webkit-box; display: -webkit-flex; display: -moz-box; display: -ms-flexbox; display: flex; -webkit-box-pack: center; -webkit-justify-content: center; -moz-box-pack: center; -ms-flex-pack: center; justify-content: center; background: rgba(0, 0, 0, 0.6); color: #fff; -webkit-border-radius: 0 0.5em 0.5em 0; -moz-border-radius: 0 0.5em 0.5em 0; border-radius: 0 0.5em 0.5em 0; }' +
            '.card__icons-inner { background: rgba(0, 0, 0, 0); }' +
            '.card__marker { position: absolute; left: 0em; top: 4em; bottom: auto; background: rgba(0, 0, 0, 0.6); -webkit-border-radius: 0 0.5em 0.5em 0; -moz-border-radius: 0 0.5em 0.5em 0; border-radius: 0 0.5em 0.5em 0; font-weight: 700; font-size: 1.0em; padding: 0.4em 0.6em; display: -webkit-box; display: -webkit-flex; display: -moz-box; display: -ms-flexbox; display: flex; -webkit-box-align: center; -webkit-align-items: center; -moz-box-align: center; -ms-flex-align: center; align-items: center; line-height: 1.2; max-width: min(12em, 95%); box-sizing: border-box; }' +
            '.card__marker > span { max-width: min(12em, 95%); }' +
            '.card__quality { position: absolute; left: auto; right: 0em; bottom: 2.4em; padding: 0.4em 0.6em; color: #fff; font-weight: 700; font-size: 1.0em; -webkit-border-radius: 0.5em 0 0 0.5em; -moz-border-radius: 0.5em 0 0 0.5em; border-radius: 0.5em 0 0 0.5em; text-transform: uppercase; }' +
            '.items-line.items-line--type-cards + .items-line.items-line--type-cards { margin-top: 1em; }' +
            '.card--small .card__view { margin-bottom: 2em; }' +
            '.items-line--type-cards { min-height: 18em; }' +
            '@media screen and (min-width: 580px) { .full-start-new { min-height: 80vh; display: flex; } }' +
            '.full-start__background.loaded { opacity: 0.8; } .full-start__background.dim { opacity: 0.2; }' +
            '.explorer__files .torrent-filter .simple-button { font-size: 1.2em; -webkit-border-radius: 0.5em; -moz-border-radius: 0.5em; border-radius: 0.5em; }' +
            '.full-review-add, .full-review, .extensions__item, .extensions__block-add, .search-source, .bookmarks-folder__layer, .bookmarks-folder__body, .card__img, .card__promo, .full-episode--next .full-episode__img:after, .full-episode__img img, .full-episode__body, .full-person__photo, .card-more__box, .full-start__button, .simple-button, .register { border-radius: 0.5em; }' +
            '.extensions__item.focus::after, .extensions__block-add.focus::after, .full-episode.focus::after, .full-review-add.focus::after, .card-parser.focus::after, .card-episode.focus .full-episode::after, .card-episode.hover .full-episode::after, .card.focus .card__view::after, .card.hover .card__view::after, .card-more.focus .card-more__box::after, .register.focus::after { border-radius: 1em; }' +
            '.search-source.focus, .simple-button.focus, .menu__item.focus, .menu__item.traverse, .menu__item.hover, .full-start__button.focus, .full-descr__tag.focus, .player-panel .button.focus, .full-person.selector.focus, .tag-count.selector.focus { border-radius: 0.5em; }' +
            '.menu__item.focus { border-radius: 0 0.5em 0.5em 0; }' +
            '.menu__list { padding-left: 0em; }' +
            '.menu__item.focus .menu__ico { -webkit-filter: invert(1); filter: invert(1); }' +
            '</style>';
        Lampa.Template.add('forall_style_css', forall_style);
        $('body').append(Lampa.Template.get('forall_style_css', {}, true));
    }

    if (window.appready) {
        forall();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                forall();
            }
        });
    }
})();
