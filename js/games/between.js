window.PFGames = window.PFGames || {};

window.PFGames.verifyBetween = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var gameCount = parseInt((el.betweenCount.value || "").trim(), 10);
  if (!Number.isFinite(gameCount) || gameCount < 1) gameCount = 1;
  if (gameCount > 200) gameCount = 200;
  el.betweenCount.value = String(gameCount);

  function cardFromIndex(idx) {
    var suits = ["♦", "♥", "♠", "♣"];
    var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    return suits[idx % 4] + " " + ranks[Math.floor(idx / 4)];
  }

  function cardToHtml(card) {
    var isRed = card.indexOf("♦") === 0 || card.indexOf("♥") === 0;
    var cls = isRed ? "card-red" : "card-black";
    return '<span class="' + cls + '">' + H.escapeHtml(card) + "</span>";
  }

  var modules = [];
  var indexes = [];
  var scaledParts = [];
  var cards = [];
  var currentServerSeed = serverSeed;
  for (var g = 0; g < gameCount; g += 1) {
    var hmacMessage = clientSeed;
    var hmacKey = currentServerSeed;
    var hash = CryptoJS.HmacSHA256(hmacMessage, hmacKey).toString(CryptoJS.enc.Hex);
    var nextServerHash = CryptoJS.SHA256(currentServerSeed).toString(CryptoJS.enc.Hex);
    var stepHtml = [];
    var gameIndexes = [];
    var gameCards = [];
    for (var i = 0; i < 3; i += 1) {
      var hex8 = hash.slice(i * 8, i * 8 + 8);
      var parts = H.hex8ToParts(hex8);
      var r = parts.r;
      var product = r * 52;
      var cardIndex = Math.floor(product);
      var card = cardFromIndex(cardIndex);
      indexes.push(cardIndex);
      scaledParts.push({ pool: 52, idx: cardIndex });
      cards.push(cardToHtml(card));
      gameIndexes.push(cardIndex);
      gameCards.push(cardToHtml(card));
      stepHtml.push(
        '<div class="hash28-ball hilo-deal">' +
        '<div class="result-line"><span class="k">Card ' + (i + 1) + '</span><span>—</span></div>' +
        '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' + H.escapeHtml(hex8) + "</span></div>" +
        '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' + parts.b1 + ", " + parts.b2 + ", " + parts.b3 + ", " + parts.b4 + "</span></div>" +
        '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' + H.escapeHtml(r.toFixed(12)) + "</span></div>" +
        '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R × 52) = ' + cardIndex + "</span></div>" +
        '<div class="result-line"><span class="k">Card index:</span><span>' + cardIndex + "</span></div>" +
        '<div class="result-line"><span class="k">Card:</span><span>' + cardToHtml(card) + "</span></div>" +
        "</div>"
      );
    }
    modules.push(
      '<div class="mine-hash-module hilo-cursor">' +
      '<div class="result-line"><span class="k">Result Hash:</span><span>' + H.escapeHtml(hash) + "</span></div>" +
      '<div class="result-line"><span class="k">Card indexes:</span><span>' + gameIndexes.join(", ") + "</span></div>" +
      '<div class="result-line"><span class="k">Cards:</span><span>' + gameCards.join(" | ") + "</span></div>" +
      stepHtml.join("") +
      "</div>"
    );
    currentServerSeed = nextServerHash;
  }

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.betweenModules.innerHTML = modules.join("");
  el.diceNumber.textContent = H.scaledFloorSeries(scaledParts);
  el.diceResult.innerHTML = cards.join(" | ");
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
