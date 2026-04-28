window.PFGamesCommon = {
  clearDynamicAreas: function (el) {
    el.flipModules.innerHTML = "";
    el.hiloModules.innerHTML = "";
    el.videopokerModules.innerHTML = "";
    el.baccaratModules.innerHTML = "";
    el.towerModules.innerHTML = "";
    el.betweenModules.innerHTML = "";
    el.crashModules.innerHTML = "";
    el.mineGrid.innerHTML = "";
    el.towerGrid.innerHTML = "";
    el.mineModules.innerHTML = "";
    el.zodiacModules.innerHTML = "";
    el.zodiacGrid.innerHTML = "";
    el.bobingModules.innerHTML = "";
    if (el.hash28BallsCrate) el.hash28BallsCrate.innerHTML = "";
  },

  clearScalarLines: function (el) {
    el.resultHash.textContent = "-";
    el.first4BytesHex.textContent = "-";
    el.first4BytesDec.textContent = "-";
    el.randomR.textContent = "-";
    el.groupHex.textContent = "-";
    el.groupValues.textContent = "-";
    el.limboFormula.textContent = "-";
  }
};
