window.PFGames = window.PFGames || {};

window.PFGames.verifyFlipCoin = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var nonce = (el.nonce.value || "").toString().trim();
  var flipCount = parseInt((el.flipCount.value || "").trim(), 10);
  if (!Number.isFinite(flipCount) || flipCount < 1) {
    C.clearDynamicAreas(el);
    el.flipModules.innerHTML = '<div class="hash28-ball">Please input Result Count (> 0).</div>';
    el.diceNumber.textContent = "-";
    el.diceResult.textContent = "-";
    el.limboFormula.textContent = "-";
    setStatus("MISMATCH", false);
    return;
  }
  flipCount = Math.min(200, flipCount);
  el.flipCount.value = String(flipCount);
  var bits = [];
  var twoRList = [];
  var modules = [];
  var firstHash = "";
  var firstHex8 = "";
  var firstR = 0;

  for (var cursor = 0; cursor < flipCount; cursor += 1) {
    var message = clientSeed + ":" + nonce + ":" + String(cursor);
    var hash = CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex);
    var hex8 = hash.slice(0, 8);
    var parts = H.hex8ToParts(hex8);
    var r = parts.r;
    var value = r * 2;
    var bit = value > 1 ? 1 : 0;
    twoRList.push(value);
    var side = bit === 1 ? "Heads" : "Tails";
    var sideClass = bit === 1 ? "flip-heads" : "flip-tails";
    bits.push(bit);
    modules.push(
      '<div class="hash28-ball">' +
      '<div class="result-line"><span class="k">Result Hash:</span><span>' +
      H.escapeHtml(hash) +
      "</span></div>" +
      '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' +
      H.escapeHtml(hex8) +
      "</span></div>" +
      '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' +
      parts.b1 +
      ", " +
      parts.b2 +
      ", " +
      parts.b3 +
      ", " +
      parts.b4 +
      "</span></div>" +
      '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' +
      H.escapeHtml(r.toFixed(12)) +
      "</span></div>" +
      '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R×2) = ' +
      Math.floor(value + 1e-9) +
      "</span></div>" +
      '<div class="result-line"><span class="k">Final Result:</span><span>' +
      bit +
      " - " +
      '<span class="' +
      sideClass +
      '">' +
      side +
      "</span></span></div>" +
      "</div>"
    );

    if (cursor === 0) {
      firstHash = hash;
      firstHex8 = hex8;
      firstR = r;
    }
  }

  el.resultHash.textContent = firstHash || "-";
  el.first4BytesHex.textContent = firstHex8 || "-";
  el.randomR.textContent = firstR.toFixed(12);
  el.groupHex.textContent = "-";
  el.groupValues.textContent = "-";
  el.limboFormula.textContent = "-";
  C.clearDynamicAreas(el);
  el.flipModules.innerHTML = modules.join("");
  el.diceNumber.textContent = H.scaledFlipSeries(bits, twoRList);
  el.diceResult.textContent = bits.join("");
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
