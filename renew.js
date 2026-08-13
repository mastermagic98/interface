(function () {  
  'use strict';  
  if (window.kmmRefreshPluginLoaded) return;  
  window.kmmRefreshPluginLoaded = true;  
  
  var Lampa = window.Lampa;  

  // Симулюємо точну поведінку повторного вибору балансера
  function forceRefresh() {
    var act = Lampa.Activity.active();
    if (!act || !act.activity) return;

    var url = act.activity.source || act.activity.url || '';
    
    if (url) {
        // Додаємо мітку часу, щоб C# сервер гарантовано видав новий балансер
        var newUrl = url.split('&kmm_rand=')[0] + '&kmm_rand=' + Date.now();
        act.activity.url = newUrl;
        act.activity.source = newUrl;
    }

    // Видаляємо кнопку перед оновленням сторінки
    $('.filter--kmm-update').remove();

    // ⚡ МАГІЯ: Порожній виклик replace() - саме так робить оригінальний плагін Лампи 
    // при зміні балансера. Це ідеально повторює ручний вибір джерела і уникає помилок.
    Lampa.Activity.replace();
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
    if (!torrentFilter.length) {
        var searchBtn = render.find('.filter--search');
        if (searchBtn.length) torrentFilter = searchBtn.parent();
    }
    
    if (!torrentFilter.length || torrentFilter.find('.filter--kmm-update').length) return;  
  
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
