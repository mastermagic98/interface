(function () {
    'use strict';

    // --- Локалізація ---
    Lampa.Lang.add({
        params_ani_on: { ru: 'Заменить иконку загрузчика', en: 'Replace loading icon', uk: 'Замінити іконку завантажувача' },
        params_ani_select: { ru: 'Выбор анимации', en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name: { ru: 'Анимация Загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        default_loader: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_svg_input: { ru: 'Введи URL SVG', en: 'Enter SVG URL', uk: 'Введи URL SVG' },
        svg_input_hint: { ru: 'Используйте URL SVG, например https://example.com/loader.svg', en: 'Use SVG URL, for example https://example.com/loader.svg', uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' }
    });

    // --- Inline SVG вставка ---
    function injectInlineSVG(element, url) {
        if (!element || !url) return;

        const insertSvg = svgText => {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgText, 'image/svg+xml');
                const svg = doc.querySelector('svg');
                if (!svg) return;

                svg.removeAttribute('width');
                svg.removeAttribute('height');
                svg.style.width = '100%';
                svg.style.height = '100%';
                svg.style.display = 'block';
                svg.style.fill = 'currentColor';
                svg.style.stroke = 'currentColor';

                element.innerHTML = '';
                element.appendChild(svg);
            } catch (e) {
                console.error('SVG inject error:', e);
            }
        };

        if (url.startsWith('http')) {
            fetch(url).then(r => r.text()).then(insertSvg).catch(console.error);
        } else if (url.startsWith('data:image/svg+xml')) {
            const decoded = decodeURIComponent(url.split(',')[1]);
            insertSvg(decoded);
        }
    }

    // --- Застосування лоадера по всій системі ---
    function applyInlineLoader(url) {
        const targets = document.querySelectorAll('.activity__loader, .player-video__loader, .lampac-balanser-loader, .loading-layer__ico, .modal-loading, .player-video__youtube-needclick > div');
        targets.forEach(el => injectInlineSVG(el, url));
    }

    // --- Прев’ю для налаштувань ---
    function insertActivityLoaderPreview(url) {
        const prv = document.querySelector('.settings-param[data-name="select_ani_mation"] .activity__loader_prv');
        if (prv) injectInlineSVG(prv, url);
    }

    // --- Оновлення кольору ---
    function updateLoaderColor() {
        const darkTheme = document.body.classList.contains('glass--style');
        const mainColor = darkTheme ? '#000' : (Lampa.Storage.get('color_plugin_main_color') || '#fff');
        document.documentElement.style.setProperty('--loader-color', mainColor);
    }

    // --- Вбудовані стилі для лоадера ---
    $('<style>\
    .activity__loader_prv { display:inline-flex; align-items:center; justify-content:center; width:23px; height:24px; color:var(--loader-color); }\
    .activity__loader_prv svg{ width:100%; height:100%; display:block; }\
    .activity__loader, .player-video__loader, .lampac-balanser-loader, .loading-layer__ico, .modal-loading { width:108px; height:108px; color:var(--loader-color); display:flex; align-items:center; justify-content:center; }\
    </style>').appendTo('head');

    // --- Модальне вікно вибору ---
    function createAniModal() {
        $('#aniload').remove();
        const style = document.createElement('style');
        style.id = 'aniload';
        style.textContent = `
        .ani_modal_root { padding:1em; }
        .ani_picker_container { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media (max-width:768px){.ani_picker_container{grid-template-columns:1fr;}}
        .ani_loader_square { width:35px; height:35px; border-radius:4px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--loader-color); }
        .ani_loader_square.focus { border: 2px solid var(--loader-color); transform: scale(1.1);}
        .svg_input { width:252px; height:35px; border-radius:8px; border:2px solid #ddd; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; background-color:#353535; }
        .svg_input .label { position:absolute; top:1px; font-size:10px; }
        .svg_input .value { position:absolute; bottom:1px; font-size:10px; }
        `;
        document.head.appendChild(style);

        if (!window.svg_loaders) window.svg_loaders = [];

        const svgContent = window.svg_loaders.map((url, idx) =>
            `<div class="ani_loader_square selector" tabindex="0" data-src="${url}" title="Loader ${idx+1}"></div>`
        ).join('');

        const defaultUrl = applyDefaultLoaderColor().src;
        const defaultButton = `<div class="ani_loader_square selector default" tabindex="0" data-src="${defaultUrl}" title="${Lampa.Lang.translate('default_loader')}"></div>`;
        const inputSvg = Lampa.Storage.get('ani_load_custom_svg','');
        const inputHtml = `<div class="ani_loader_square selector svg_input" tabindex="0">
            <div class="label">${Lampa.Lang.translate('custom_svg_input')}</div>
            <div class="value">${inputSvg || ''}</div>
        </div>`;

        const modalHtml = $('<div class="ani_modal_root"><div style="display:flex; gap:20px; justify-content:center;">' + defaultButton + inputHtml + '</div><div class="ani_picker_container">' + svgContent + '</div></div>');

        Lampa.Modal.open({
            title: Lampa.Lang.translate('params_ani_select'),
            size: 'medium',
            align: 'center',
            html: modalHtml,
            className: 'ani_picker_modal',
            onBack: function(){ Lampa.Modal.close(); },
            onSelect: function(elements){
                if(!elements || elements.length === 0) return;
                const el = elements[0];
                if(el.classList.contains('svg_input')){
                    const val = prompt('Enter SVG URL', Lampa.Storage.get('ani_load_custom_svg',''));
                    if(val && val.endsWith('.svg')){
                        Lampa.Storage.set('ani_load_custom_svg', val);
                        Lampa.Storage.set('ani_load', val);
                        applyInlineLoader(val);
                        insertActivityLoaderPreview(val);
                    }
                } else {
                    const url = el.dataset.src;
                    if(url){
                        Lampa.Storage.set('ani_load', url);
                        applyInlineLoader(url);
                        insertActivityLoaderPreview(url);
                    }
                }
                Lampa.Modal.close();
            }
        });
    }

    // --- Отримати дефолтний loader ---
    function applyDefaultLoaderColor() {
        const mainColor = '#fff';
        const defaultSvg = '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="5"><animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" values="0 50 50;360 50 50"/></circle></svg>';
        return { src: 'data:image/svg+xml,' + encodeURIComponent(defaultSvg) };
    }

    // --- Застосування поточного loader ---
    function applyCurrentLoader() {
        const url = Lampa.Storage.get('ani_load') || applyDefaultLoaderColor().src;
        applyInlineLoader(url);
        insertActivityLoaderPreview(url);
        updateLoaderColor();
    }

    // --- Ініціалізація ---
    function aniLoad() {
        updateLoaderColor();
        applyCurrentLoader();
        createAniModal();

        // MutationObserver для нових елементів
        const observer = new MutationObserver(() => { if(Lampa.Storage.get('ani_active')) applyCurrentLoader(); });
        observer.observe(document.body,{ childList:true, subtree:true });
    }

    if(window.appready){ aniLoad(); }
    else{ Lampa.Listener.follow('app', e => { if(e.type==='ready') aniLoad(); }); }

    Lampa.Storage.listener.follow('change', e => {
        if(e.name==='color_plugin_main_color' || e.name==='interface_glass'){ updateLoaderColor(); applyCurrentLoader(); }
    });

})();
