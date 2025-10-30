(function () {
    'use strict';

    function applyAnimations() {
        const enabled = localStorage.getItem('themes_animations') === 'true';

        $('#themes_animations').remove();

        if (enabled) {
            const css = `
                <style id="themes_animations">
                .card,
                .torrent-item,
                .online-prestige,
                .extensions__item,
                .extensions__block-add,
                .full-review-add,
                .full-review,
                .tag-count,
                .full-person,
                .full-episode,
                .simple-button,
                .full-start__button,
                .items-cards .selector,
                .card-more,
                .explorer-card__head-img.selector,
                .card-episode,
                .menu__item,
                .selectbox-item,
                .settings-folder,
                .settings-param {
                    transition: transform 0.3s ease !important;
                }
                .card.focus { transform: scale(1.03); }
                .torrent-item.focus,
                .online-prestige.focus { transform: scale(1.01); }
                .extensions__item.focus,
                .extensions__block-add.focus,
                .full-review-add.focus,
                .full-review.focus,
                .tag-count.focus,
                .full-person.focus,
                .full-episode.focus,
                .simple-button.focus,
                .full-start__button.focus,
                .items-cards .selector.focus,
                .card-more.focus,
                .explorer-card__head-img.selector.focus,
                .card-episode.focus {
                    transform: scale(1.03);
                }
                .menu__item.focus { transform: translateX(-0.2em); }
                .selectbox-item.focus,
                .settings-folder.focus,
                .settings-param.focus {
                    transform: translateX(0.2em);
                }
                </style>
            `;
            $('body').append(css);
        }
    }

    function setupAnimationToggle() {
        // перевіряємо або створюємо перемикач у налаштуваннях
        if (!$('.settings-param[data-name="animations"]').length) {
            const toggle = $('<div class="settings-param selector" data-name="animations"><div class="settings-param__name">Анімації</div><div class="settings-param__value"></div></div>');

            toggle.on('hover:enter', function () {
                const current = localStorage.getItem('themes_animations') === 'true';
                const newValue = !current;
                localStorage.setItem('themes_animations', newValue);
                toggle.find('.settings-param__value').text(newValue ? 'Увімкнено' : 'Вимкнено');
                applyAnimations(); // миттєво змінює поведінку
                Lampa.Settings.update();
            });

            $('.settings-content').append(toggle);

            const initState = localStorage.getItem('themes_animations') === 'true';
            toggle.find('.settings-param__value').text(initState ? 'Увімкнено' : 'Вимкнено');
        }
    }

    // --- основна логіка підвантаження / скролу ---
    function enableSmoothScrollFix(screen, params, content, html, body, _self) {
        if (screen) {
            let start_position = 0;
            let move_position = 0;
            let end_position = 0;
            let scroll_position = 0;

            const movestart = (e) => {
                start_position = params.horizontal ? e.clientX : e.clientY;
                end_position = start_position;
                move_position = start_position;

                if (localStorage.getItem('themes_animations') === 'true') {
                    body.toggleClass('notransition', true);
                } else {
                    body.classList.add('notransition');
                }
            };

            const move = (e) => {
                end_position = params.horizontal ? e.clientX : e.clientY;
                if (move_position && end_position) {
                    const delta = move_position - end_position;
                    const direct = params.horizontal ? 'left' : 'top';
                    let scrl = scroll_position;
                    const scrl_padding = parseInt(window.getComputedStyle(content, null).getPropertyValue('padding-' + direct));
                    let max = params.horizontal ? 30000 : body.offsetHeight;
                    max -= params.horizontal ? html.offsetWidth : html.offsetHeight;
                    max += scrl_padding * 2;
                    scrl -= delta;
                    scrl = Math.min(0, Math.max(-max, scrl));
                    scroll_position = scrl;
                    translateScroll();
                    move_position = end_position;
                }
            };

            const moveend = (e) => {
                end_position = 0;
                start_position = 0;
                move_position = 0;
                body.toggleClass('notransition', false);
                scrollEnded();
                if (_self.onAnimateEnd) _self.onAnimateEnd();
            };

            html.addEventListener('scroll', (e) => {
                html.scrollTop = 0;
                html.scrollLeft = 0;
            });

            html.addEventListener('touchstart', (e) => {
                movestart(e.touches[0] || e.changedTouches[0]);
            });
            html.addEventListener('touchmove', (e) => {
                move(e.touches[0] || e.changedTouches[0]);
            });
            html.addEventListener('touchend', moveend);
        } else {
            let native_scroll_animate = false;
            let native_scroll_timer = null;

            html.addEventListener('scroll', function () {
                clearTimeout(native_scroll_timer);
                const delay = localStorage.getItem('themes_animations') === 'true' ? 300 : 0;

                native_scroll_timer = setTimeout(() => {
                    if (_self.onAnimateEnd) _self.onAnimateEnd();
                }, delay);

                if (!native_scroll_animate) {
                    native_scroll_animate = true;
                    requestAnimationFrame(() => {
                        native_scroll_animate = false;
                        scroll_position = -(params.horizontal ? html.scrollLeft : html.scrollTop);
                        scrollEnded();
                    });
                }
            });
        }
    }

    // ініціалізація
    applyAnimations();
    setupAnimationToggle();

    // якщо треба — експортуємо функцію для підвантаження
    window.enableSmoothScrollFix = enableSmoothScrollFix;
})();
