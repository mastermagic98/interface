(function () {
    'use strict';

    // Функція для конвертації HEX у RGB
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }

    // Функція для отримання RGB для SVG-фільтра
    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') {
            return { r: 255, g: 255, b: 255 }; // Білий для темної теми
        }
        return hexToRgb(mainColor);
    }

    // Функція для створення SVG для дефолтної іконки
    function applyDefaultLoaderColor() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
                         '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
                         '<circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
                         '  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
                         '</circle>' +
                         '</svg>';
        var encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encodedSvg, filter: '' };
    }

    // Функція для встановлення кастомного завантажувача
    function setCustomLoader(url) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        var newStyle = 'body .activity__loader { display: none !important; background-image: none !important; }' +
                       'body .activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: transparent !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position-x: 50%; background-position-y: 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; filter: ' + filterValue + '; z-index: 9999 !important; }' +
                       'body .lampac-balanser-loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; background-color: transparent !important; filter: ' + filterValue + ' !important; }' +
                       'body .player-video .player-video__loader, body .player-video.video--load .player-video__loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; background-color: transparent !important; filter: ' + filterValue + ' !important; backdrop-filter: none !important; z-index: 9999 !important; display: block !important; }' +
                       'body .loading-layer .loading-layer__ico, body .player-video .loading-layer__ico { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; background-color: transparent !important; filter: ' + filterValue + ' !important; width: 1.9em !important; height: 1.9em !important; display: block !important; }' +
                       'body .loading-layer__ico:not(.custom), body .player-video__loader:not(.custom) { background-image: none !important; display: none !important; }';
        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');

        console.log('setCustomLoader викликано з URL:', url);

        // Застосовуємо стилі до всіх .player-video__loader
        var playerLoaderElements = document.querySelectorAll('.player-video__loader');
        for (var i = 0; i < playerLoaderElements.length; i++) {
            playerLoaderElements[i].classList.add('custom');
            playerLoaderElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            playerLoaderElements[i].style.filter = filterValue;
            playerLoaderElements[i].style.backgroundColor = 'transparent';
            playerLoaderElements[i].style.display = 'block';
            console.log('Стилі застосовано до .player-video__loader:', playerLoaderElements[i].style.backgroundImage, 'filter:', playerLoaderElements[i].style.filter, 'backgroundColor:', playerLoaderElements[i].style.backgroundColor, 'display:', playerLoaderElements[i].style.display);
            console.log('Computed styles:', getComputedStyle(playerLoaderElements[i]).backgroundImage, getComputedStyle(playerLoaderElements[i]).backgroundColor, getComputedStyle(playerLoaderElements[i]).display);
        }

        // Застосовуємо стилі до .activity__loader
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            element.style.filter = filterValue;
            element.style.backgroundColor = 'transparent';
            if (Lampa.Storage.get('ani_active')) {
                element.classList.add('active');
                element.style.display = 'block';
            }
            console.log('Стилі застосовано до .activity__loader:', element.style.backgroundImage, 'backgroundColor:', element.style.backgroundColor, 'display:', element.style.display);
            console.log('Computed styles:', getComputedStyle(element).backgroundImage, getComputedStyle(element).backgroundColor, getComputedStyle(element).display);
        }

        // Застосовуємо стилі до .lampac-balanser-loader
        var balanserElements = document.querySelectorAll('.lampac-balanser-loader');
        for (var i = 0; i < balanserElements.length; i++) {
            balanserElements[i].classList.add('custom');
            balanserElements[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            balanserElements[i].style.filter = filterValue;
            balanserElements[i].style.backgroundColor = 'transparent';
            console.log('Стилі застосовано до .lampac-balanser-loader:', balanserElements[i].style.backgroundImage, 'backgroundColor:', balanserElements[i].style.backgroundColor);
            console.log('Computed styles:', getComputedStyle(balanserElements[i]).backgroundImage, getComputedStyle(balanserElements[i]).backgroundColor);
        }

        // Застосовуємо стилі до .loading-layer__ico
        var loadingLayerIco = document.querySelectorAll('.loading-layer__ico');
        for (var i = 0; i < loadingLayerIco.length; i++) {
            loadingLayerIco[i].classList.add('custom');
            loadingLayerIco[i].style.backgroundImage = 'url(\'' + escapedUrl + '\')';
            loadingLayerIco[i].style.filter = filterValue;
            loadingLayerIco[i].style.backgroundColor = 'transparent';
            loadingLayerIco[i].style.display = 'block';
            console.log('Стилі застосовано до .loading-layer__ico:', loadingLayerIco[i].style.backgroundImage, 'filter:', loadingLayerIco[i].style.filter, 'backgroundColor:', loadingLayerIco[i].style.backgroundColor, 'display:', loadingLayerIco[i].style.display);
            console.log('Computed styles:', getComputedStyle(loadingLayerIco[i]).backgroundImage, getComputedStyle(loadingLayerIco[i]).backgroundColor, getComputedStyle(loadingLayerIco[i]).display);
        }
    }

    // Функція для видалення стилів завантажувача
    function remove_activity_loader() {
        var styleElement = document.getElementById('aniload-id');
        if (styleElement) styleElement.remove();
        var element = document.querySelector('.activity__loader');
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
            element.style.backgroundImage = '';
            element.style.filter = '';
            element.style.backgroundColor = 'transparent';
            console.log('Скинуто стилі для .activity__loader, backgroundColor:', element.style.backgroundColor);
        }
        var balanserElements = document.querySelectorAll('.lampac-balanser-loader');
        for (var i = 0; i < balanserElements.length; i++) {
            balanserElements[i].classList.remove('custom');
            balanserElements[i].style.backgroundImage = '';
            balanserElements[i].style.filter = '';
            balanserElements[i].style.backgroundColor = 'transparent';
            console.log('Скинуто стилі для .lampac-balanser-loader, backgroundColor:', balanserElements[i].style.backgroundColor);
        }
        var playerLoaderElements = document.querySelectorAll('.player-video__loader');
        for (var i = 0; i < playerLoaderElements.length; i++) {
            playerLoaderElements[i].classList.remove('custom');
            playerLoaderElements[i].style.backgroundImage = '';
            playerLoaderElements[i].style.filter = '';
            playerLoaderElements[i].style.backgroundColor = 'transparent';
            playerLoaderElements[i].style.display = 'none';
            console.log('Скинуто стилі для .player-video__loader, backgroundColor:', playerLoaderElements[i].style.backgroundColor);
        }
        var loadingLayerIco = document.querySelectorAll('.loading-layer__ico');
        for (var i = 0; i < loadingLayerIco.length; i++) {
            loadingLayerIco[i].classList.remove('custom');
            loadingLayerIco[i].style.backgroundImage = '';
            loadingLayerIco[i].style.filter = '';
            loadingLayerIco[i].style.backgroundColor = 'transparent';
            loadingLayerIco[i].style.display = 'none';
            console.log('Скинуто стилі для .loading-layer__ico, backgroundColor:', loadingLayerIco[i].style.backgroundColor);
        }
        console.log('Стилі завантажувача видалено');
    }

    // Ініціалізація плагіна
    function initPlayerLoader() {
        // Спостерігач за змінами DOM
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.loading-layer') || node.matches('.player-video'))) {
                                console.log('Виявлено новий елемент:', node.className, node.outerHTML);
                                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                    setTimeout(function () {
                                        setCustomLoader(Lampa.Storage.get('ani_load'));
                                        console.log('setCustomLoader викликано для нового елемента:', node.className);
                                    }, 200);
                                }
                            }
                        });
                        mutation.removedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.loading-layer') || node.matches('.player-video'))) {
                                console.log('Видалено елемент:', node.className);
                                remove_activity_loader();
                            }
                        });
                    } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (mutation.target.classList.contains('player-video') && mutation.target.classList.contains('video--load')) {
                            console.log('Виявлено додавання класу video--load до .player-video');
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                setTimeout(function () {
                                    setCustomLoader(Lampa.Storage.get('ani_load'));
                                    console.log('Застосовано setCustomLoader для .player-video__loader або .loading-layer__ico');
                                    var playerVideo = document.querySelector('.player-video.video--load');
                                    if (playerVideo) {
                                        console.log('DOM .player-video:', playerVideo.outerHTML);
                                        var loader = playerVideo.querySelector('.player-video__loader');
                                        var loadingIco = playerVideo.querySelector('.loading-layer__ico');
                                        if (loader) {
                                            console.log('.player-video__loader знайдено, backgroundImage:', loader.style.backgroundImage, 'filter:', loader.style.filter, 'backgroundColor:', loader.style.backgroundColor, 'display:', loader.style.display);
                                            console.log('Computed styles:', getComputedStyle(loader).backgroundImage, getComputedStyle(loader).backgroundColor, getComputedStyle(loader).display);
                                        } else {
                                            console.log('.player-video__loader не знайдено');
                                        }
                                        if (loadingIco) {
                                            console.log('.loading-layer__ico знайдено, backgroundImage:', loadingIco.style.backgroundImage, 'filter:', loadingIco.style.filter, 'backgroundColor:', loadingIco.style.backgroundColor, 'display:', loadingIco.style.display);
                                            console.log('Computed styles:', getComputedStyle(loadingIco).backgroundImage, getComputedStyle(loadingIco).backgroundColor, getComputedStyle(loadingIco).display);
                                        } else {
                                            console.log('.loading-layer__ico не знайдено');
                                        }
                                    } else {
                                        console.log('.player-video.video--load не знайдено');
                                    }
                                    var loadingLayer = document.querySelector('.loading-layer');
                                    if (loadingLayer) {
                                        console.log('DOM .loading-layer:', loadingLayer.outerHTML);
                                    } else {
                                        console.log('.loading-layer не знайдено');
                                    }
                                }, 200);
                            }
                        } else if (mutation.target.classList.contains('player-video') && !mutation.target.classList.contains('video--load')) {
                            console.log('Виявлено видалення класу video--load з .player-video');
                            remove_activity_loader();
                        }
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
            console.log('MutationObserver ініціалізовано');
        }, 500);

        // Періодична перевірка
        setInterval(function () {
            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                var playerVideo = document.querySelector('.player-video.video--load');
                if (playerVideo) {
                    console.log('DOM .player-video:', playerVideo.outerHTML);
                    var loader = playerVideo.querySelector('.player-video__loader');
                    var loadingIco = playerVideo.querySelector('.loading-layer__ico');
                    if (loader) {
                        var computedBg = getComputedStyle(loader).backgroundImage;
                        var computedDisplay = getComputedStyle(loader).display;
                        if (computedBg.indexOf('lampa-main/img/loader.svg') !== -1) {
                            console.log('Виявлено стандартну іконку в .player-video__loader, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        } else if (getComputedStyle(loader).backgroundColor !== 'transparent') {
                            console.log('Виявлено некоректний backgroundColor в .player-video__loader, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        } else if (computedDisplay === 'none') {
                            console.log('Виявлено display: none в .player-video__loader, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        }
                    }
                    if (loadingIco) {
                        var computedBgIco = getComputedStyle(loadingIco).backgroundImage;
                        var computedDisplayIco = getComputedStyle(loadingIco).display;
                        if (computedBgIco.indexOf('lampa-main/img/loader.svg') !== -1) {
                            console.log('Виявлено стандартну іконку в .loading-layer__ico, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        } else if (getComputedStyle(loadingIco).backgroundColor !== 'transparent') {
                            console.log('Виявлено некоректний backgroundColor в .loading-layer__ico, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        } else if (computedDisplayIco === 'none') {
                            console.log('Виявлено display: none в .loading-layer__ico, застосовується setCustomLoader');
                            setCustomLoader(Lampa.Storage.get('ani_load'));
                        }
                    } else {
                        console.log('Перевірка .loading-layer__ico: null');
                    }
                } else {
                    console.log('Перевірка .player-video.video--load: null');
                }
                var loadingLayer = document.querySelector('.loading-layer');
                if (loadingLayer) {
                    console.log('DOM .loading-layer:', loadingLayer.outerHTML);
                } else {
                    console.log('.loading-layer не знайдено');
                }
            }
        }, 100);

        // Слухачі подій
        Lampa.Listener.follow('full', function (e) {
            var element = document.querySelector('.activity__loader');
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
                console.log('Стилі застосовано для full event: start');
            } else if (e.type === 'complete' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('Стилі видалено для full event: complete');
            }
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    console.log('setCustomLoader викликано для full event: start');
                }, 200);
            }
        });

        Lampa.Listener.follow('activity', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
                console.log('Стилі застосовано для activity event: start');
            } else if (event.type === 'loaded' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('Стилі видалено для activity event: loaded');
            }
            if (event.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    console.log('setCustomLoader викликано для activity event: start');
                }, 200);
            }
        });

        Lampa.Activity.listener.follow('push', function (event) {
            var element = document.querySelector('.activity__loader');
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg' && element) {
                element.classList.add('active');
                element.style.display = 'block';
                setCustomLoader(Lampa.Storage.get('ani_load'));
                console.log('Стилі застосовано для activity push: active');
            } else if (event.status === 'ready' && element) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('Стилі видалено для activity push: ready');
            }
            if (event.status === 'active' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () {
                    setCustomLoader(Lampa.Storage.get('ani_load'));
                    console.log('setCustomLoader викликано для activity push: active');
                }, 200);
            }
        });

        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'back') {
                var element = document.querySelector('.activity__loader');
                if (element) {
                    element.classList.remove('active');
                    element.style.display = 'none';
                    console.log('Стилі видалено для app event: back');
                }
            }
        });

        setInterval(function () {
            var element = document.querySelector('.activity__loader');
            if (element && element.classList.contains('active')) {
                element.classList.remove('active');
                element.style.display = 'none';
                console.log('Стилі видалено через setInterval');
            }
        }, 500);

        // Початкова ініціалізація
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            console.log('Початкове застосування кастомного завантажувача');
        } else {
            remove_activity_loader();
            console.log('Початкове видалення стилів завантажувача');
        }
    }

    // Запуск плагіна
    if (window.appready) {
        initPlayerLoader();
        console.log('Плагін player_loader ініціалізовано (appready)');
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initPlayerLoader();
                console.log('Плагін player_loader ініціалізовано (app event: ready)');
            }
        });
    }

    // Слухач зміни акцентного кольору
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'accent_color_selected') {
            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setCustomLoader(Lampa.Storage.get('ani_load'));
                console.log('Змінено accent_color_selected, застосовано кастомний завантажувач');
            } else {
                remove_activity_loader();
                console.log('Змінено accent_color_selected, видалено стилі завантажувача');
            }
        }
    });
})();
