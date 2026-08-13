(function () {  
  'use strict';  
  if (window.kmmRefreshPluginLoaded) return;  
  window.kmmRefreshPluginLoaded = true;  
  
  var Lampa = window.Lampa;  

  // Пряме оновлення компонента БЕЗ перезапису активності (щоб уникнути cyclic object error)
  function forceRefresh() {
    var act = Lampa.Activity.active();
    if (!act || !act.activity) return;

    // Отримуємо "живий" інстанс компонента (наприклад, плагіна Online)
    var comp = act.component;
    
    // Перевіряємо, чи компонент має методи для прямого перезавантаження
    if (comp && typeof comp.reset === 'function' && typeof comp.request === 'function') {
        var url = act.activity.source || act.activity.url || '';
        
        // Якщо URL немає, формуємо дефолтний
        if (!url && act.activity.movie) {
            url = 'http://91.238.104.117:9118/lite/kmm_uakino?id=' + act.activity.movie.id;
        }

        if (url) {
            // Додаємо унікальний параметр, щоб збити кеш C# сервера і отримати новий балансер
            url = url.split('&kmm_rand=')[0] + '&kmm_rand=' + Date.now();
            
            // Оновлюємо URL в поточній активності (без клонування)
            act.activity.url = url;
            act.activity.source = url;
            
            // Видаляємо кнопку, щоб уникнути її дублювання після оновлення
            $('.filter--kmm-update').remove();

            // МАГІЯ: Прямо наказуємо компоненту очистити екран і завантажити нове посилання
            comp.reset();
            comp.request(url);
        }
    } else {
        // Запасний варіант, якщо компонент не стандартний
        Lampa.Noty.show('Цей компонент не підтримує швидке оновлення');
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
  
    // Кнопка
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
