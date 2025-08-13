(function () {
    'use strict';

    function fix_lang() {
        Lampa.Lang.add({
            tv_status_returning_series: {
                ru: 'Идет',
                en: 'Returning Series',
                uk: 'Триває'
            },
            tv_status_planned: {
                ru: 'Запланирован',
                en: 'Planned',
                uk: 'Заплановано'
            },
            tv_status_in_production: {
                ru: 'В производстве',
                en: 'In Production',
                uk: 'У виробництві'
            },
            tv_status_ended: {
                ru: 'Завершен',
                en: 'Ended',
                uk: 'Завершено'
            },
            tv_status_canceled: {
                ru: 'Отменен',
                en: 'Canceled',
                uk: 'Скасовано'
            },
            tv_status_pilot: {
                ru: 'Пилот',
                en: 'Pilot',
                uk: 'Пілот'
            },
            tv_status_released: {
                ru: 'Вышел',
                en: 'Released',
                uk: 'Випущено'
            },
            tv_status_rumored: {
                ru: 'По слухам',
                en: 'Rumored',
                uk: 'За чутками'
            },
            tv_status_post_production: {
                ru: 'Скоро',
                en: 'Post Production',
                uk: 'Скоро'
            }
        });
    }

    if (window.appready) {
        fix_lang();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                fix_lang();
            }
        });
    }
})();
