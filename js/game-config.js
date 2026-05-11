window.PFGameConfig = {
  dice: {
    verifyKey: "verifyDice",
    subtitle: "Dice · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["crashModules"]
  },
  roulette: {
    verifyKey: "verifyRoulette",
    subtitle: "Roulette · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["crashModules"]
  },
  hash28: {
    verifyKey: "verifyHash28",
    subtitle: "Hash28 · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["resultHashLine", "hash28BallsCrate", "mappedLine", "finalLine"]
  },
  flipcoin: {
    verifyKey: "verifyFlipCoin",
    subtitle: "Flip Coin · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["flipCountField", "flipModules"]
  },
  hilo: {
    verifyKey: "verifyHilo",
    subtitle: "HiLo · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["hiloModules", "finalLine"]
  },
  videopoker: {
    verifyKey: "verifyVideoPoker",
    subtitle: "Video Poker · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["videopokerModules", "finalLine"]
  },
  baccarat: {
    verifyKey: "verifyBaccarat",
    subtitle: "Baccarat · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["baccaratModules", "mappedLine", "finalLine"]
  },
  towerlegend: {
    verifyKey: "verifyTowerLegend",
    subtitle: "Tower Legend · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["towerDiffField", "towerGridLine", "towerModules", "finalLine"]
  },
  between: {
    verifyKey: "verifyBetween",
    subtitle: "Between · HMAC_SHA256(serverSeed, clientSeed)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["roundCountField", "betweenModules"]
  },
  xocdia: {
    verifyKey: "verifyXocdia",
    subtitle: "Xoc Dia · HMAC_SHA256(serverSeed, clientSeed)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["roundCountField", "betweenModules"]
  },
  cockfight: {
    verifyKey: "verifyCockfight",
    subtitle: "Cockfight · HMAC_SHA256(serverSeed, clientSeed)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["roundCountField", "betweenModules"]
  },
  crash: {
    verifyKey: "verifyCrash",
    subtitle: "Crash · HMAC_SHA256(serverSeed, clientSeed)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["roundCountField", "crashModules"]
  },
  limbo: {
    verifyKey: "verifyLimbo",
    subtitle: "Limbo · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["crashModules"]
  },
  mine: {
    verifyKey: "verifyMine",
    subtitle: "Mine · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["mineCountField", "mineGridLine", "mineModules", "finalLine"]
  },
  zodiac: {
    verifyKey: "verifyZodiac",
    subtitle: "Zodiac · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["zodiacDiffField", "zodiacGridLine", "zodiacModules", "finalLine"]
  },
  bobing: {
    verifyKey: "verifyBobing",
    subtitle: "Bobing · HMAC_SHA256(serverSeed, clientSeed:nonce:cursor)",
    mappedLabel: "Scaled Value:",
    finalLabel: "Final Result:",
    show: ["bobingModules", "mappedLine", "finalLine"]
  }
};
