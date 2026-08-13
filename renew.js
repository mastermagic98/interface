(function () {  
  'use strict';  
  if (window.kmmRefreshPluginLoaded) return;  
  window.kmmRefreshPluginLoaded = true;  
  
  var Lampa = window.Lampa;  

  // Функція для примусового оновлення та скидання кешу сервера
  function forceRefresh(act) {
    if (!act || !act.activity) return;
    
    var url = act.activity.source || act.activity.url || '';
    
    if (url) {
      // Відрізаємо старий параметр (якщо він був) і додаємо новий з поточним часом
      url = url.split('&kmm_rand=')[0] + '&kmm_rand=' + Date.now();
      
      // Видаляємо стару кнопку, щоб при рендері не було дублів
      $('.filter--kmm-update').remove();

      // Спосіб 1: Якщо компонент підтримує прямий перезапит (стандартний online/lampac)
      if (act.component && typeof act.component.reset === 'function' && typeof act.component.request === 'function') {
        act.component.reset();
        act.component.request(url);
      } 
      // Спосіб 2: Якщо це Bandera Online або fallback
      else {
        act.activity.url = url;
        act.activity.source = url;
        Lampa.Activity.replace(act.activity);
      }
    } else {
      // Якщо URL не знайдено, робимо звичайний replace
      Lampa.Activity.replace(act.activity);
    }
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
        forceRefresh(Lampa.Activity.active());
      }  
    }  
  };  
  
  // 2) Кнопка "ОНОВИТИ" в рядку Джерело/Фільтр (DOM-інʼєкція)
  function injectRefreshButton() {  
    var act = Lampa.Activity.active();  
    if (!act || !act.activity) return;  
  
    var render = act.activity.render ? act.activity.render() : null;  
    if (!render) return;  
  
    var torrentFilter = render.find('.torrent-filter');  
    if (!torrentFilter.length || torrentFilter.find('.filter--kmm-update').length) return;  
  
    // Стилізуємо кнопку, щоб вона виділялася
    var btn = $('<div class="simple-button selector filter--kmm-update" style="color:#33a3ab; border-color: rgba(51,163,171,0.5); background: rgba(51,163,171,0.1); font-weight:bold;"><span>🔄 ОНОВИТИ</span></div>');  
    
    btn.on('hover:enter click', function (e) {  
      e.stopPropagation();
      forceRefresh(Lampa.Activity.active());
    });  
    
    torrentFilter.append(btn);  
  }  
  
  Lampa.Listener.follow('activity', function (e) {  
    if (e.type === 'ready' || e.type === 'start') {  
      setTimeout(injectRefreshButton, 500);  
    }  
  });  
})();
