(function () {  
  'use strict';  
  if (window.kmmRefreshPluginLoaded) return;  
  window.kmmRefreshPluginLoaded = true;  
  
  var Lampa = window.Lampa;  
  
  // 1) Кнопка "ОНОВИТИ" в контекстному меню "Дія"  
  var prevPush = window.lampac_online_context_menu ? window.lampac_online_context_menu.push : null;  
  var prevOnSelect = window.lampac_online_context_menu ? window.lampac_online_context_menu.onSelect : null;  
  
  window.lampac_online_context_menu = {  
    push: function (menu, extra, params) {  
      if (typeof prevPush === 'function') prevPush(menu, extra, params);  
      menu.push({ title: '🔄 Оновити', kmm_refresh: true });  
    },  
    onSelect: function (a, params) {  
      if (typeof prevOnSelect === 'function') prevOnSelect(a, params);  
      if (a.kmm_refresh) {  
        var act = Lampa.Activity.active();  
        if (act && act.activity) {  
          Lampa.Activity.replace(act.activity);  
        }  
      }  
    }  
  };  
  
  // 2) Кнопка "ОНОВИТИ" в рядку Джерело/Фільтр (DOM-інʼєкція, без офіційного хука)  
  function injectRefreshButton() {  
    var act = Lampa.Activity.active();  
    if (!act || !act.activity) return;  
  
    var render = act.activity.render ? act.activity.render() : null;  
    if (!render) return;  
  
    var torrentFilter = render.find('.torrent-filter');  
    if (!torrentFilter.length || torrentFilter.find('.filter--kmm-update').length) return;  
  
    var btn = $('<div class="simple-button selector filter--kmm-update"><span>ОНОВИТИ</span></div>');  
    btn.on('hover:enter', function () {  
      Lampa.Activity.replace(act.activity);  
    });  
    torrentFilter.append(btn);  
  }  
  
  Lampa.Listener.follow('activity', function (e) {  
    if (e.type === 'ready' || e.type === 'start') {  
      setTimeout(injectRefreshButton, 500);  
    }  
  });  
})();
