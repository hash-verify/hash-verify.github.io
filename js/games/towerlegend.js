window.PFGames = window.PFGames || {};

window.PFGames.verifyTowerLegend = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var nonce = (el.nonce.value || "").toString().trim();
  var diff = el.towerDifficulty.value || "easy";

  var modeMap = {
    easy: { cols: 4, rows: 9, fruits: 3, skulls: 1, label: "Easy" },
    medium: { cols: 3, rows: 9, fruits: 2, skulls: 1, label: "Medium" },
    hard: { cols: 2, rows: 9, fruits: 1, skulls: 1, label: "Hard" },
    extreme: { cols: 3, rows: 6, fruits: 1, skulls: 2, label: "Extreme" },
    nightmare: { cols: 4, rows: 6, fruits: 1, skulls: 3, label: "Nightmare" }
  };
  var mode = modeMap[diff] || modeMap.easy;
  el.subtitle.textContent = "TowerLegend · " + mode.label + " · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)";

  var rowModules = [];
  var scaledParts = [];
  var rowSkullSummary = [];
  var gridRows = [];

  for (var cursor = 0; cursor < mode.rows; cursor += 1) {
    var message = clientSeed + ":" + nonce + ":" + String(cursor);
    var hash = CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex);
    var pool = [];
    for (var p = 0; p < mode.cols; p += 1) pool.push(p);
    var fruits = [];
    var stepHtml = [];

    for (var i = 0; i < mode.fruits; i += 1) {
      var hex8 = hash.slice(i * 8, i * 8 + 8);
      var parts = H.hex8ToParts(hex8);
      var r = parts.r;
      var poolLen = pool.length;
      var product = r * poolLen;
      var pickIdx = Math.floor(product);
      var pickCell = pool[pickIdx];
      fruits.push(pickCell);
      scaledParts.push({ pool: poolLen, idx: pickIdx });
      pool.splice(pickIdx, 1);
      stepHtml.push(
        '<div class="hash28-ball hilo-deal">' +
        '<div class="result-line"><span class="k">Fruit ' + (i + 1) + '</span><span></span></div>' +
        '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' + H.escapeHtml(hex8) + "</span></div>" +
        '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' + parts.b1 + ", " + parts.b2 + ", " + parts.b3 + ", " + parts.b4 + "</span></div>" +
        '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' + H.escapeHtml(r.toFixed(12)) + "</span></div>" +
        '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R × ' + poolLen + ") = " + pickIdx + "</span></div>" +
        '<div class="result-line"><span class="k">Index:</span><span>floor = ' + pickIdx + "</span></div>" +
        '<div class="result-line"><span class="k">Selected Cell:</span><span>' + pickCell + "</span></div>" +
        "</div>"
      );
    }

    var skulls = pool.slice();
    fruits.sort(function (a, b) { return a - b; });
    skulls.sort(function (a, b) { return a - b; });
    rowSkullSummary.push("R" + (cursor + 1) + ":[" + skulls.join(",") + "]");

    var rowCellMap = {};
    for (var f = 0; f < fruits.length; f += 1) rowCellMap[fruits[f]] = "fruit";
    for (var s = 0; s < skulls.length; s += 1) rowCellMap[skulls[s]] = "skull";
    var oneRowCells = [];
    for (var c = 0; c < mode.cols; c += 1) {
      var type = rowCellMap[c] || "skull";
      if (type === "fruit") {
        oneRowCells.push('<div class="tower-cell tower-fruit">F</div>');
      } else {
        oneRowCells.push('<div class="tower-cell tower-skull">S</div>');
      }
    }
    gridRows.push(oneRowCells);

    rowModules.push(
      '<div class="mine-hash-module hilo-cursor">' +
      '<div class="result-line"><span class="k">Cursor: #' + cursor + "</span><span></span></div>" +
      '<div class="result-line"><span class="k">Result Hash:</span><span>' + H.escapeHtml(hash) + "</span></div>" +
      '<div class="result-line"><span class="k">Fruits:</span><span>' + fruits.join(", ") + "</span></div>" +
      stepHtml.join("") +
      "</div>"
    );
  }

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.towerGrid.style.setProperty("--tower-cols", String(mode.cols));
  var gridCells = [];
  for (var r = gridRows.length - 1; r >= 0; r -= 1) {
    gridCells = gridCells.concat(gridRows[r]);
  }
  el.towerGrid.innerHTML = gridCells.join("");
  el.towerModules.innerHTML = rowModules.join("");
  el.diceNumber.textContent = "-";
  el.diceResult.textContent = rowSkullSummary.join(" | ");
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
