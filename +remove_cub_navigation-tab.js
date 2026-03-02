function removeCubTab(){
    'use strict';

    function remove(){
        var buttons = document.querySelectorAll('.navigation-tabs__button.selector');

        buttons.forEach(function(btn){
            if(btn.textContent.trim().toUpperCase() === 'CUB'){
                
                // Видаляємо наступний роздільник, якщо він є
                var next = btn.nextElementSibling;
                if(next && next.classList.contains('navigation-tabs__split')){
                    next.remove();
                }

                // Якщо роздільник перед кнопкою
                var prev = btn.previousElementSibling;
                if(prev && prev.classList.contains('navigation-tabs__split')){
                    prev.remove();
                }

                btn.remove();
            }
        });
    }

    // первинний запуск
    remove();

    // слідкуємо за перерендером
    var observer = new MutationObserver(function(){
        remove();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
