window.PFGames = window.PFGames || {};

window.PFGames.verifyXocdia = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var gameCount = parseInt((el.roundCount.value || "").trim(), 10);
  if (!Number.isFinite(gameCount) || gameCount < 1) gameCount = 1;
  if (gameCount > 200) gameCount = 200;
  el.roundCount.value = String(gameCount);

  function faceHtml(bit) {
    if (bit === 0) {
      return (
        '<span title="0 (white)" style="display:inline-block;width:1em;height:1em;border-radius:50%;background:#fff;border:1px solid #bdbdbd;vertical-align:-0.15em"></span> ' +
        "<span>White</span>"
      );
    }
    return '<span class="card-red" title="1 (red)">●</span> <span class="card-red">Red</span>';
  }

  var modules = [];
  var scaledParts = [];
  var allFaceHtml = [];
  var currentServerSeed = serverSeed;

  for (var g = 0; g < gameCount; g += 1) {
    var hash = CryptoJS.HmacSHA256(clientSeed, currentServerSeed).toString(CryptoJS.enc.Hex);
    var nextServerHash = CryptoJS.SHA256(currentServerSeed).toString(CryptoJS.enc.Hex);
    var stepHtml = [];
    var gameFaceHtml = [];

    for (var i = 0; i < 4; i += 1) {
      var hex8 = hash.slice(i * 8, i * 8 + 8);
      var parts = H.hex8ToParts(hex8);
      var r = parts.r;
      var bit = Math.floor(r * 2);
      if (bit > 1) bit = 1;
      scaledParts.push({ pool: 2, idx: bit });
      gameFaceHtml.push(faceHtml(bit));
      stepHtml.push(
        '<div class="hash28-ball hilo-deal">' +
        '<div class="result-line"><span class="k">Face ' +
        (i + 1) +
        '</span><span>—</span></div>' +
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
        '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R × 2) = ' +
        bit +
        "</span></div>" +
        '<div class="result-line"><span class="k">Face:</span><span>' +
        faceHtml(bit) +
        "</span></div>" +
        "</div>"
      );
    }

    allFaceHtml.push(
      '<div class="result-line"><span class="k">Round #' +
        (g + 1) +
        ":</span><span>" +
        gameFaceHtml.join(" | ") +
        "</span></div>"
    );

    modules.push(
      '<div class="mine-hash-module hilo-cursor">' +
        '<div class="result-line"><span class="k">Round:</span><span>#' +
        (g + 1) +
        "</span></div>" +
        '<div class="result-line"><span class="k">Result Hash:</span><span>' +
        H.escapeHtml(hash) +
        "</span></div>" +
        '<div class="result-line"><span class="k">Faces (4):</span><span>' +
        gameFaceHtml.join(" | ") +
        "</span></div>" +
        stepHtml.join("") +
        "</div>"
    );

    currentServerSeed = nextServerHash;
  }

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.betweenModules.innerHTML = modules.join("");
  el.diceNumber.textContent = H.scaledFloorSeries(scaledParts);
  el.diceResult.innerHTML = allFaceHtml.join("");
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
