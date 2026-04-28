window.PFGames = window.PFGames || {};

window.PFGames.verifyCrash = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var gameCount = parseInt((el.crashCount.value || "").trim(), 10);
  if (!Number.isFinite(gameCount) || gameCount < 1) gameCount = 1;
  if (gameCount > 200) gameCount = 200;
  el.crashCount.value = String(gameCount);

  var houseEdge = 2;

  var twoPow52 = 4503599627370496;
  var numerator = 100 - houseEdge;
  var currentServerSeed = serverSeed;
  var modules = [];
  var firstScaledLine = "-";

  for (var g = 0; g < gameCount; g += 1) {
    var hash = CryptoJS.HmacSHA256(clientSeed, currentServerSeed).toString(CryptoJS.enc.Hex);
    var nextServerHash = CryptoJS.SHA256(currentServerSeed).toString(CryptoJS.enc.Hex);
    var first13Hex = hash.slice(0, 13);
    var first13Dec = parseInt(first13Hex, 16);
    var r = first13Dec / twoPow52;
    var raw = numerator / (1 - r);
    var floored = Math.floor(raw);
    var multiplier = (floored / 100).toFixed(2) + "x";
    if (g === 0) {
      firstScaledLine = "floor(" + numerator + "/(1-R)) = " + floored;
    }

    modules.push(
      '<div class="mine-hash-module hilo-cursor">' +
      '<div class="result-line"><span class="k">Round:</span><span>#' + (g + 1) + "</span></div>" +
      '<div class="result-line"><span class="k">Result Hash:</span><span>' + H.escapeHtml(hash) + "</span></div>" +
      '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' + H.escapeHtml(first13Hex) + "</span></div>" +
      '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' + first13Dec + "</span></div>" +
      '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' + H.escapeHtml(r.toFixed(16)) + "</span></div>" +
      '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(' + numerator + "/(1-R)) = " + floored + "</span></div>" +
      '<div class="result-line"><span class="k">Final Result:</span><span>' + multiplier + "</span></div>" +
      "</div>"
    );

    currentServerSeed = nextServerHash;
  }

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.crashModules.innerHTML = modules.join("");
  el.diceNumber.textContent = firstScaledLine;
  el.diceResult.textContent = "-";
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
