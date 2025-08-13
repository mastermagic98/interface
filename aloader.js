(function () {
    'use strict';

    Lampa.Lang.add({
        params_ani_on: {
            ru: 'Включить',
            en: 'Enable',
            uk: 'Увімкнути'
        },
        params_ani_select: {
            ru: 'Выбор анимации',
            en: 'Select loading animation',
            uk: 'Вибір анімації завантаження'
        },
        params_ani_name: {
            ru: 'Анимация Загрузки',
            en: 'Loading animation',
            uk: 'Анімація завантаження'
        }
    });

    // Список SVG (вбудовані через data URI)
    var svg_links = [
        'data:image/svg+xml,' + encodeURIComponent('<svg width="120" height="30" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg" fill="#fff"><circle cx="15" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="60" cy="15" r="9" fill-opacity="0.3"><animate attributeName="r" from="9" to="9" begin="0s" dur="0.8s" values="9;15;9" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="0.5" to="0.5" begin="0s" dur="0.8s" values=".5;1;.5" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="105" cy="15" r="15"><animate attributeName="r" from="15" to="15" begin="0s" dur="0.8s" values="15;9;15" calcMode="linear" repeatCount="indefinite" /><animate attributeName="fill-opacity" from="1" to="1" begin="0s" dur="0.8s" values="1;.5;1" calcMode="linear" repeatCount="indefinite" /></circle></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a"><stop stop-color="#fff" stop-opacity="0" offset="0%"/><stop stop-color="#fff" stop-opacity=".631" offset="63.146%"/><stop stop-color="#fff" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)"><path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" /></path><circle fill="#fff" cx="36" cy="18" r="1"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" /></circle></g></g></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="58" height="58" viewBox="0 0 58 58" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g transform="translate(2 1)" stroke="#FFF" stroke-width="1.5"><circle cx="42.601" cy="11.462" r="5" fill-opacity="1" fill="#fff"><animate attributeName="fill-opacity" begin="0s" dur="1.3s" values="1;0;0;0;0;0;0;0" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="49.063" cy="27.063" r="5" fill-opacity="0" fill="#fff"><animate attributeName="fill-opacity" begin="0s" dur="1.3s" values="0;1;0;0;0;0;0;0" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="42.601" cy="42.663" r="5" fill-opacity="0" fill="#fff"><animate attributeName="fill-opacity" begin="0s" dur="1.3s" values="0;0;1;0;0;0;0;0" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="27" cy="49.125" r="5" fill-opacity="0" fill="#fff"><animate attributeName="fill-opacity" begin="0s" dur="1.3s" values="0;0;0;1;0;0;0;0" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="11.399" cy="42.663" r="5" fill-opacity="0" fill="#fff"><animate attributeName="fill-opacity" begin="0s" dur="1.3s" values="0;0;0;0;1;0;0;0" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="4.938" cy="27.063" r="5" fill-opacity="0" fill="#fff"><animate attributeName="fill-opacity" begin="0s" dur="1.3s" values="0;0;0;0;0;1;0;0" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="11.399" cy="11.462" r="5" fill-opacity="0" fill="#fff"><animate attributeName="fill-opacity" begin="0s" dur="1.3s" values="0;0;0;0;0;0;1;0" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="27" cy="5" r="5" fill-opacity="0" fill="#fff"><animate attributeName="fill-opacity" begin="0s" dur="1.3s" values="0;0;0;0;0;0;0;1" calcMode="linear" repeatCount="indefinite" /></circle></g></g></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="45" height="45" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2"><circle cx="22" cy="22" r="6" stroke-opacity="0"><animate attributeName="r" begin="1.5s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite" /><animate attributeName="stroke-opacity" begin="1.5s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite" /><animate attributeName="stroke-width" begin="1.5s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="22" cy="22" r="6" stroke-opacity="0"><animate attributeName="r" begin="3s" dur="3s" values="6;22" calcMode="linear" repeatCount="indefinite" /><animate attributeName="stroke-opacity" begin="3s" dur="3s" values="1;0" calcMode="linear" repeatCount="indefinite" /><animate attributeName="stroke-width" begin="3s" dur="3s" values="2;0" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="22" cy="22" r="8"><animate attributeName="r" begin="0s" dur="1.5s" values="6;1;2;3;4;5;6" calcMode="linear" repeatCount="indefinite" /></circle></g></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd" stroke-width="2"><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" /><animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" /></circle><circle cx="22" cy="22" r="1"><animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite" /><animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite" /></circle></g></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="38" height="38" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="140" height="64" viewBox="0 0 140 64" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path d="M30.262 57.02L7.195 40.723c-5.84-3.976-7.56-12.06-3.842-18.063 3.715-6 11.467-7.65 17.306-3.68l4.52 3.76 2.6-5.274c3.717-6.002 11.47-7.65 17.305-3.68 5.84 3.97 7.56 12.054 3.842 18.062L34.49 56.118c-.897 1.512-2.793 1.915-4.228.9z" fill-opacity=".5"><animate attributeName="fill-opacity" begin="0s" dur="1.4s" values="0.5;1;0.5" calcMode="linear" repeatCount="indefinite" /></path><path d="M105.512 56.12l-14.44-24.272c-3.716-6.008-1.996-14.093 3.843-18.062 5.835-3.97 13.588-2.322 17.306 3.68l2.6 5.274 4.52-3.76c5.84-3.97 13.592-2.32 17.307 3.68 3.718 6.003 1.998 14.088-3.842 18.064L109.74 57.02c-1.434 1.014-3.33.61-4.228-.9z" fill-opacity=".5"><animate attributeName="fill-opacity" begin="0.7s" dur="1.4s" values="0.5;1;0.5" calcMode="linear" repeatCount="indefinite" /></path><path d="M67.408 57.834l-23.01-24.98c-5.864-6.15-5.864-16.108 0-22.248 5.86-6.14 15.37-6.14 21.234 0L70 16.168l4.368-5.562c5.863-6.14 15.375-6.14 21.235 0 5.863 6.14 5.863 16.098 0 22.247l-23.007 24.98c-1.43 1.556-3.757 1.556-5.188 0z" /></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="105" height="105" viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" fill="#fff"><circle cx="12.5" cy="12.5" r="12.5"><animate attributeName="fill-opacity" begin="0s" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5"><animate attributeName="fill-opacity" begin="100ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="52.5" cy="12.5" r="12.5"><animate attributeName="fill-opacity" begin="300ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="52.5" cy="52.5" r="12.5"><animate attributeName="fill-opacity" begin="600ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="92.5" cy="12.5" r="12.5"><animate attributeName="fill-opacity" begin="800ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="92.5" cy="52.5" r="12.5"><animate attributeName="fill-opacity" begin="400ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="12.5" cy="92.5" r="12.5"><animate attributeName="fill-opacity" begin="700ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="52.5" cy="92.5" r="12.5"><animate attributeName="fill-opacity" begin="500ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="92.5" cy="92.5" r="12.5"><animate attributeName="fill-opacity" begin="200ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="135" height="135" viewBox="0 0 135 135" xmlns="http://www.w3.org/2000/svg" fill="#fff"><path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z"><animateTransform attributeName="transform" type="rotate" from="0 67 67" to="-360 67 67" dur="2.5s" repeatCount="indefinite"/></path><path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z"><animateTransform attributeName="transform" type="rotate" from="0 67 67" to="360 67 67" dur="8s" repeatCount="indefinite"/></path></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="135" height="140" viewBox="0 0 135 140" xmlns="http://www.w3.org/2000/svg" fill="#fff"><rect y="10" width="15" height="120" rx="6"><animate attributeName="height" begin="0.5s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0.5s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite" /></rect><rect x="30" y="10" width="15" height="120" rx="6"><animate attributeName="height" begin="0.25s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0.25s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite" /></rect><rect x="60" width="15" height="140" rx="6"><animate attributeName="height" begin="0s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite" /></rect><rect x="90" y="10" width="15" height="120" rx="6"><animate attributeName="height" begin="0.25s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0.25s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite" /></rect><rect x="120" y="10" width="15" height="120" rx="6"><animate attributeName="height" begin="0.5s" dur="1s" values="120;110;100;90;80;70;60;50;40;140;120" calcMode="linear" repeatCount="indefinite" /><animate attributeName="y" begin="0.5s" dur="1s" values="10;15;20;25;30;35;40;45;50;0;10" calcMode="linear" repeatCount="indefinite" /></rect></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="57" height="57" viewBox="0 0 57 57" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g fill="none" fill-rule="evenodd"><g transform="translate(1 1)" stroke-width="2"><circle cx="5" cy="50" r="5"><animate attributeName="cy" begin="0s" dur="2.2s" values="50;5;50;50" calcMode="linear" repeatCount="indefinite" /><animate attributeName="cx" begin="0s" dur="2.2s" values="5;27;49;5" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="27" cy="5" r="5"><animate attributeName="cy" begin="0s" dur="2.2s" from="5" to="5" values="5;50;50;5" calcMode="linear" repeatCount="indefinite" /><animate attributeName="cx" begin="0s" dur="2.2s" from="27" to="27" values="27;49;5;27" calcMode="linear" repeatCount="indefinite" /></circle><circle cx="49" cy="50" r="5"><animate attributeName="cy" begin="0s" dur="2.2s" values="50;50;5;50" calcMode="linear" repeatCount="indefinite" /><animate attributeName="cx" from="49" to="49" begin="0s" dur="2.2s" values="49;5;27;49" calcMode="linear" repeatCount="indefinite" /></circle></g></g></svg>'),
        'data:image/svg+xml,' + encodeURIComponent('<svg width="55" height="80" viewBox="0 0 55 80" xmlns="http://www.w3.org/2000/svg" fill="#FFF"><g transform="matrix(1 0 0 -1 0 80)"><rect width="10" height="20" rx="3"><animate attributeName="height" begin="0s" dur="4.3s" values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20" calcMode="linear" repeatCount="indefinite" /></rect><rect x="15" width="10" height="80" rx="3"><animate attributeName="height" begin="0s" dur="2s" values="80;55;33;5;75;23;73;33;12;14;60;80" calcMode="linear" repeatCount="indefinite" /></rect><rect x="30" width="10" height="50" rx="3"><animate attributeName="height" begin="0s" dur="1.4s" values="50;34;78;23;56;23;34;76;80;54;21;50" calcMode="linear" repeatCount="indefinite" /></rect><rect x="45" width="10" height="30" rx="3"><animate attributeName="height" begin="0s" dur="2s" values="30;45;13;80;56;72;45;76;34;23;67;30" calcMode="linear" repeatCount="indefinite" /></rect></g></svg>')
    ];

    function hexToCssFilter(hexColor, calibrate) {
        if (!hexColor) return 'none';
        var hex = hexColor.replace('#', '');
        if (hex.length !== 6) return 'none';
        var r = parseInt(hex.substring(0, 2), 16) / 255;
        var g = parseInt(hex.substring(2, 4), 16) / 255;
        var b = parseInt(hex.substring(4, 6), 16) / 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var delta = max - min;
        var hue = 0;
        if (delta !== 0) {
            if (max === r) hue = ((g - b) / delta) % 6;
            else if (max === g) hue = (b - r) / delta + 2;
            else hue = (r - g) / delta + 4;
            hue = Math.round(hue * 60);
            if (hue < 0) hue += 360;
        }
        var saturation = max === 0 ? 0 : delta / max;
        var brightness = max;
        var sepia = 1;
        var hueRotate = hue - 40;
        var saturateValue = saturation * 10;
        var brightnessValue = brightness * 0.8 + 0.2;
        if (calibrate) {
            if (hue >= 180 && hue <= 240) {
                hueRotate += 5;
                saturateValue *= 1.2;
                sepia /= 2.5;
                brightnessValue /= 1.6;
            } else if (hue >= 240 && hue <= 300) {
                hueRotate += 5;
                saturateValue *= 1.2;
                brightnessValue *= 1.09;
                sepia /= 2.5;
            } else if (hue <= 20 || hue >= 340) {
                hueRotate -= 10;
                brightnessValue /= 4.55;
            } else if (hue >= 70 && hue <= 160) {
                hueRotate -= 15;
                saturateValue *= 0.9;
                brightnessValue *= 1.09;
                sepia /= 2.5;
            } else if (hue >= 14 && hue <= 60) {
                hueRotate -= 15;
                saturateValue *= 0.9;
                brightnessValue /= 2.45;
                sepia /= 1.25;
            } else if (hue >= 300 && hue <= 360) {
                hueRotate -= 15;
                saturateValue *= 0.9;
                brightnessValue /= 4.6;
            }
        }
        hueRotate = Math.max(0, Math.min(360, hueRotate));
        saturateValue = Math.max(0, Math.min(20, saturateValue));
        brightnessValue = Math.max(0, Math.min(2, brightnessValue));
        return 'brightness(' + brightnessValue.toFixed(2) + ') sepia(' + sepia + ') hue-rotate(' + Math.round(hueRotate) + 'deg) saturate(' + saturateValue.toFixed(2) + ')';
    }

    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_grid">{ani_svg_content}</div></div>');

    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';
        style.textContent = '.ani_row { display: grid; grid-template-columns: repeat(5, 1fr); grid-auto-rows: 80px; gap: 15px; justify-items: center; width: 100%; padding: 10px; }' +
                            '.ani_svg { display: flex; align-items: center; justify-content: center; width: 100%; height: 80px; }' +
                            '.ani_svg img { max-width: 100%; max-height: 80px; object-fit: contain; }' +
                            '.ani_svg.focus { background-color: #353535; border: 1px solid #9e9e9e; }';
        document.head.appendChild(style);
        console.log('Модальне вікно анімацій створено, кількість SVG: ' + svg_links.length);
    }

    function createSvgHtml(src) {
        return '<div class="ani_svg selector" tabindex="0"><img src="' + src + '" style="visibility:visible; max-width:100%; max-height:80px;"></div>';
    }

    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    function insert_activity_loader(url, filter) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var newStyle = '.activity__loader { background: url(\'' + escapedUrl + '\') no-repeat 50% 50% !important; transform: scale(3); -webkit-transform: scale(3); filter: ' + hexToCssFilter(filter) + '; }' +
                       '.modal-loading { background: url(\'' + escapedUrl + '\') no-repeat 50% 50% !important; transform: scale(3); -webkit-transform: scale(3); filter: ' + hexToCssFilter(filter) + '; }';
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');
        console.log('Завантажувач встановлено: ' + url);
    }

    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        var newStyle = '.activity__loader_prv { position: absolute; top: 0; width: 100%; height: 100%; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; z-index: 9999; background-size: contain; max-height: 80px; }';
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
    }

    function remove_activity_loader() {
        var styleElement = document.getElementById('aniload-id');
        if (styleElement) styleElement.remove();
    }

    function aniLoad() {
        var icon_plugin = '<svg height="24" viewBox="0 0 24 26" fill="white" xmlns="http://www.w3.org/2000/svg"><path d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"/></svg>';
        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon_plugin
            });
            console.log('Компонент ani_load_menu додано');
        } catch (e) {
            console.error('Помилка додавання ani_load_menu: ' + e.message);
        }

        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: {
                    name: 'ani_active',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('params_ani_on')
                },
                onChange: function (item) {
                    if (item === 'true') {
                        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                            insert_activity_loader(Lampa.Storage.get('ani_load'), getComputedStyle(document.documentElement).getPropertyValue('--main-color'));
                        }
                    } else {
                        remove_activity_loader();
                    }
                }
            });
            console.log('Параметр ani_active додано');
        } catch (e) {
            console.error('Помилка додавання ani_active: ' + e.message);
        }

        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: {
                    name: 'select_ani_mation',
                    type: 'button'
                },
                field: {
                    name: Lampa.Lang.translate('params_ani_select'),
                    description: '<div class="activity__loader_prv"></div>'
                },
                onRender: function (item) {
                    insert_activity_loader_prv(Lampa.Storage.get('ani_load', svg_links[0]));
                },
                onChange: function () {
                    create_ani_modal();
                    var groupedSvgLinks = chunkArray(svg_links, 5);
                    var svg_content = groupedSvgLinks.map(function (group) {
                        var groupContent = group.map(createSvgHtml).join('');
                        return '<div class="ani_row">' + groupContent + '</div>';
                    }).join('');
                    var ani_templates = Lampa.Template.get('ani_modal', {
                        ani_svg_content: svg_content
                    });
                    try {
                        Lampa.Modal.open({
                            title: '',
                            size: 'medium',
                            align: 'center',
                            html: ani_templates,
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                            },
                            onSelect: function (a) {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var imgElement = a[0].querySelector('img');
                                    if (imgElement) {
                                        var srcValue = imgElement.getAttribute('src');
                                        Lampa.Storage.set('ani_load', srcValue);
                                        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
                                            insert_activity_loader(Lampa.Storage.get('ani_load'), getComputedStyle(document.documentElement).getPropertyValue('--main-color'));
                                            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                                        }
                                        console.log('Вибрано анімацію: ' + srcValue);
                                    }
                                }
                            }
                        });
                        console.log('Модальне вікно відкрито, відображено ' + svg_links.length + ' анімацій');
                    } catch (e) {
                        console.error('Помилка відкриття модального вікна: ' + e.message);
                    }
                }
            });
            console.log('Параметр select_ani_mation додано');
        } catch (e) {
            console.error('Помилка додавання select_ani_mation: ' + e.message);
        }

        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            insert_activity_loader(Lampa.Storage.get('ani_load'), getComputedStyle(document.documentElement).getPropertyValue('--main-color'));
        }
    }

    function byTheme() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active')) {
            var main_color = getComputedStyle(document.documentElement).getPropertyValue('--main-color');
            insert_activity_loader(Lampa.Storage.get('ani_load'), main_color);
        }
    }

    if (window.appready) {
        console.log('Lampa готова, виклик aniLoad');
        aniLoad();
        byTheme();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                console.log('Lampa готова, виклик aniLoad');
                aniLoad();
                byTheme();
            }
        });
    }

    document.documentElement.addEventListener('style-change', function () {
        byTheme();
    });
})();
