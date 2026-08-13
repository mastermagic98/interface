(function () {
    'use strict';
    
    // Захист від подвійного завантаження
    if (window.kmmHarvesterUpdatePlugin) return;
    window.kmmHarvesterUpdatePlugin = true;

    var Lampa = window.Lampa;

    // Перевірка, чи активний саме наш балансер
    function isUakino(act) {
        if (!act || !act.activity) return false;

        var movieId = act.activity.movie ? act.activity.movie.id : '';
        var isKmm = false;

        // Перевірка для стандартного плагіна Online / Lampac
        var std_last = Lampa.Storage.cache('online_last_balanser', 3000, {});
        var std_bal = std_last[movieId] || Lampa.Storage.get('online_balanser', '');
        if (std_bal === 'kmm_uakino') isKmm = true;

        // Надійна перевірка по поточному URL (якщо балансер вже відкритий)
        var src = act.activity.source || act.activity.url || '';
        if (src.indexOf('kmm_uakino') > -1) isKmm = true;

        return isKmm;
    }

    // Функція оновлення джерела
    function doRefresh(act) {
        var movieId = act.activity.movie ? act.activity.movie.id : '';
        var src = act.activity.source || act.activity.url || '';
        
        var url = src;
        if (!url) url = 'http://91.238.104.117:9118/lite/kmm_uakino?id=' + movieId;
        
        if (url) {
            // Додаємо випадковий параметр, щоб збити кеш сервера
            url = url.split('&kmm_rand=')[0] + '&kmm_rand=' + Date.now();
            
            // Видаляємо кнопку, щоб вона не задвоїлася під час рендеру
            $('.filter--uakino-update').remove();

            // Виконуємо запит за новим контентом
            if (act.activity.request && act.activity.reset) {
                act.activity.reset();
                act.activity.request(url);
            } else {
                act.activity.url = url;
                act.activity.source = url;
                Lampa.Activity.replace(act.activity);
            }
        }
    }

    // 1) ДОДАВАННЯ КНОПКИ В РЯДОК ФІЛЬТРІВ (DOM-ін'єкція)
    function checkAndAddButton() {
        var act = Lampa.Activity.active();
        if (!act || !act.activity) return;

        // Перевіряємо компонент
        var comp = act.activity.component || act.component;
        if (comp !== 'online' && comp !== 'lampac') return;

        var render = act.activity.render ? act.activity.render() : null;
        if (!render) return;

        // Шукаємо правильний контейнер
        var torrentFilter = render.find('.torrent-filter');
        if (!torrentFilter.length) {
            // Фолбек: якщо .torrent-filter немає, шукаємо контейнер біля .filter--search
            var searchBtn = render.find('.filter--search');
            if (searchBtn.length) torrentFilter = searchBtn.parent();
            if (!torrentFilter.length) return;
        }

        // Перевіряємо, чи кнопка вже додана
        if (torrentFilter.find('.filter--uakino-update').length > 0) return;

        // Якщо це не наш агрегатор, виходимо
        if (!isUakino(act)) return;

        var svgUrl = 'http://91.238.104.117:9118/icon_harvester/renew.svg';
        var svgIcon = '<div style="width:16px;height:16px;margin-right:6px;background-color:#33a3ab;-webkit-mask:url(\'' + svgUrl + '\') center/contain no-repeat;mask:url(\'' + svgUrl + '\') center/contain no-repeat;"></div>';
        var btnHtml = '<div class="simple-button simple-button--filter selector filter--uakino-update" style="color:#33a3ab; border-color: rgba(51,163,171,0.5); background: rgba(51,163,171,0.1); font-weight:bold;">' + svgIcon + '<span>Оновити джерело</span><div class="hide"></div></div>';
        
        var updateBtn = $(btnHtml);
        
        // Вставляємо кнопку в кінець блоку фільтрів
        torrentFilter.append(updateBtn);

        // Обробник натискання
        updateBtn.on('hover:enter click', function (e) {
            e.stopPropagation();
            doRefresh(act);
        });
    }

    // Відстежуємо події Лампи для DOM-ін'єкції
    Lampa.Listener.follow('activity', function (e) {
        if (e.type === 'ready' || e.type === 'start') {
            var attempts = 0;
            var timer = setInterval(function() {
                var act = Lampa.Activity.active();
                var render = act && act.activity && act.activity.render ? act.activity.render() : null;
                
                // Чекаємо, поки відрендериться контейнер фільтрів
                if (render && (render.find('.torrent-filter').length > 0 || render.find('.filter--search').length > 0)) {
                    clearInterval(timer);
                    checkAndAddButton();
                }
                
                attempts++;
                if (attempts > 50) clearInterval(timer); // Стоп через 5 секунд
            }, 100);
        }
    });

    // 2) ДОДАВАННЯ КНОПКИ В КОНТЕКСТНЕ МЕНЮ (Офіційний хук)
    var prevPush = window.lampac_online_context_menu ? window.lampac_online_context_menu.push : null;
    var prevOnSelect = window.lampac_online_context_menu ? window.lampac_online_context_menu.onSelect : null;

    window.lampac_online_context_menu = {
        push: function (menu, extra, params) {
            // Спочатку викликаємо оригінальний метод (якщо є)
            if (typeof prevPush === 'function') prevPush.apply(this, arguments);
            
            var act = Lampa.Activity.active();
            if (isUakino(act)) {
                menu.push({ title: '🔄 Оновити джерело', kmm_refresh: true });
            }
        },
        onSelect: function (a, params) {
            // Спочатку викликаємо оригінальний метод (якщо є)
            if (typeof prevOnSelect === 'function') prevOnSelect.apply(this, arguments);
            
            if (a.kmm_refresh) {
                Lampa.Select.close();
                var act = Lampa.Activity.active();
                if (act && act.activity) {
                    doRefresh(act);
                }
            }
        }
    };

})();
