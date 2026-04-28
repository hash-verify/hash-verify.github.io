window.PFHelpers = {
  hex8ToParts: function (hex8) {
    var b1 = parseInt(hex8.slice(0, 2), 16);
    var b2 = parseInt(hex8.slice(2, 4), 16);
    var b3 = parseInt(hex8.slice(4, 6), 16);
    var b4 = parseInt(hex8.slice(6, 8), 16);
    var r = (b1 / Math.pow(256, 1)) +
      (b2 / Math.pow(256, 2)) +
      (b3 / Math.pow(256, 3)) +
      (b4 / Math.pow(256, 4));
    return { b1: b1, b2: b2, b3: b3, b4: b4, r: r };
  },

  escapeHtml: function (s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  getZodiacBoard: function (difficulty) {
    if (difficulty === "easy") return { n: 4, label: "4×4" };
    if (difficulty === "hard") return { n: 7, label: "7×7" };
    return { n: 5, label: "5×5" };
  },

  coordFromCell: function (n, cell) {
    var x = (cell % n) + 1;
    var y = n - Math.floor(cell / n);
    return "(" + x + "," + y + ")";
  },

    scaledFloorRx: function (mult, result) {
    return "floor(R × " + mult + ") = " + result;
  },

    scaledHash28Sum: function (v1, v2, v3, sum) {
    return "floor(R₁×10) + floor(R₂×10) + floor(R₃×10) = " + v1 + " + " + v2 + " + " + v3 + " = " + sum;
  },

    scaledFloorSeries: function (items, maxChars) {
    maxChars = maxChars || 480;
    var sep = "; ";
    var out = "";
    for (var i = 0; i < items.length; i += 1) {
      var piece = "floor(R×" + items[i].pool + ")=" + items[i].idx;
      if (out.length + (out ? sep.length : 0) + piece.length > maxChars) {
        return out + " … (+" + (items.length - i) + " more)";
      }
      out += (out ? sep : "") + piece;
    }
    return out || "-";
  },

    scaledBobingSix: function (faces) {
    var parts = [];
    for (var i = 0; i < faces.length; i += 1) {
      parts.push("floor(R×6)+1=" + faces[i]);
    }
    return parts.join("; ");
  },

    scaledFlipSeries: function (bits, twoRList, maxShown) {
    maxShown = maxShown || 16;
    var parts = [];
    for (var i = 0; i < bits.length && i < maxShown; i += 1) {
      var t = twoRList && twoRList[i] !== undefined ? twoRList[i] : null;
      if (t !== null && Number.isFinite(t)) {
        var f = Math.floor(t + 1e-9);
        parts.push("#" + i + ": floor(R×2) = " + f);
      } else {
        parts.push("#" + i + ": floor(R×2) = " + (bits[i] == null ? "-" : bits[i]));
      }
    }
    var s = parts.join("; ");
    if (bits.length > maxShown) s += " … (+" + (bits.length - maxShown) + " more)";
    return s;
  }
};
