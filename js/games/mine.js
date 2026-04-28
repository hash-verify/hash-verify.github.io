window.PFGames = window.PFGames || {};

window.PFGames.verifyMine = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  el.zodiacModules.innerHTML = "";
  el.zodiacGrid.innerHTML = "";
  el.bobingModules.innerHTML = "";
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var nonce = (el.nonce.value || "").toString().trim();
  var mineCount = parseInt((el.mineCount.value || "").trim(), 10);
  if (!Number.isFinite(mineCount)) mineCount = 1;
  if (mineCount < 1) mineCount = 1;
  if (mineCount > 24) mineCount = 24;
  el.mineCount.value = String(mineCount);

  var hashesByCursor = {};
  var usedCursors = [];
  var cursor = 0;
  while (Object.keys(hashesByCursor).length * 8 < mineCount) {
    var message = clientSeed + ":" + nonce + ":" + String(cursor);
    var hash = CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex);
    hashesByCursor[cursor] = hash;
    usedCursors.push(cursor);
    cursor += 1;
  }

  var pool = [];
  for (var p = 0; p < 25; p += 1) pool.push(p);
  var mines = [];
  var scaledParts = [];
  var stepsByCursor = {};
  for (var m = 0; m < mineCount; m += 1) {
    var curC = usedCursors[Math.floor(m / 8)];
    var gIdx = m % 8;
    var h = hashesByCursor[curC];
    var hex8 = h.slice(gIdx * 8, gIdx * 8 + 8);
    var parts = H.hex8ToParts(hex8);
    var r = parts.r;
    var poolLen = pool.length;
    var product = r * poolLen;
    var idx = Math.floor(product);
    var picked = pool[idx];
    mines.push(picked);
    scaledParts.push({ pool: poolLen, idx: idx });
    pool.splice(idx, 1);
    var x = (picked % 5) + 1;
    var y = 5 - Math.floor(picked / 5);
    if (!stepsByCursor[curC]) stepsByCursor[curC] = [];
    stepsByCursor[curC].push({
      mineNo: m + 1,
      hex8: hex8,
      b1: parts.b1,
      b2: parts.b2,
      b3: parts.b3,
      b4: parts.b4,
      r: r,
      poolLen: poolLen,
      product: product,
      idx: idx,
      picked: picked,
      coord: "(" + x + "," + y + ")"
    });
  }

  var mineMap = {};
  for (var k = 0; k < mines.length; k += 1) mineMap[mines[k]] = true;
  var cells = [];
  for (var cell = 0; cell < 25; cell += 1) {
    var cls = mineMap[cell] ? "mine-cell mine-hit" : "mine-cell";
    var text = mineMap[cell] ? "M" : ".";
    cells.push('<div class="' + cls + '">' + text + "</div>");
  }

  var coords = [];
  for (var c = 0; c < mines.length; c += 1) {
    var v = mines[c];
    var xc = (v % 5) + 1;
    var yc = 5 - Math.floor(v / 5);
    coords.push("(" + xc + "," + yc + ")");
  }

  var moduleHtml = [];
  for (var ui = 0; ui < usedCursors.length; ui += 1) {
    var cKey = usedCursors[ui];
    var hFull = hashesByCursor[cKey];
    var steps = stepsByCursor[cKey] || [];
    var stepHtml = [];
    for (var si = 0; si < steps.length; si += 1) {
      var st = steps[si];
      stepHtml.push(
        '<div class="hash28-ball hilo-deal">' +
        '<div class="result-line"><span class="k">Mine ' + st.mineNo + '</span><span></span></div>' +
        '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' + H.escapeHtml(st.hex8) + "</span></div>" +
        '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' + st.b1 + ", " + st.b2 + ", " + st.b3 + ", " + st.b4 + "</span></div>" +
        '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' + H.escapeHtml(st.r.toFixed(12)) + "</span></div>" +
        '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R × ' + st.poolLen + ") = " + st.idx + "</span></div>" +
        '<div class="result-line"><span class="k">Index:</span><span>floor = ' + st.idx + "</span></div>" +
        '<div class="result-line"><span class="k">Selected Cell:</span><span>' + st.picked + "</span></div>" +
        '<div class="result-line"><span class="k">Coordinate:</span><span>' + st.coord + "</span></div>" +
        "</div>"
      );
    }
    moduleHtml.push(
      '<div class="mine-hash-module hilo-cursor">' +
      '<div class="result-line"><span class="k">Cursor: #' + cKey + '</span><span></span></div>' +
      '<div class="result-line"><span class="k">Result Hash:</span><span>' + H.escapeHtml(hFull) + "</span></div>" +
      stepHtml.join("") +
      "</div>"
    );
  }

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.mineModules.innerHTML = moduleHtml.join("");
  el.mineGrid.innerHTML = cells.join("");
  el.diceNumber.textContent = "-";
  el.diceResult.textContent = coords.join(" ");
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
