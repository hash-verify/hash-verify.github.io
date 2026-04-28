window.PFGames = window.PFGames || {};

window.PFGames.verifyBobing = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var nonce = (el.nonce.value || "").toString().trim();
  var message = clientSeed + ":" + nonce + ":0";
  var hash = CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex);

  var dice = [];
  var stepHtml = [];
  for (var i = 0; i < 6; i += 1) {
    var hex8 = hash.slice(i * 8, i * 8 + 8);
    var parts = H.hex8ToParts(hex8);
    var r = parts.r;
    var face = Math.floor(r * 6) + 1;
    dice.push(face);
    stepHtml.push(
      '<div class="hash28-ball hilo-deal">' +
      '<div class="result-line"><span class="k">Dice ' + (i + 1) + '</span><span>—</span></div>' +
      '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' + H.escapeHtml(hex8) + "</span></div>" +
      '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' + parts.b1 + ", " + parts.b2 + ", " + parts.b3 + ", " + parts.b4 + "</span></div>" +
      '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' + H.escapeHtml(r.toFixed(12)) + "</span></div>" +
      '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R × 6) + 1 = ' + face + "</span></div>" +
      '<div class="result-line"><span class="k">Final Result:</span><span>' + face + "</span></div>" +
      "</div>"
    );
  }

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.bobingModules.innerHTML =
    '<div class="hash28-ball">' +
    '<div class="result-line"><span class="k">Result Hash:</span><span>' + H.escapeHtml(hash) + "</span></div>" +
    "</div>" +
    stepHtml.join("");
  el.diceNumber.textContent = H.scaledBobingSix(dice);
  el.diceResult.textContent = dice.join(", ");
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
