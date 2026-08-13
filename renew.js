(function () {  
  'use strict';  
  if (window.kmmRefreshPluginLoaded) return;  
  window.kmmRefreshPluginLoaded = true;  
  
  var Lampa = window.Lampa;  

  function isUakino(act) {
    if (!act || !act.activity) return false;

    var src = act.activity.source || act.activity.url || '';
    if (src.indexOf('kmm_uakino') > -1) return true;
    
    var movieId = act.activity.movie ? act.activity.movie.id : '';
    var std_last = Lampa.Storage.cache('online_last_balanser', 3000, {});
    var std_bal = std_last[movieId] || Lampa.Storage.get('online_balanser', '');
    if (std_bal === 'kmm_uakino' || std_bal.indexOf('uakino') > -1) return true;

    var render = act.activity.render ? act.activity.render() : null;
    if (render) {
        var sortText = render.find('.filter--sort').text();
        if (sortText && sortText.indexOf('UAkinoTV') > -1) return true;
    }

    return false;
  }

  function forceRefresh() {
    var act = Lampa.Activity.active();
    if (!act || !act.activity) return;

    var newUrl = act.activity.source || act.activity.url || '';
    
    if (newUrl) {
        newUrl = newUrl.split('&kmm_rand=')[0] + '&kmm_rand=' + Date.now();
    } else if (act.activity.movie && act.activity.movie.id) {
        newUrl = 'http://91.238.104.117:9118/lite/kmm_uakino?id=' + act.activity.movie.id + '&kmm_rand=' + Date.now();
    }

    $('.filter--kmm-update').remove();

    var m = act.activity.movie || {};
    var cleanMovie = {};
    
    var keys = ['id', 'title', 'name', 'original_title', 'original_name', 'imdb_id', 'tmdb_id', 'kinopoisk_id', 'source', 'original_language', 'poster_path', 'backdrop_path', 'vote_average', 'number_of_seasons'];
    
    for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (m[k] !== undefined && m[k] !== null && typeof m[k] !== 'object' && typeof m[k] !== 'function') {
            cleanMovie[k] = m[k];
        }
    }

    var cleanParams = {
        component: act.activity.component || 'lampac',
        url: newUrl,
        source: newUrl,
        title: typeof act.activity.title === 'string' ? act.activity.title : 'Онлайн',
        movie: cleanMovie,
        page: 1
    };

    if (typeof act.activity.search === 'string') cleanParams.search = act.activity.search;
    if (typeof act.activity.search_one === 'string') cleanParams.search_one = act.activity.search_one;
    if (typeof act.activity.search_two === 'string') cleanParams.search_two = act.activity.search_two;
    if (typeof act.activity.clarification === 'boolean') cleanParams.clarification = act.activity.clarification;

    Lampa.Activity.replace(cleanParams);
  }
  
  var prevPush = window.lampac_online_context_menu ? window.lampac_online_context_menu.push : null;  
  var prevOnSelect = window.lampac_online_context_menu ? window.lampac_online_context_menu.onSelect : null;  
  
  window.lampac_online_context_menu = {  
    push: function (menu, extra, params) {  
      if (typeof prevPush === 'function') {
          try { prevPush.apply(this, arguments); } catch(e){}
      }
      if (isUakino(Lampa.Activity.active())) {
          menu.push({ title: 'Оновити джерело', kmm_refresh: true });  
      }
    },  
    onSelect: function (a, params) {  
      // Якщо це наш пункт меню, обробляємо його і ЗУПИНЯЄМО подальше виконання
      if (a.kmm_refresh) {
        Lampa.Select.close();
        setTimeout(function(){
            forceRefresh();
        }, 50);
        return true;
      }  

      // Якщо це інший пункт (з оригінального плагіна), передаємо йому керування
      if (typeof prevOnSelect === 'function') {
          try { prevOnSelect.apply(this, arguments); } catch(e){}
      }
    }  
  };  
  
  function injectRefreshButton() {  
    var act = Lampa.Activity.active();  
    if (!act || !act.activity) return;  
  
    if (!isUakino(act)) return;

    var render = act.activity.render ? act.activity.render() : null;  
    if (!render) return;  
  
    var torrentFilter = render.find('.torrent-filter');  
    if (!torrentFilter.length) {
        var searchBtn = render.find('.filter--search');
        if (searchBtn.length) torrentFilter = searchBtn.parent();
    }
    
    if (!torrentFilter.length || torrentFilter.find('.filter--kmm-update').length) return;  
  
    var svgIcon = '<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:1.3em;height:1.3em;margin-right:0.5em;"><path d="M8.5 0.5L6.5 2.5M6.5 2.5L8.5 4.5M6.5 2.5H9.5C11.1569 2.5 12.5 3.84315 12.5 5.5V10.5M2.5 4.5C3.60457 4.5 4.5 3.60457 4.5 2.5C4.5 1.39543 3.60457 0.5 2.5 0.5C1.39543 0.5 0.5 1.39543 0.5 2.5C0.5 3.60457 1.39543 4.5 2.5 4.5ZM2.5 4.5V9.5C2.5 11.1569 3.84315 12.5 5.5 12.5H8M6.5 14.5L8.5 12.5L6.5 10.5M12.5 10.5C11.3954 10.5 10.5 11.3954 10.5 12.5C10.5 13.6046 11.3954 14.5 12.5 14.5C13.6046 14.5 14.5 13.6046 14.5 12.5C14.5 11.3954 13.6046 10.5 12.5 10.5Z" stroke="currentColor"></path></svg>';
    var btn = $('<div class="simple-button simple-button--filter selector filter--kmm-update">' + svgIcon + '<span>Оновити</span></div>');  
    
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
