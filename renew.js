(function () {  
  'use strict';  
  if (window.kmmRefreshPluginLoaded) return;  
  window.kmmRefreshPluginLoaded = true;  
  
  var Lampa = window.Lampa;  

  // Створюємо стерильний об'єкт фільму без HTML-елементів і циклічних посилань
  function getCleanMovie(movie) {
      if (!movie) return {};
      var clean = {};
      // Дозволяємо лише безпечні ключі, які Лампа використовує для запитів
      var allowedKeys = ['id', 'title', 'name', 'original_title', 'original_name', 'release_date', 'first_air_date', 'imdb_id', 'tmdb_id', 'kinopoisk_id', 'source', 'original_language', 'poster_path', 'backdrop_path', 'vote_average', 'number_of_seasons'];
      
      for (var i = 0; i < allowedKeys.length; i++) {
          var k = allowedKeys[i];
          if (movie[k] !== undefined && typeof movie[k] !== 'function' && typeof movie[k] !== 'object') {
              clean[k] = movie[k];
          }
      }
      
      // Безпечно копіюємо масиви (жанри, ключові слова), якщо вони є
      if (movie.genres) { try { clean.genres = JSON.parse(JSON.stringify(movie.genres)); } catch(e){} }
      if (movie.keywords) { try { clean.keywords = JSON.parse(JSON.stringify(movie.keywords)); } catch(e){} }
      
      return clean;
  }

  // Функція для примусового оновлення та скидання кешу сервера
  function forceRefresh() {
    var act = Lampa.Activity.active();
    if (!act || !act.activity) return;

    var url = act.activity.source || act.activity.url || '';
    
    if (url) {
      // Відрізаємо старий параметр і додаємо новий з поточним часом
      url = url.split('&kmm_rand=')[0] + '&kmm_rand=' + Date.now();
    }

    // Видаляємо стару кнопку
    $('.filter--kmm-update').remove();

    // Створюємо 100% чистий об'єкт параметрів, щоб уникнути "cyclic object value"
    var cleanParams = {
        component: act.activity.component,
        url: url,
        source: url,
        movie: getCleanMovie(act.activity.movie)
    };

    // Деякі плагіни покладаються на ці параметри пошуку
    if (act.activity.search) cleanParams.search = act.activity.search;
    if (act.activity.search_one) cleanParams.search_one = act.activity.search_one;
    if (act.activity.search_two) cleanParams.search_two = act.activity.search_two;

    // Перезапускаємо сторінку чистим об'єктом
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
  
    var torrentFilter = render.find('.torrent-filter');  
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
