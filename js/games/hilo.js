window.PFGames = window.PFGames || {};

window.PFGames.verifyHilo = function (ctx) {
  var el = ctx.el;
  var H = ctx.H;
  var setStatus = ctx.setStatus;
  var C = window.PFGamesCommon;
  var serverSeed = (el.serverSeed.value || "").trim();
  var clientSeed = (el.clientSeed.value || "").trim();
  var nonce = (el.nonce.value || "").toString().trim();

  function cardFromIndex(idx) {
    var suits = ["♦", "♥", "♠", "♣"];
    var ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    var suit = suits[idx % 4];
    var rank = ranks[Math.floor(idx / 4)];
    return suit + " " + rank;
  }

  function cardToHtml(card) {
    var isRed = card.indexOf("♦") === 0 || card.indexOf("♥") === 0;
    var cls = isRed ? "card-red" : "card-black";
    return '<span class="' + cls + '">' + H.escapeHtml(card) + "</span>";
  }

  var modules = [];
  var cardHtmlList = [];

  for (var cursor = 0; cursor < 13; cursor += 1) {
    var message = clientSeed + ":" + nonce + ":" + String(cursor);
    var hash = CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex);
    var stepHtml = [];
    var cardsInHash = [];
    for (var group = 0; group < 8; group += 1) {
      var hex8 = hash.slice(group * 8, group * 8 + 8);
      var parts = H.hex8ToParts(hex8);
      var r = parts.r;
      var product = r * 52;
      var cardIndex = Math.floor(product);
      var card = cardFromIndex(cardIndex);
      var cardGlobal = cursor * 8 + group + 1;
      cardHtmlList.push(cardToHtml(card));
      cardsInHash.push(cardToHtml(card));
      stepHtml.push(
        '<div class="hash28-ball hilo-deal">' +
        '<div class="result-line"><span class="k">Card ' +
        cardGlobal +
        '</span><span></span></div>' +
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
        '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R × 52) = ' +
        cardIndex +
        "</span></div>" +
        '<div class="result-line"><span class="k">Card index:</span><span>' +
        cardIndex +
        "</span></div>" +
        '<div class="result-line"><span class="k">Card:</span><span>' +
        cardToHtml(card) +
        "</span></div>" +
        "</div>"
      );
    }
    modules.push(
      '<div class="hash28-ball hilo-cursor">' +
      '<div class="result-line"><span class="k">Cursor: #' +
      cursor +
      '</span><span></span></div>' +
      '<div class="result-line"><span class="k">Result Hash:</span><span>' +
      H.escapeHtml(hash) +
      "</span></div>" +
      '<div class="result-line"><span class="k">8 cards (this hash):</span><span>' +
      cardsInHash.join(" | ") +
      "</span></div>" +
      stepHtml.join("") +
      "</div>"
    );
  }

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.hiloModules.innerHTML = modules.join("");
  el.diceNumber.textContent = "-";
  el.diceResult.innerHTML = cardHtmlList.join(" | ");
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
