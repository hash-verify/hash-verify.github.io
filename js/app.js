(function () {
  var el = {
    game: document.getElementById("game"),
    subtitle: document.getElementById("subtitle"),
    serverSeed: document.getElementById("serverSeed"),
    serverSeedField: document.getElementById("serverSeedField"),
    serverSeedHashField: document.getElementById("serverSeedHashField"),
    serverSeedHash: document.getElementById("serverSeedHash"),
    clientSeed: document.getElementById("clientSeed"),
    clientSeedField: document.getElementById("clientSeedField"),
    nonceField: document.getElementById("nonceField"),
    nonce: document.getElementById("nonce"),
    flipCountField: document.getElementById("flipCountField"),
    flipCount: document.getElementById("flipCount"),
    roundCountField: document.getElementById("roundCountField"),
    roundCount: document.getElementById("roundCount"),
    mineCountField: document.getElementById("mineCountField"),
    mineCount: document.getElementById("mineCount"),
    zodiacDiffField: document.getElementById("zodiacDiffField"),
    zodiacDifficulty: document.getElementById("zodiacDifficulty"),
    towerDiffField: document.getElementById("towerDiffField"),
    towerDifficulty: document.getElementById("towerDifficulty"),
    verifyBtn: document.getElementById("verifyBtn"),
    resultPanel: document.getElementById("resultPanel"),
    missingInputBlock: document.getElementById("missingInputBlock"),
    missingInputText: document.getElementById("missingInputText"),
    resultDetailBlock: document.getElementById("resultDetailBlock"),
    resultHashLine: document.getElementById("resultHashLine"),
    first4BytesLine: document.getElementById("first4BytesLine"),
    first4BytesDecLine: document.getElementById("first4BytesDecLine"),
    randomRLine: document.getElementById("randomRLine"),
    mappedLine: document.getElementById("mappedLine"),
    finalLine: document.getElementById("finalLine"),
    mappedLabel: document.getElementById("mappedLabel"),
    finalLabel: document.getElementById("finalLabel"),
    groupHexLine: document.getElementById("groupHexLine"),
    groupValuesLine: document.getElementById("groupValuesLine"),
    limboFormulaLine: document.getElementById("limboFormulaLine"),
    flipModules: document.getElementById("flipModules"),
    hiloModules: document.getElementById("hiloModules"),
    videopokerModules: document.getElementById("videopokerModules"),
    baccaratModules: document.getElementById("baccaratModules"),
    towerModules: document.getElementById("towerModules"),
    betweenModules: document.getElementById("betweenModules"),
    crashModules: document.getElementById("crashModules"),
    mineModules: document.getElementById("mineModules"),
    bobingModules: document.getElementById("bobingModules"),
    mineGridLine: document.getElementById("mineGridLine"),
    towerGridLine: document.getElementById("towerGridLine"),
    zodiacModules: document.getElementById("zodiacModules"),
    zodiacGridLine: document.getElementById("zodiacGridLine"),
    resultHash: document.getElementById("resultHash"),
    hash28BallsCrate: document.getElementById("hash28BallsCrate"),
    first4BytesHex: document.getElementById("first4BytesHex"),
    first4BytesDec: document.getElementById("first4BytesDec"),
    randomR: document.getElementById("randomR"),
    groupHex: document.getElementById("groupHex"),
    groupValues: document.getElementById("groupValues"),
    limboFormula: document.getElementById("limboFormula"),
    mineGrid: document.getElementById("mineGrid"),
    towerGrid: document.getElementById("towerGrid"),
    zodiacGrid: document.getElementById("zodiacGrid"),
    diceNumber: document.getElementById("diceNumber"),
    diceResult: document.getElementById("diceResult"),
    serverStatus: document.getElementById("serverStatus")
  };

  function autoFillFromUrl() {
    var p = new URLSearchParams(window.location.search);
    if (p.has("game")) {
      var gameFromUrl = (p.get("game") || "").trim();
      if (GAME_CONFIG[gameFromUrl]) el.game.value = gameFromUrl;
    }
    if (p.has("serverSeed")) el.serverSeed.value = p.get("serverSeed") || "";
    if (p.has("serverSeedHash")) el.serverSeedHash.value = p.get("serverSeedHash") || "";
    if (p.has("clientSeed")) el.clientSeed.value = p.get("clientSeed") || "";
    if (p.has("nonce")) el.nonce.value = p.get("nonce") || "";
    if (p.has("series")) el.flipCount.value = p.get("series") || "";
    if (p.has("roundCount")) el.roundCount.value = p.get("roundCount") || "";
  }

  function setStatus(text, ok) {
    el.serverStatus.textContent = text;
    el.serverStatus.className = ok ? "status-ok" : "status-err";
  }

  function syncServerSeedHashFromSeed() {
    var serverSeed = (el.serverSeed.value || "").trim();
    if (!serverSeed) return;
    var autoHash = CryptoJS.SHA256(serverSeed).toString(CryptoJS.enc.Hex);
    el.serverSeedHash.value = autoHash;
  }

  var defaultServerSeedLabel = el.serverSeedField.querySelector("label").textContent;

  var VIEW_KEYS = [
    "flipCountField",
    "roundCountField",
    "mineCountField",
    "zodiacDiffField",
    "towerDiffField",
    "groupHexLine",
    "groupValuesLine",
    "limboFormulaLine",
    "flipModules",
    "hiloModules",
    "videopokerModules",
    "baccaratModules",
    "towerModules",
    "betweenModules",
    "crashModules",
    "mineGridLine",
    "towerGridLine",
    "mineModules",
    "zodiacGridLine",
    "zodiacModules",
    "bobingModules",
    "resultHashLine",
    "hash28BallsCrate",
    "first4BytesLine",
    "first4BytesDecLine",
    "randomRLine",
    "mappedLine",
    "finalLine"
  ];

  var GAME_CONFIG = window.PFGameConfig || {};
  var DEFAULT_GAME = "dice";

  function hideAllViewKeys() {
    for (var i = 0; i < VIEW_KEYS.length; i += 1) {
      el[VIEW_KEYS[i]].classList.add("hidden");
    }
  }

  function showViewKeys(keys) {
    for (var i = 0; i < keys.length; i += 1) {
      el[keys[i]].classList.remove("hidden");
    }
  }

  function syncGameView() {
    var game = el.game.value;
    var cfg = GAME_CONFIG[game] || GAME_CONFIG[DEFAULT_GAME];
    if (!cfg) return;
    hideAllViewKeys();
    showViewKeys(cfg.show);
    var isBetweenLike =
      game === "between" || game === "crash" || game === "xocdia" || game === "cockfight";
    el.serverSeedHashField.classList.toggle("hidden", isBetweenLike);
    el.nonceField.classList.toggle("hidden", isBetweenLike);
    if (isBetweenLike) {
      var grid = el.serverSeedField.parentElement;
      if (grid && el.clientSeedField && el.serverSeedField) {
        grid.insertBefore(el.clientSeedField, el.serverSeedField);
      }
      el.clientSeedField.classList.add("full");
      el.serverSeedField.querySelector("label").textContent = "Server Seed (Game hash)";
    } else {
      var defaultGrid = el.serverSeedField.parentElement;
      if (defaultGrid && el.clientSeedField && el.serverSeedField && el.serverSeedHashField) {
        defaultGrid.insertBefore(el.serverSeedField, el.serverSeedHashField);
        defaultGrid.insertBefore(el.clientSeedField, el.nonceField);
      }
      el.clientSeedField.classList.remove("full");
      el.serverSeedField.querySelector("label").textContent = defaultServerSeedLabel;
    }
    el.subtitle.textContent = cfg.subtitle;
    el.mappedLabel.textContent = cfg.mappedLabel;
    el.finalLabel.textContent = cfg.finalLabel;
  }

  function runVerify(game) {
    var G = window.PFGames || {};
    var cfg = GAME_CONFIG[game] || GAME_CONFIG[DEFAULT_GAME];
    if (!cfg) return;
    var requiresNonce = !(
      game === "between" ||
      game === "crash" ||
      game === "xocdia" ||
      game === "cockfight"
    );
    var missingServer = !(el.serverSeed.value || "").trim();
    var missingClient = !(el.clientSeed.value || "").trim();
    var missingNonce = requiresNonce && !(el.nonce.value || "").toString().trim();
    if (missingServer || missingClient || missingNonce) {
      var missingFields = [];
      var serverMissingLabel =
        game === "between" ||
        game === "crash" ||
        game === "xocdia" ||
        game === "cockfight"
          ? "Server Seed (Game hash)"
          : "Server Seed";
      if (missingServer) missingFields.push(serverMissingLabel);
      if (missingClient) missingFields.push("Client Seed");
      if (missingNonce) missingFields.push("Nonce");
      var msg = "Please input " + missingFields.join(", ") + ".";
      el.missingInputText.textContent = msg;
      el.missingInputBlock.classList.remove("hidden");
      el.resultDetailBlock.classList.add("hidden");
      setStatus("MISMATCH", false);
      return;
    }
    el.missingInputBlock.classList.add("hidden");
    el.resultDetailBlock.classList.remove("hidden");
    var fn = G[cfg.verifyKey];
    if (!fn) return;
    fn({ el: el, H: window.PFHelpers, setStatus: setStatus });
    el.mappedLabel.textContent = cfg.mappedLabel;
    el.finalLabel.textContent = cfg.finalLabel;
  }

  el.verifyBtn.addEventListener("click", function () {
    runVerify(el.game.value);
    el.resultPanel.classList.remove("hidden");
  });

  autoFillFromUrl();
  syncGameView();
  syncServerSeedHashFromSeed();
  if ((el.serverSeed.value || "").trim() || (el.clientSeed.value || "").trim() || (el.nonce.value || "").toString().trim()) {
    runVerify(el.game.value);
    el.resultPanel.classList.remove("hidden");
  }
  el.game.addEventListener("change", function () {
    syncGameView();
    runVerify(el.game.value);
    el.resultPanel.classList.remove("hidden");
  });
  el.serverSeed.addEventListener("input", syncServerSeedHashFromSeed);
})();
