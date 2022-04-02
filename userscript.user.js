// ==UserScript==
// @name         SuperStonk Logo template
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the canvas!
// @author       oralekin, Crabbey
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// ==/UserScript==
if (window.top !== window.self) {
  var flashingPixels = {};
  var flashState = 0;
  const commandurl = "https://ss.crabbey.co.uk/cnc"
  const canvas = document.createElement("canvas");
  canvas.style.display = "none";
  const cnccanvas = document.createElement("canvas");
  cnccanvas.style.display = "none";

  window.addEventListener('load', function() {
    loadOverlay()
    setInterval(loadOverlay, 5 * 10 * 1000) // 10 Minute reload timer
    setInterval(tick, 1000)
  }, false);


  function loadOverlay() {
    const time = Math.floor(Date.now() / 10000);
    const link = "https://raw.githubusercontent.com/rplacesuperstonk/rplace-image/main/superstonk_overlay.png?tstamp=" + time;

    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function() {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      const originalData = dataURL;
      setupOverlay(dataURL)
      finishedLoad()
    }
    img.src = link
    console.log("Reloaded overlay")
  }

  function setupOverlay(img) {
    var apeLoaded = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].querySelector('#apes-together-strong')
    if (apeLoaded) {
      apeLoaded.src = img
      return
    }
    document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0].appendChild(
      (function() {
        const i = document.createElement("img");
        i.src = img
        i.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 1000px;height: 1000px;";
        i.setAttribute("id", "apes-together-strong");
        return i;
      })()
    )
  }

  function finishedLoad(){
  }

  function flashPixel(x, y) {
    var multiplier = 3
    var pixelData = canvas.getContext('2d').getImageData(x * multiplier + 1, y * multiplier + 1, 1, 1);
    flashingPixels[x*1000+y] = {
      imageData: pixelData,
      x: x,
      y: y,
    };
  }

  function stopFlashPixel(x, y) {
    var d = flashingPixels[x*1000+y];
    delete flashingPixels[x*1000+y];
    setPixel(d, 0)
  }

  function tick() {
    if (!flashState) {
      flashState = 1
      return tickFlashOn()
    }
    flashState = 0
    return tickFlashOff()
  }

  function tickFlashOn() {
    Object.keys(flashingPixels).forEach(function(key) {
      setPixel(flashingPixels[key], 255)
    });
    setupOverlay(canvas.toDataURL("image/png"))
  }

  function tickFlashOff() {
    Object.keys(flashingPixels).forEach(function(key) {
      setPixel(flashingPixels[key], 0)
    });
    setupOverlay(canvas.toDataURL("image/png"))
  }

  function setPixel(pixel, alpha) {
    var multiplier = 3
    var x = pixel.x * multiplier
    var y = pixel.y * multiplier
    for (var xdif = 0; xdif <= 2; xdif++) {
      for (var ydif = 0; ydif <= 2; ydif++) {
        if (xdif == 1 && ydif == 1) {
          // Never change the middle pixel
          continue
        }
        var imageData = pixel.imageData
        imageData.data[3] = alpha
        canvas.getContext('2d').putImageData(imageData, x + xdif, y + ydif);

      }
    }
  }

}
