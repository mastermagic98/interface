(function () {
    'use strict';

    const pluginId = 'buttons_display_plugin';

    Lampa.Lang.add({
        buttons_display_plugin_title: {
            uk: 'Відображення кнопок у картці',
            en: 'Button display in card',
            ru: 'Отображение кнопок в карточке'
        },
        buttons_display_mode: {
            uk: 'Режим відображення тексту на кнопках',
            en: 'Button text display mode',
            ru: 'Режим отображения текста на кнопках'
        },
        buttons_display_default: {
            uk: 'За замовчуванням (Lampa)',
            en: 'Default (Lampa)',
            ru: 'По умолчанию (Lampa)'
        },
        buttons_display_showtext: {
            uk: 'Показати текст на кнопках',
            en: 'Show text on buttons',
            ru: 'Показать текст на кнопках'
        },
        buttons_display_hidetext: {
            uk: 'Приховати текст на кнопках',
            en: 'Hide text on buttons',
            ru: 'Скрыть текст на кнопках'
        },
        buttons_display_allbuttons: {
            uk: 'Показувати всі кнопки',
            en: 'Show all buttons',
            ru: 'Показывать все кнопки'
        }
    });

    // Функція для оновлення стану кнопок у картці без перезавантаження
    function refreshButtons() {
        const current = Lampa.Activity.active();
        if (!current) return;

        const fullContainer = current.render();
        if (!fullContainer) return;

        const targetContainer = fullContainer.find('.full-start-new__buttons');
        if (!targetContainer.length) return;

        const allButtons = fullContainer.find('.buttons--container .full-start__button')
            .add(targetContainer.find('.full-start__button'));

        const showAll = Lampa.Storage.get('buttons_display_allbuttons') === true;

        allButtons.each(function () {
            const $button = $(this);
            const isHidden = $button.closest('.full-start__view').hasClass('hide');
            if (showAll && isHidden) {
                $button.closest('.full-start__view').removeClass('hide');
            } else if (!showAll && !$button.closest('.full-start__view').hasClass('hide-default')) {
                // Повертаємо до стандартного стану, якщо кнопка не була прихована спочатку
                $button.closest('.full-start__view').addClass('hide');
            }
        });
    }

    // Функція зміни режиму відображення тексту
    function applyTextMode() {
        const mode = Lampa.Storage.get('buttons_display_mode') || 'default';
        const styleId = 'buttons_display_style';
        $('#' + styleId).remove();

        if (mode === 'showtext') {
            $('<style>', { id: styleId }).text(`
                .full-start__button span { opacity: 1 !important; visibility: visible !important; }
                .full-start__button { height: auto !important; }
            `).appendTo('head');
        } else if (mode === 'hidetext') {
            $('<style>', { id: styleId }).text(`
                .full-start__button span { display: none !important; }
                .full-start__button { height: 60px !important; }
            `).appendTo('head');
        }
    }

    // Реакція на відкриття картки
    Lampa.Listener.follow('full', (e) => {
        if (e.type === 'complite') {
            setTimeout(() => {
                applyTextMode();
                refreshButtons();
            }, 200);
        }
    });

    // Додавання опцій у налаштування
    Lampa.SettingsApi.addParam({
        component: pluginId,
        param: 'buttons_display_mode',
        type: 'select',
        values: [
            { name: Lampa.Lang.translate('buttons_display_default'), value: 'default' },
            { name: Lampa.Lang.translate('buttons_display_showtext'), value: 'showtext' },
            { name: Lampa.Lang.translate('buttons_display_hidetext'), value: 'hidetext' }
        ],
        default: 'default',
        name: Lampa.Lang.translate('buttons_display_mode')
    });

    Lampa.SettingsApi.addParam({
        component: pluginId,
        param: 'buttons_display_allbuttons',
        type: 'toggle',
        default: false,
        name: Lampa.Lang.translate('buttons_display_allbuttons')
    });

    // Реакція на зміну опцій без перезавантаження сторінки
    Lampa.SettingsApi.listener.follow('update', (e) => {
        if (e.name === 'buttons_display_mode') {
            applyTextMode();
        }
        if (e.name === 'buttons_display_allbuttons') {
            refreshButtons();
        }
    });

    Lampa.SettingsApi.addComponent({
        id: pluginId,
        name: Lampa.Lang.translate('buttons_display_plugin_title')
    });

    console.log('[ButtonsDisplayPlugin] Завантажено успішно');
})();
