(function () {  
  'use strict';  
  if (window.kmmRefreshPluginLoaded) return;  
  window.kmmRefreshPluginLoaded = true;  
  
  var Lampa = window.Lampa;  

  // Примусове оновлення з 100% захистом від циклічних посилань
  function forceRefresh() {
    var act = Lampa.Activity.active();
    if (!act || !act.activity) return;

    var newUrl = act.activity.source || act.activity.url || '';
    
    if (newUrl) {
        // Додаємо випадковий час, щоб C# видав інший балансер
        newUrl = newUrl.split('&kmm_rand=')[0] + '&kmm_rand=' + Date.now();
    } else if (act.activity.movie && act.activity.movie.id) {
        newUrl = 'http://91.238.104.117:9118/lite/kmm_uakino?id=' + act.activity.movie.id + '&kmm_rand=' + Date.now();
    }

    // Видаляємо стару кнопку з екрану
    $('.filter--kmm-update').remove();

    var m = act.activity.movie || {};
    var cleanMovie = {};
    
    // БРОНЬОВАНИЙ ФІЛЬТР: дозволяємо лише примітивні типи (рядки та числа)
    var keys = ['id', 'title', 'name', 'original_title', 'original_name', 'imdb_id', 'tmdb_id', 'kinopoisk_id', 'source', 'original_language', 'poster_path', 'backdrop_path', 'vote_average', 'number_of_seasons'];
    
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (m[k] !== undefined && m[k] !== null && typeof m[k] !== 'object' && typeof m[k] !== 'function') {
            cleanMovie[k] = m[k];
        }
    }

    // Формуємо чистий об'єкт активності
    var cleanParams = {
        component: act.activity.component || 'lampac',
        url: newUrl,
        source: newUrl,
        title: typeof act.activity.title === 'string' ? act.activity.title : 'Онлайн',
        movie: cleanMovie,
        page: 1
    };

    // Переносимо параметри пошуку ТІЛЬКИ якщо це чистий рядок
    if (typeof act.activity.search === 'string') cleanParams.search = act.activity.search;
    if (typeof act.activity.search_one === 'string') cleanParams.search_one = act.activity.search_one;
    if (typeof act.activity.search_two === 'string') cleanParams.search_two = act.activity.search_two;
    if (typeof act.activity.clarification === 'boolean') cleanParams.clarification = act.activity.clarification;

    // Перезавантажуємо Лампу чистим об'єктом
    Lampa.Activity.replace(cleanParams);
  }
  
  // 1) Кнопка "ОНОВИТИ" в контекстному меню "Дія"
  var prevPush = window.lampac_online_context_menu ? window.lampac_online_context_menu.push : null;  
  var prevOnSelect = window.lampac_online_context_menu ? window.lampac_online_context_menu.onSelect : null;  
  
  window.lampac_online_context_menu = {  
    push: function (menu, extra, params) {  
      if (typeof prevPush === 'function') prevPush.apply(this, arguments);  
      menu.push({ title: '🔄 Оновити джерело', kmm_refresh: true });  
    },  
    onSelect: function (a, params) {  
      if (typeof prevOnSelect === 'function') prevOnSelect.apply(this, arguments);  
      if (a.kmm_refresh) {
        Lampa.Select.close();
        forceRefresh();
      }  
    }  
  };  
  
  // 2) Кнопка "ОНОВИТИ" в рядку Джерело/Фільтр
  function injectRefreshButton() {  
    var act = Lampa.Activity.active();  
    if (!act || !act.activity) return;  
  
    var render = act.activity.render ? act.activity.render() : null;  
    if (!render) return;  
  
    // Шукаємо контейнер для кнопок
    var torrentFilter = render.find('.torrent-filter');  
    if (!torrentFilter.length) {
        var searchBtn = render.find('.filter--search');
        if (searchBtn.length) torrentFilter = searchBtn.parent();
    }
    
    if (!torrentFilter.length || torrentFilter.find('.filter--kmm-update').length) return;  
  
    // Додаємо кнопку
    var btn = $('<div class="simple-button selector filter--kmm-update" style="color:#33a3ab; border-color: rgba(51,163,171,0.5); background: rgba(51,163,171,0.1); font-weight:bold;"><span>🔄 ОНОВИТИ</span></div>');  
    
    btn.on('hover:enter click', function (e) {  
      e.stopPropagation();
      forceRefresh();
    });  
    
    torrentFilter.append(btn);  
  }  
  
  Lampa.Listener.follow('activity', function (e) {  
    if (e.type === 'ready' || e.type === 'start') {  
      setTimeout(injectRefreshButton, 500);  
    }  
  });  
})();
