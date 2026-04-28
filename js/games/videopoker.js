window.PFGames = window.PFGames || {};

window.PFGames.verifyVideoPoker = function (ctx) {
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
    return suits[idx % 4] + " " + ranks[Math.floor(idx / 4)];
  }

  function cardToHtml(card) {
    var isRed = card.indexOf("♦") === 0 || card.indexOf("♥") === 0;
    var cls = isRed ? "card-red" : "card-black";
    return '<span class="' + cls + '">' + H.escapeHtml(card) + "</span>";
  }

  var cursorCount = 7;
  var hashesByCursor = [];
  for (var cursor = 0; cursor < cursorCount; cursor += 1) {
    var message = clientSeed + ":" + nonce + ":" + String(cursor);
    hashesByCursor.push(CryptoJS.HmacSHA256(message, serverSeed).toString(CryptoJS.enc.Hex));
  }

  var randomGroups = [];
  for (var ci = 0; ci < hashesByCursor.length; ci += 1) {
    var hash = hashesByCursor[ci];
    for (var gi = 0; gi < 8; gi += 1) {
      var hex8 = hash.slice(gi * 8, gi * 8 + 8);
      var parts = H.hex8ToParts(hex8);
      randomGroups.push({ cursor: ci, group: gi + 1, hex8: hex8, parts: parts });
    }
  }

  var deckPool = [];
  for (var d = 0; d < 52; d += 1) deckPool.push(d);

  var drawStepsByCursor = {};
  var drawnCardsHtml = [];
  for (var drawNo = 0; drawNo < 52; drawNo += 1) {
    var src = randomGroups[drawNo];
    var poolLen = deckPool.length;
    var product = src.parts.r * poolLen;
    var pickIndex = Math.floor(product);
    var cardIdx = deckPool[pickIndex];
    deckPool.splice(pickIndex, 1);

    var card = cardFromIndex(cardIdx);
    drawnCardsHtml.push(cardToHtml(card));

    if (!drawStepsByCursor[src.cursor]) drawStepsByCursor[src.cursor] = [];
    drawStepsByCursor[src.cursor].push({
      drawNo: drawNo + 1,
      hex8: src.hex8,
      parts: src.parts,
      poolLen: poolLen,
      product: product,
      pickIndex: pickIndex,
      cardIndex: cardIdx,
      card: card
    });
  }

  var modules = [];
  for (var mc = 0; mc < hashesByCursor.length; mc += 1) {
    var hashSteps = drawStepsByCursor[mc] || [];
    var stepHtml = [];
    for (var si = 0; si < hashSteps.length; si += 1) {
      var st = hashSteps[si];
      stepHtml.push(
        '<div class="hash28-ball hilo-deal">' +
        '<div class="result-line"><span class="k">Card ' +
        st.drawNo +
        '</span><span></span></div>' +
        '<div class="result-line"><span class="k">4 Bytes (Hex):</span><span>' +
        H.escapeHtml(st.hex8) +
        "</span></div>" +
        '<div class="result-line"><span class="k">4 Bytes (Dec):</span><span>' +
        st.parts.b1 +
        ", " +
        st.parts.b2 +
        ", " +
        st.parts.b3 +
        ", " +
        st.parts.b4 +
        "</span></div>" +
        '<div class="result-line"><span class="k">Random Number (0–1) (R):</span><span>' +
        H.escapeHtml(st.parts.r.toFixed(12)) +
        "</span></div>" +
        '<div class="result-line"><span class="k">Scaled Value:</span><span>floor(R × ' +
        st.poolLen +
        ") = " +
        st.pickIndex +
        "</span></div>" +
        '<div class="result-line"><span class="k">Pick index:</span><span>' +
        st.pickIndex +
        "</span></div>" +
        '<div class="result-line"><span class="k">Card index:</span><span>' +
        st.cardIndex +
        "</span></div>" +
        '<div class="result-line"><span class="k">Card:</span><span>' +
        cardToHtml(st.card) +
        "</span></div>" +
        "</div>"
      );
    }
    modules.push(
      '<div class="hash28-ball hilo-cursor">' +
      '<div class="result-line"><span class="k">Cursor: #' +
      mc +
      '</span><span></span></div>' +
      '<div class="result-line"><span class="k">Result Hash:</span><span>' +
      H.escapeHtml(hashesByCursor[mc]) +
      "</span></div>" +
      stepHtml.join("") +
      "</div>"
    );
  }

  var hand = drawnCardsHtml.slice(0, 5).join(" | ");
  var drawCards = drawnCardsHtml.slice(5, 10).join(" | ");

  C.clearScalarLines(el);
  C.clearDynamicAreas(el);
  el.videopokerModules.innerHTML = modules.join("");
  el.diceNumber.textContent = "-";
  el.diceResult.innerHTML = "Starting hand: " + hand + " · Draw: " + drawCards;
  setStatus(serverSeed ? "VERIFIED" : "MISMATCH", !!serverSeed);
};
