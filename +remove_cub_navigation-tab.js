function removeCubTab(){
    'use strict';

    function remove(){
        var buttons = document.querySelectorAll('.navigation-tabs__button.selector');

        buttons.forEach(function(btn){
            if(btn.textContent.trim().toUpperCase() === 'CUB'){

                var prev = btn.previousElementSibling;
                var next = btn.nextElementSibling;

                // якщо CUB не перша вкладка — прибираємо роздільник перед нею
                if(prev && prev.classList.contains('navigation-tabs__split')){
                    prev.remove();
                }
                // якщо перша — прибираємо наступний
                else if(next && next.classList.contains('navigation-tabs__split')){
                    next.remove();
                }

                btn.remove();
            }
        });
    }

    remove();

    new MutationObserver(remove).observe(document.body,{
        childList:true,
        subtree:true
    });
}
Lampa.Listener.follow('app', function(e){
    if(e.type === 'ready'){
        removeCubTab();
    }
});
