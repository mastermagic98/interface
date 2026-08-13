(function () {  
  'use strict';  
  if (window.kmmRefreshPluginLoaded) return;  
  window.kmmRefreshPluginLoaded = true;  
  
  var Lampa = window.Lampa;  

  // Функція очищення об'єкта від циклічних DOM-посилань (щоб Лампа не падала при replace)
  function sanitizeActivity(act) {
      if (!act || !act.activity || !act.activity.movie) return;

      function decycle(obj) {
          var cache = [];
          return JSON.parse(JSON.stringify(obj, function(key, value) {
              if (typeof value === 'object' && value !== null) {
                  if (cache.indexOf(value) !== -1) return; // Ігноруємо циклічні посилання
                  if (value instanceof Element) return; // Ігноруємо HTML-елементи
                  if (typeof jQuery !== 'undefined' && value instanceof jQuery) return; // Ігноруємо jQuery
                  cache.push(value);
              }
              return value;
          }));
      }

      try {
          // Очищаємо ТІЛЬКИ об'єкт movie. 
          // НЕ чіпаємо саму активність, щоб не видалити важливі методи Лампи (render, request, reset)
          act.activity.movie = decycle(act.activity.movie);
      } catch(e) { }
  }

  // Примусове оновлення сторінки з новим параметром
  function forceRefresh() {
    var act = Lampa.Activity.active();
    if (!act || !act.activity) return;

    var newUrl = act.activity.source || act.activity.url || '';
    if (newUrl) {
        newUrl = newUrl.split('&kmm_rand=')[0] + '&kmm_rand=' + Date.now();
    } else if (act.activity.movie && act.activity.movie.id) {
        newUrl = 'http://91.238.104.117:9118/lite/kmm_uakino?id=' + act.activity.movie.id + '&kmm_rand=' + Date.now();
    }

    act.activity.url = newUrl;
    act.activity.source = newUrl;

    // Видаляємо стару кнопку з екрану
    $('.filter--kmm-update').remove();

    // Очищаємо бруд від інших плагінів тільки всередині .movie
    sanitizeActivity(act);

    // Викликаємо рідний метод Лампи
    Lampa.Activity.replace();
  }
  
  // 1) Кнопка "ОНОВИТИ" в контекстному меню "Дія"
  var prevPush = window.lampac_online_context_menu ? window.lampac_online_context_menu.push : null;  
  var prevOnSelect = window.lampac_online_context_menu ? window.lampac_online_context_menu.onSelect : null;  
  
  window.lampac_online_context_menu = {  
    push: function (menu, extra, params) {  
      if (typeof prevPush === 'function') {
          try { prevPush.apply(this, arguments); } catch(e) {}
      }
      
      // Перевіряємо, чи балансер UAkinoTV зараз на екрані
      var act = Lampa.Activity.active();
      var render = act && act.activity && act.activity.render ? act.activity.render() : null;
      var isUakino = false;
      if (render) {
          var sortText = render.find('.filter--sort').text() || '';
          if (sortText.toLowerCase().indexOf('uakino') > -1) isUakino = true;
      }

      if (isUakino) {
          menu.push({ title: 'Оновити джерело', kmm_refresh: true });  
      }
    },  
    onSelect: function (a, params) {  
      if (a.kmm_refresh) {
        Lampa.Select.close();
        setTimeout(function(){ forceRefresh(); }, 50);
        return; // Зупиняємо виконання, щоб не викликати помилок інших плагінів
      }  
      if (typeof prevOnSelect === 'function') {
          try { prevOnSelect.apply(this, arguments); } catch(e) {}
      }
    }  
  };  
  
  // 2) DOM-ін'єкція: моніторинг екрану кожні 500мс
  setInterval(function() {
      var act = Lampa.Activity.active();
      if (!act || !act.activity) return;

      var render = act.activity.render ? act.activity.render() : null;
      if (!render) return;

      // Шукаємо кнопку "Джерело"
      var sortBtn = render.find('.filter--sort');
      if (!sortBtn.length) return; // Це не онлайн-плеєр, якщо немає вибору балансера

      var torrentFilter = sortBtn.parent();
      if (!torrentFilter.length) return;

      // Читаємо назву вибраного балансера на екрані
      var sortText = sortBtn.text() || '';
      var isUakino = sortText.toLowerCase().indexOf('uakino') > -1;
      var hasButton = torrentFilter.find('.filter--kmm-update').length > 0;

      if (isUakino && !hasButton) {
          // Якщо UAkinoTV вибрано, але кнопки немає — додаємо
          var svgIcon = '<svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:1.3em;height:1.3em;margin-right:0.5em;"><path d="M8.5 0.5L6.5 2.5M6.5 2.5L8.5 4.5M6.5 2.5H9.5C11.1569 2.5 12.5 3.84315 12.5 5.5V10.5M2.5 4.5C3.60457 4.5 4.5 3.60457 4.5 2.5C4.5 1.39543 3.60457 0.5 2.5 0.5C1.39543 0.5 0.5 1.39543 0.5 2.5C0.5 3.60457 1.39543 4.5 2.5 4.5ZM2.5 4.5V9.5C2.5 11.1569 3.84315 12.5 5.5 12.5H8M6.5 14.5L8.5 12.5L6.5 10.5M12.5 10.5C11.3954 10.5 10.5 11.3954 10.5 12.5C10.5 13.6046 11.3954 14.5 12.5 14.5C13.6046 14.5 14.5 13.6046 14.5 12.5C14.5 11.3954 13.6046 10.5 12.5 10.5Z" stroke="currentColor"></path></svg>';
          var btn = $('<div class="simple-button simple-button--filter selector filter--kmm-update">' + svgIcon + '<span>Оновити</span></div>');  
          
          btn.on('hover:enter click', function (e) {  
              e.stopPropagation();
              forceRefresh();
          });  
          
          torrentFilter.append(btn);
      } else if (!isUakino && hasButton) {
          // Якщо вибрали інший балансер, а кнопка висить — видаляємо
          torrentFilter.find('.filter--kmm-update').remove();
      }
  }, 500);

})();
