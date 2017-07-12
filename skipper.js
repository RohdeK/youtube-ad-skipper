(function() {

  var video;
  function initVideoObservation() {
    if (video) return;

    video = document.getElementsByTagName('video')[0];

    if (!video) return;

    var videoObserver = new MutationObserver(function(mutations) {
      checkValidVideoUrl(video);
    });

    videoObserver.observe(video, { attributes: true, attributeOldValue: true, attributeFilter: ["src"] });
    checkValidVideoUrl(video);
  }

  function checkValidVideoUrl(element) {
    var src = video.getAttribute("src");

    if (!src) return;

    var adThings = document.getElementsByClassName('video-ads')[0].children[0].children[0];
    if (adThings !== undefined || src.indexOf('youtube') == -1) {
      video.setAttribute('src', '');
      console.log("Video Skipped.");
    }
  }

  initVideoObservation();

  var popupObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        var node = mutation.addedNodes[i];
        if (node.classList && node.classList.contains('yt-dialog-bg'))
          node.parentElement.removeChild(node);

        if (node.tagName && node.tagName.toLowerCase() == "video") {
          if (!video) {
            initVideoObservation();
          }
        }
      }
    });
  });

  popupObserver.observe(document.body, { childList: true, subtree: true });

  var popupBase = document.getElementById('yt-consent-dialog');
  if (popupBase) popupBase.parentElement.removeChild(popupBase);
})();