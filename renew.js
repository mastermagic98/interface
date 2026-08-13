(function () {  
  'use strict';  
  if (window.kmmRefreshPluginLoaded) return;  
  window.kmmRefreshPluginLoaded = true;  
  
  var Lampa = window.Lampa;  

  // Функція для створення абсолютно чистого об'єкта фільму (захист від cyclic object value)
  function getCleanMovie(m) {
      if (!m) return {};
      var clean = {
          id: m.id,
          title: m.title,
          name: m.name,
          original_title: m.original_title,
          original_name: m.original_name,
          release_date: m.release_date,
          first_air_date: m.first_air_date,
          imdb_id: m.imdb_id,
          tmdb_id: m.tmdb_id,
          kinopoisk_id: m.kinopoisk_id,
          source: m.source || 'tmdb',
          original_language: m.original_language,
          poster_path: m.poster_path,
          backdrop_path: m.backdrop_path,
          vote_average: m.vote_average,
          number_of_seasons: m.number_of_seasons
      };

      // Безпечно копіюємо жанри, якщо вони є (тільки текст та ID)
      if (Array.isArray(m.genres)) {
          clean.genres = m.genres.map(function(g) { return { id: g.id, name: g.name }; });
      }

      return clean;
  }

  // Примусове оновлення з новим параметром для збиття кешу C#
  function forceRefresh() {
    var act = Lampa.Activity.active();
    if (!act || !act.activity) return;

    var newUrl = act.activity.source || act.activity.url || '';
    
    // Якщо URL немає, формуємо дефолтний
    if (!newUrl && act.activity.movie) {
        newUrl = 'http://91.238.104.117:9118/lite/kmm_uakino?id=' + act.activity.movie.id;
    }

    if (newUrl) {
        // Додаємо випадковий час, щоб C# видав інший балансер
        newUrl = newUrl.split('&kmm_rand=')[0] + '&kmm_rand=' + Date.now();
    }

    // Видаляємо стару кнопку з екрану
    $('.filter--kmm-update').remove();

    var m = act.activity.movie || {};

    // ПУШИМО ЧИСТУ АКТИВНІСТЬ (саме так робить оригінальний плагін Лампи)
    Lampa.Activity.replace({
        url: newUrl,
        source: newUrl,
        title: act.activity.title || Lampa.Lang.translate('title_online') || 'Онлайн',
        component: act.activity.component || 'lampac',
        search: act.activity.search || m.title || m.name,
        search_one: act.activity.search_one || m.title || m.name,
        search_two: act.activity.search_two || m.original_title || m.original_name,
        movie: getCleanMovie(m),
        page: 1,
        clarification: act.activity.clarification ? true : false
    });
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
  
    // Працюємо лише в компонентах онлайну
    var comp = act.activity.component || act.component;
    if (comp !== 'online' && comp !== 'lampac') return;

    var render = act.activity.render ? act.activity.render() : null;  
    if (!render) return;  
  
    var torrentFilter = render.find('.torrent-filter');  
    if (!torrentFilter.length) {
        var searchBtn = render.find('.filter--search');
        if (searchBtn.length) torrentFilter = searchBtn.parent();
    }
    
    if (!torrentFilter.length || torrentFilter.find('.filter--kmm-update').length) return;  
  
    // Стилізуємо кнопку
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
