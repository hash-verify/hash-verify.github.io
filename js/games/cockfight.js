window.PFGames = window.PFGames || {};

window.PFGames.verifyCockfight = function (ctx) {
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

  var GROUPS = [
    { label: "Green", headAttr: 'style="color:#1b5e20;font-weight:700"' },
    { label: "Red", headAttr: 'class="card-red"' },
    { label: "Blue", headAttr: 'style="color:#1565c0;font-weight:700"' }
  ];

  function groupHeaderHtml(meta) {
    if (meta.headAttr.indexOf("class=") === 0) {
      return '<span ' + meta.headAttr + ">" + H.escapeHtml(meta.label) + "</span>";
    }
    return "<span " + meta.headAttr + ">" + H.escapeHtml(meta.label) + "</span>";
  }

  var modules = [];
  var scaledParts = [];
  var summaryLines = [];
  var currentServerSeed = serverSeed;

  for (var g = 0; g < gameCount; g += 1) {
    var hash = CryptoJS.HmacSHA256(clientSeed, currentServerSeed).toString(CryptoJS.enc.Hex);
    var nextServerHash = CryptoJS.SHA256(currentServerSeed).toString(CryptoJS.enc.Hex);
    var stepHtml = [];
    var roundParts = [];

    for (var gi = 0; gi < 3; gi += 1) {
      var meta = GROUPS[gi];
      var hex8 = hash.slice(gi * 8, gi * 8 + 8);
      var parts = H.hex8ToParts(hex8);
      var r = parts.r;
      var out = Math.floor(r * 5);
      if (out > 4) out = 4;
      scaledParts.push({ pool: 5, idx: out });
      roundParts.push(groupHeaderHtml(meta) + ": " + out);

      stepHtml.push(
        '<div class="hash28-ball hilo-deal">' +
        '<div class="result-line">' +
        groupHeaderHtml(meta) +
        "</div>" +
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
        '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R × 5) = ' +
        out +
        "</span></div>" +
        '<div class="result-line"><span class="k">Result:</span><span>' +
        out +
        "</span></div>" +
        "</div>"
      );
    }

    summaryLines.push(
      '<div class="result-line"><span class="k">Round #' +
        (g + 1) +
        ":</span><span>" +
        roundParts.join(" · ") +
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
        '<div class="result-line"><span class="k">Green / Red / Blue:</span><span>' +
        roundParts.join(" | ") +
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
  el.diceResult.innerHTML = summaryLines.join("");
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
