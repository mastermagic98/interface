setTimeout(function () {
    var prv = document.querySelector('.settings-param.selector.settings-param--button .activity__loader_prv');
    if (prv) {
        console.log('Computed filter .activity__loader_prv:', getComputedStyle(prv).filter);
    }
    var playerVideo = document.querySelector('.player-video.video--load');
    var loader = playerVideo ? playerVideo.querySelector('.player-video__loader') : null;
    var activity = document.querySelector('.activity__loader');
    var balanser = document.querySelector('.lampac-balanser-loader');
    console.log('Перевірка .player-video__loader:', loader);
    if (loader) {
        console.log('Computed backgroundImage:', getComputedStyle(loader).backgroundImage);
        console.log('Computed backgroundColor:', getComputedStyle(loader).backgroundColor);
        console.log('Computed filter:', getComputedStyle(loader).filter);
    }
    console.log('Перевірка .activity__loader:', activity);
    if (activity) {
        console.log('Computed backgroundImage:', getComputedStyle(activity).backgroundImage);
        console.log('Computed backgroundColor:', getComputedStyle(activity).backgroundColor);
    }
    console.log('Перевірка .lampac-balanser-loader:', balanser);
    if (balanser) {
        console.log('Computed backgroundImage:', getComputedStyle(balanser).backgroundImage);
        console.log('Computed backgroundColor:', getComputedStyle(balanser).backgroundColor);
    }
    console.log('Перевірка .player-video:', document.querySelector('.player-video'));
}, 1000);
