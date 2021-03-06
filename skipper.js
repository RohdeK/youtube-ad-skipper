(function() {
  
  var videoObserver; 
  function initVideoObservation() {
    var video = document.getElementsByTagName('video')[0];

    if (!video) return;

    if (videoObserver) videoObserver.disconnect();

    videoObserver = new MutationObserver(function(mutations) {
      checkValidVideoUrl(video);
    });

    videoObserver.observe(video, { attributes: true, attributeOldValue: true, attributeFilter: ["src"] });
    checkValidVideoUrl(video);
  }

  function isVisible(elem) {
    if (!elem) return false;
    return !!(elem.offsetWidth && elem.offsetHeight && elem.getClientRects().length);
  }

  function checkValidVideoUrl(element) {
    var src = element.getAttribute("src");
    if (!src) return;

    console.log("Got new Video Source: ", src);

    var adThings = document.getElementsByClassName('ad-container')[0];
    if (isVisible(adThings) || src.indexOf('youtube') == -1) {
      setTimeout(function() {
        element.setAttribute('src', '');
        console.log("Video Skipped.");
      }, 100);
    }
  }

  initVideoObservation();

  var popupObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      for (var i = 0; i < mutation.addedNodes.length; i++) {
        var node = mutation.addedNodes[i];

        if (node.classList && node.classList.contains('yt-dialog-bg')) {
          node.parentElement.removeChild(node);
          console.log('Removed Dialog Background.');
        }

        if (node.tagName && node.tagName.toLowerCase() == "video") {
          console.log("Found new Video Player.");
          initVideoObservation();
        }
      }
    });
  });

  popupObserver.observe(document.body, { childList: true, subtree: true });

  var popupBase = document.getElementById('yt-consent-dialog');
  if (popupBase) {
    popupBase.parentElement.removeChild(popupBase);
    console.log('Removed Dialog Base.');
  }
})();
