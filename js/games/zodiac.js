window.PFGames = window.PFGames || {};

window.PFGames.verifyZodiac = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var nonce = (el.nonce.value || "").toString().trim();
  var difficulty = el.zodiacDifficulty.value || "medium";
  var board = H.getZodiacBoard(difficulty);
  var n = board.n;
  var totalCells = n * n;
  el.subtitle.textContent = "Zodiac · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor) · " + board.label;

  var animals = ["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig"];
  var hashesByCursor = {};
  var usedCursors = [];
  var cursor = 0;
  while (cursor * 8 < 12) {
    var message = clientSeed + ":" + nonce + ":" + String(cursor);
    var hash = CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex);
    hashesByCursor[cursor] = hash;
    usedCursors.push(cursor);
    cursor += 1;
  }

  var groupStream = [];
  for (var gi = 0; gi < usedCursors.length; gi += 1) {
    var cKey = usedCursors[gi];
    var h = hashesByCursor[cKey];
    for (var j = 0; j < 8; j += 1) {
      var hx = h.slice(j * 8, j * 8 + 8);
      groupStream.push({ cursor: cKey, hex8: hx, parts: H.hex8ToParts(hx) });
    }
  }

  var cellPool = [];
  for (var c = 0; c < totalCells; c += 1) cellPool.push(c);

  var picks = [];
  var scaledParts = [];
  var stepsByCursor = {};
  var g = 0;
  for (var step = 0; step < 12; step += 1) {
    var gs = groupStream[g++];
    var r = gs.parts.r;
    var cellMult = cellPool.length;
    var product = r * cellMult;
    var idx = Math.floor(product);
    var pickedCell = cellPool[idx];
    cellPool.splice(idx, 1);
    var animal = animals[step];
    var coord = H.coordFromCell(n, pickedCell);
    picks.push({ animal: animal, cell: pickedCell, coord: coord });
    scaledParts.push({ pool: cellMult, idx: idx });

    if (!stepsByCursor[gs.cursor]) stepsByCursor[gs.cursor] = [];
    stepsByCursor[gs.cursor].push({
      title: "Zodiac " + (step + 1),
      hex8: gs.hex8,
      parts: gs.parts,
      poolLen: cellMult,
      idx: idx,
      pickIndex: pickedCell,
      pickText: animal + " " + coord
    });
  }

  var moduleHtml = [];
  for (var ui = 0; ui < usedCursors.length; ui += 1) {
    var ck = usedCursors[ui];
    var hFull = hashesByCursor[ck];
    var blocks = stepsByCursor[ck] || [];
    var stepHtml = [];
    for (var si = 0; si < blocks.length; si += 1) {
      var bk = blocks[si];
      stepHtml.push(
        '<div class="hash28-ball hilo-deal">' +
        '<div class="result-line"><span class="k">' + bk.title + '</span><span></span></div>' +
        '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' + H.escapeHtml(bk.hex8) + "</span></div>" +
        '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' + bk.parts.b1 + ", " + bk.parts.b2 + ", " + bk.parts.b3 + ", " + bk.parts.b4 + "</span></div>" +
        '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' + H.escapeHtml(bk.parts.r.toFixed(12)) + "</span></div>" +
        '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R×' + bk.poolLen + ") = " + bk.idx + " → Selected Cell " + bk.pickIndex + "</span></div>" +
        '<div class="result-line"><span class="k">Final Result:</span><span>' + bk.pickText + "</span></div>" +
        "</div>"
      );
    }
    moduleHtml.push(
      '<div class="mine-hash-module hilo-cursor">' +
      '<div class="result-line"><span class="k">Cursor: #' + ck + '</span><span></span></div>' +
      '<div class="result-line"><span class="k">Result Hash:</span><span>' + H.escapeHtml(hFull) + "</span></div>" +
      stepHtml.join("") +
      "</div>"
    );
  }

  var gridCells = [];
  for (var t = 0; t < totalCells; t += 1) gridCells.push(".");
  for (var pi = 0; pi < picks.length; pi += 1) gridCells[picks[pi].cell] = picks[pi].animal;
  var cellHtml = [];
  for (var z = 0; z < gridCells.length; z += 1) {
    var ch = gridCells[z];
    var cls = ch !== "." ? "zodiac-cell zodiac-hit" : "zodiac-cell";
    cellHtml.push('<div class="' + cls + '">' + ch + "</div>");
  }

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.zodiacGrid.style.setProperty("--cell-n", String(n));
  el.zodiacGrid.innerHTML = cellHtml.join("");
  el.zodiacModules.innerHTML = moduleHtml.join("");
  el.diceNumber.textContent = "-";
  el.diceResult.textContent = picks.map(function (p) { return p.animal + p.coord; }).join(" ");
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
