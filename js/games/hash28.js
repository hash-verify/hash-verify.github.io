window.PFGames = window.PFGames || {};

function hash28BallGroupHtml(H, ballNo, hex8, p, v) {
  var rStr = p.r.toFixed(12);
  return (
    '<div class="hash28-ball">' +
    '<div class="result-line"><span class="k">Ball ' +
    ballNo +
    '</span><span>—</span></div>' +
    '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' +
    H.escapeHtml(hex8) +
    "</span></div>" +
    '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' +
    p.b1 +
    ", " +
    p.b2 +
    ", " +
    p.b3 +
    ", " +
    p.b4 +
    "</span></div>" +
    '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' +
    H.escapeHtml(rStr) +
    "</span></div>" +
    '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R×10) = floor(' +
    H.escapeHtml(rStr) +
    "×10) = " +
    v +
    "</span></div>" +
    '<div class="result-line"><span class="k">Final Result:</span><span>' +
    v +
    "</span></div>" +
    "</div>"
  );
}

window.PFGames.verifyHash28 = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var nonce = (el.nonce.value || "").trim();
  var message = clientSeed + ":" + nonce + ":0";
  var resultHash = CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex);
  var group1 = resultHash.slice(0, 8);
  var group2 = resultHash.slice(8, 16);
  var group3 = resultHash.slice(16, 24);
  var p1 = H.hex8ToParts(group1);
  var p2 = H.hex8ToParts(group2);
  var p3 = H.hex8ToParts(group3);
  var v1 = Math.floor(p1.r * 10);
  var v2 = Math.floor(p2.r * 10);
  var v3 = Math.floor(p3.r * 10);
  var sum = v1 + v2 + v3;

  C.clearDynamicAreas(el);
  C.clearScalarLines(el);

  el.resultHash.textContent = resultHash || "-";
  el.hash28BallsCrate.innerHTML =
    hash28BallGroupHtml(H, 1, group1, p1, v1) + hash28BallGroupHtml(H, 2, group2, p2, v2) + hash28BallGroupHtml(H, 3, group3, p3, v3);
  el.diceNumber.textContent = H.scaledHash28Sum(v1, v2, v3, sum);
  el.diceResult.textContent = String(sum);
  el.limboFormula.textContent = "-";
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
