window.PFGames = window.PFGames || {};

window.PFGames.verifyRoulette = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var nonce = (el.nonce.value || "").toString().trim();
  var message = clientSeed + ":" + nonce + ":0";
  var resultHash = CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex);
  var first4BytesHex = resultHash.slice(0, 8);
  var parts = H.hex8ToParts(first4BytesHex);
  var randomR = parts.r;
  var rouletteNumber = Math.floor(randomR * 37);

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.crashModules.innerHTML =
    '<div class="mine-hash-module hilo-cursor">' +
    '<div class="result-line"><span class="k">Result Hash:</span><span>' + H.escapeHtml(resultHash || "-") + "</span></div>" +
    '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' + H.escapeHtml(first4BytesHex || "-") + "</span></div>" +
    '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' + parts.b1 + ", " + parts.b2 + ", " + parts.b3 + ", " + parts.b4 + "</span></div>" +
    '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' + randomR.toFixed(12) + "</span></div>" +
    '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R × 37) = ' + rouletteNumber + "</span></div>" +
    '<div class="result-line"><span class="k">Final Result:</span><span>' + rouletteNumber + "</span></div>" +
    "</div>";
  el.diceNumber.textContent = "-";
  el.diceResult.textContent = "-";
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
