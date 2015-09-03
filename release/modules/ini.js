"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parse = decode;
exports.decode = decode;
exports.stringify = encode;
exports.encode = encode;
exports.safe = safe;
exports.unsafe = unsafe;

var eol = process.platform === "win32" ? "\r\n" : "\n";
function encode(obj, opt) {
    var children = [],
        out = "";
    if (typeof opt === "string") {
        opt = {
            section: opt,
            whitespace: false
        };
    } else {
        opt = opt || {};
        opt.whitespace = opt.whitespace === true;
    }
    var separator = " = ";
    Object.keys(obj).forEach(function (k, _, __) {
        var val = obj[k];
        if (val && Array.isArray(val)) {
            val.forEach(function (item) {
                out += safe(k + "[]") + separator + safe(item) + "\n";
            });
        } else if (val && typeof val === "object") {
            children.push(k);
        } else {
            out += safe(k) + separator + safe(val) + eol;
        }
    });
    if (opt.section && out.length) {
        out = "[" + safe(opt.section) + "]" + eol + out;
    }
    children.forEach(function (k, _, __) {
        var nk = dotSplit(k).join('\\.');
        var section = (opt.section ? opt.section + "." : "") + nk;
        var child = encode(obj[k], {
            section: section,
            whitespace: opt.whitespace
        });
        if (out.length && child.length) {
            out += eol;
        }
        out += child;
    });
    return out;
}
function dotSplit(str) {
    return str.replace(/\1/g, "\u0002LITERAL\\1LITERAL\u0002").replace(/\\\./g, "\u0001").split(/\./).map(function (part) {
        return part.replace(/\1/g, '\\.').replace(/\2LITERAL\\1LITERAL\2/g, "\u0001");
    });
}
function decode(str) {
    var out = {},
        p = out,
        state = "START",
        re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i,
        lines = str.split(/[\r\n]+/g),
        section = null;
    lines.forEach(function (line, _, __) {
        if (!line || line.match(/^\s*[;#]/)) {
            return;
        }
        var match = line.match(re);
        if (!match) {
            return;
        }
        if (match[1] !== undefined) {
            section = unsafe(match[1]);
            p = out[section] = out[section] || {};
            return;
        }
        var key = unsafe(match[2]),
            value = match[3] ? unsafe(match[4] || "") : true;
        if (key.length > 2 && key.slice(-2) === "[]") {
            key = key.substring(0, key.length - 2);
            if (!p[key]) {
                p[key] = [];
            } else if (!Array.isArray(p[key])) {
                p[key] = [p[key]];
            }
        }
        if (isInt(value)) {
            p[key] = parseInt(value);
        } else {
            p[key] = parseFloat(value);
        }
    });
    Object.keys(out).filter(function (k, _, __) {
        if (!out[k] || typeof out[k] !== "object" || Array.isArray(out[k])) return false;
        var parts = dotSplit(k),
            p = out,
            l = parts.pop(),
            nl = l.replace(/\\\./g, '.');
        parts.forEach(function (part, _, __) {
            if (!p[part] || typeof p[part] !== "object") {
                p[part] = {};
            }
            p = p[part];
        });
        if (p === out && nl === l) {
            return false;
        }
        p[nl] = out[k];
        return true;
    }).forEach(function (del, _, __) {
        delete out[del];
    });
    return out;
}
function isQuoted(val) {
    return val.charAt(0) === "\"" && val.slice(-1) === "\"" || val.charAt(0) === "'" && val.slice(-1) === "'";
}
function safe(val) {
    return typeof val !== "string" || val.match(/[=\r\n]/) || val.match(/^\[/) || val.length > 1 && isQuoted(val) || val !== val.trim() ? JSON.stringify(val) : val.replace(/;/g, '\\;').replace(/#/g, "\\#");
}
function unsafe(val) {
    val = (val || "").trim();
    if (isQuoted(val)) {
        if (val.charAt(0) === "'") {
            val = val.substr(1, val.length - 2);
        }
        try {
            val = JSON.parse(val);
        } catch (_) {}
    } else {
        var esc = false;
        var unesc = "";
        for (var i = 0, l = val.length; i < l; i++) {
            var c = val.charAt(i);
            if (esc) {
                if ("\\;#".indexOf(c) !== -1) unesc += c;else unesc += "\\" + c;
                esc = false;
            } else if (";#".indexOf(c) !== -1) {
                break;
            } else if (c === "\\") {
                esc = true;
            } else {
                unesc += c;
            }
        }
        if (esc) unesc += "\\";
        return unesc;
    }
    return val;
}
var isInt = function isInt(n) {
    return parseInt(n) === n;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZXMvaW5pLnRzIl0sIm5hbWVzIjpbImVuY29kZSIsImRvdFNwbGl0IiwiZGVjb2RlIiwiaXNRdW90ZWQiLCJzYWZlIiwidW5zYWZlIl0sIm1hcHBpbmdzIjoiOzs7OztRQUFRLEtBQWUsR0FBZixNQUFBO1FBQWlCLE1BQU0sR0FBTixNQUFNO1FBQ3ZCLFNBQW1CLEdBQW5CLE1BQUE7UUFBcUIsTUFBTSxHQUFOLE1BQU07UUFDM0IsSUFBSSxHQUFKLElBQUk7UUFBRSxNQUFNLEdBQU4sTUFBTTs7QUFFcEIsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztBQUV2RCxTQUFBLE1BQUEsQ0FBaUIsR0FBRyxFQUFFLEdBQUcsRUFBQTtBQUN2QkEsUUFBSUEsUUFBUUEsR0FBR0EsRUFBRUE7UUFDakJBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBO0FBRVRBLFFBQUlBLE9BQU9BLEdBQUdBLEtBQUtBLFFBQVFBLEVBQUVBO0FBQzNCQSxXQUFHQSxHQUFHQTtBQUNKQSxtQkFBT0EsRUFBRUEsR0FBR0E7QUFDWkEsc0JBQVVBLEVBQUVBLEtBQUtBO1NBQ2xCQSxDQUFDQTtLQUNIQSxNQUFNQTtBQUNMQSxXQUFHQSxHQUFHQSxHQUFHQSxJQUFJQSxFQUFFQSxDQUFDQTtBQUNoQkEsV0FBR0EsQ0FBQ0EsVUFBVUEsR0FBR0EsR0FBR0EsQ0FBQ0EsVUFBVUEsS0FBS0EsSUFBSUEsQ0FBQ0E7S0FDMUNBO0FBRURBLFFBQUlBLFNBQVNBLEdBQUdBLEtBQUtBLENBQUNBO0FBRXRCQSxVQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxVQUFVQSxDQUFDQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxFQUFBQTtBQUN6QyxZQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakIsWUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8s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SUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsRUFBRUE7QUFDakNBLHNCQUFNQTthQUNQQSxNQUFNQSxJQUFJQSxDQUFDQSxLQUFLQSxJQUFJQSxFQUFFQTtBQUNyQkEsbUJBQUdBLEdBQUdBLElBQUlBLENBQUNBO2FBQ1pBLE1BQU1BO0FBQ0xBLHFCQUFLQSxJQUFJQSxDQUFDQSxDQUFDQTthQUNaQTtTQUNGQTtBQUNEQSxZQUFJQSxHQUFHQSxFQUNMQSxLQUFLQSxJQUFJQSxJQUFJQSxDQUFDQTtBQUNoQkEsZUFBT0EsS0FBS0EsQ0FBQ0E7S0FDZEE7QUFDREEsV0FBT0EsR0FBR0EsQ0FBQ0E7Q0FDWkE7QUFFRCxJQUFJLEtBQUssR0FBRyxTQUFSLEtBQUssQ0FBWSxDQUFDLEVBQUE7QUFDcEIsV0FBTyxRQUFRLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0NBQzFCLENBQUEiLCJmaWxlIjoibW9kdWxlcy9pbmkuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQge2RlY29kZSBhcyBwYXJzZSwgZGVjb2RlfTtcbmV4cG9ydCB7ZW5jb2RlIGFzIHN0cmluZ2lmeSwgZW5jb2RlfTtcbmV4cG9ydCB7c2FmZSwgdW5zYWZlfTtcblxudmFyIGVvbCA9IHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIiA/IFwiXFxyXFxuXCIgOiBcIlxcblwiO1xuXG5mdW5jdGlvbiBlbmNvZGUgKG9iaiwgb3B0KSB7XG4gIHZhciBjaGlsZHJlbiA9IFtdLFxuICBvdXQgPSBcIlwiO1xuXG4gIGlmICh0eXBlb2Ygb3B0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgb3B0ID0ge1xuICAgICAgc2VjdGlvbjogb3B0LFxuICAgICAgd2hpdGVzcGFjZTogZmFsc2VcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIG9wdCA9IG9wdCB8fCB7fTtcbiAgICBvcHQud2hpdGVzcGFjZSA9IG9wdC53aGl0ZXNwYWNlID09PSB0cnVlO1xuICB9XG5cbiAgdmFyIHNlcGFyYXRvciA9IFwiID0gXCI7XG5cbiAgT2JqZWN0LmtleXMob2JqKS5mb3JFYWNoKGZ1bmN0aW9uIChrLCBfLCBfXykge1xuICAgIHZhciB2YWwgPSBvYmpba107XG4gICAgaWYgKHZhbCAmJiBBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIHZhbC5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgb3V0ICs9IHNhZmUoayArIFwiW11cIikgKyBzZXBhcmF0b3IgKyBzYWZlKGl0ZW0pICsgXCJcXG5cIjtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh2YWwgJiYgdHlwZW9mIHZhbCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgY2hpbGRyZW4ucHVzaChrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0ICs9IHNhZmUoaykgKyBzZXBhcmF0b3IgKyBzYWZlKHZhbCkgKyBlb2w7XG4gICAgfVxuICB9KTtcblxuICBpZiAob3B0LnNlY3Rpb24gJiYgb3V0Lmxlbmd0aCkge1xuICAgIG91dCA9IFwiW1wiICsgc2FmZShvcHQuc2VjdGlvbikgKyBcIl1cIiArIGVvbCArIG91dDtcbiAgfVxuXG4gIGNoaWxkcmVuLmZvckVhY2goZnVuY3Rpb24gKGssIF8sIF9fKSB7XG4gICAgdmFyIG5rID0gZG90U3BsaXQoaykuam9pbignXFxcXC4nKTtcbiAgICB2YXIgc2VjdGlvbiA9IChvcHQuc2VjdGlvbiA/IG9wdC5zZWN0aW9uICsgXCIuXCIgOiBcIlwiKSArIG5rO1xuICAgIHZhciBjaGlsZCA9IGVuY29kZShvYmpba10sIHtcbiAgICBzZWN0aW9uOiBzZWN0aW9uLFxuICAgIHdoaXRlc3BhY2U6IG9wdC53aGl0ZXNwYWNlXG4gICAgfSk7XG4gICAgaWYgKG91dC5sZW5ndGggJiYgY2hpbGQubGVuZ3RoKSB7XG4gICAgICBvdXQgKz0gZW9sO1xuICAgIH1cbiAgICBvdXQgKz0gY2hpbGQ7XG4gIH0pO1xuXG4gIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIGRvdFNwbGl0IChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXDEvZywgJ1xcdTAwMDJMSVRFUkFMXFxcXDFMSVRFUkFMXFx1MDAwMicpXG4gICAgLnJlcGxhY2UoL1xcXFxcXC4vZywgJ1xcdTAwMDEnKVxuICAgIC5zcGxpdCgvXFwuLykubWFwKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICByZXR1cm4gcGFydC5yZXBsYWNlKC9cXDEvZywgJ1xcXFwuJylcbiAgICAgICAgLnJlcGxhY2UoL1xcMkxJVEVSQUxcXFxcMUxJVEVSQUxcXDIvZywgJ1xcdTAwMDEnKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZGVjb2RlIChzdHIpIHtcbiAgdmFyIG91dCA9IHt9LFxuICBwID0gb3V0LFxuICBzdGF0ZSA9IFwiU1RBUlRcIixcbiAgLy8gc2VjdGlvbiAgICAgfGtleSA9IHZhbHVlXG4gIHJlID0gL15cXFsoW15cXF1dKilcXF0kfF4oW149XSspKD0oLiopKT8kL2ksXG4gIGxpbmVzID0gc3RyLnNwbGl0KC9bXFxyXFxuXSsvZyksXG4gIHNlY3Rpb24gPSBudWxsO1xuXG4gIGxpbmVzLmZvckVhY2goZnVuY3Rpb24gKGxpbmUsIF8sIF9fKSB7XG4gICAgaWYgKCFsaW5lIHx8IGxpbmUubWF0Y2goL15cXHMqWzsjXS8pKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIG1hdGNoID0gbGluZS5tYXRjaChyZSk7XG5cbiAgICBpZiAoIW1hdGNoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoWzFdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHNlY3Rpb24gPSB1bnNhZmUobWF0Y2hbMV0pO1xuICAgICAgcCA9IG91dFtzZWN0aW9uXSA9IG91dFtzZWN0aW9uXSB8fCB7fTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIga2V5ID0gdW5zYWZlKG1hdGNoWzJdKSxcbiAgICB2YWx1ZSA9IG1hdGNoWzNdID8gdW5zYWZlKChtYXRjaFs0XSB8fCBcIlwiKSkgOiB0cnVlO1xuXG4gICAgLy8gQ29udmVydCBrZXlzIHdpdGggJ1tdJyBzdWZmaXggdG8gYW4gYXJyYXlcbiAgICBpZiAoa2V5Lmxlbmd0aCA+IDIgJiYga2V5LnNsaWNlKC0yKSA9PT0gXCJbXVwiKSB7XG4gICAgICBrZXkgPSBrZXkuc3Vic3RyaW5nKDAsIGtleS5sZW5ndGggLSAyKTtcbiAgICAgIGlmICghcFtrZXldKSB7XG4gICAgICAgIHBba2V5XSA9IFtdO1xuICAgICAgfSBlbHNlIGlmICghQXJyYXkuaXNBcnJheShwW2tleV0pKSB7XG4gICAgICAgIHBba2V5XSA9IFtwW2tleV1dO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIHNhZmVndWFyZCBhZ2FpbnN0IHJlc2V0dGluZyBhIHByZXZpb3VzbHkgZGVmaW5lZFxuICAgIC8vIGFycmF5IGJ5IGFjY2lkZW50YWxseSBmb3JnZXR0aW5nIHRoZSBicmFja2V0c1xuICAgIGlmIChpc0ludCh2YWx1ZSkpIHtcbiAgICAgIHBba2V5XSA9IHBhcnNlSW50KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcFtrZXldID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgfVxuICB9KTtcblxuICAvLyB7YTp7eToxfSxcImEuYlwiOnt4OjJ9fSAtLT4ge2E6e3k6MSxiOnt4OjJ9fX1cbiAgLy8gdXNlIGEgZmlsdGVyIHRvIHJldHVybiB0aGUga2V5cyB0aGF0IGhhdmUgdG8gYmUgZGVsZXRlZC5cbiAgT2JqZWN0LmtleXMob3V0KS5maWx0ZXIoZnVuY3Rpb24gKGssIF8sIF9fKSB7XG4gICAgaWYgKCFvdXRba10gfHwgdHlwZW9mIG91dFtrXSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KG91dFtrXSkpIHJldHVybiBmYWxzZVxuICAgICAgLy8gc2VlIGlmIHRoZSBwYXJlbnQgc2VjdGlvbiBpcyBhbHNvIGFuIG9iamVjdC5cbiAgICAgIC8vIGlmIHNvLCBhZGQgaXQgdG8gdGhhdCwgYW5kIG1hcmsgdGhpcyBvbmUgZm9yIGRlbGV0aW9uXG4gICAgICB2YXIgcGFydHMgPSBkb3RTcGxpdChrKSxcbiAgICAgIHAgPSBvdXQsXG4gICAgICBsID0gcGFydHMucG9wKCksXG4gICAgICBubCA9IGwucmVwbGFjZSgvXFxcXFxcLi9nLCAnLicpO1xuICAgIHBhcnRzLmZvckVhY2goZnVuY3Rpb24gKHBhcnQsIF8sIF9fKSB7XG4gICAgICBpZiAoIXBbcGFydF0gfHwgdHlwZW9mIHBbcGFydF0gIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcFtwYXJ0XSA9IHt9O1xuICAgICAgfVxuICAgICAgcCA9IHBbcGFydF07XG4gICAgfSk7XG4gICAgaWYgKHAgPT09IG91dCAmJiBubCA9PT0gbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBwW25sXSA9IG91dFtrXTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSkuZm9yRWFjaChmdW5jdGlvbiAoZGVsLCBfLCBfXykge1xuICAgIGRlbGV0ZSBvdXRbZGVsXTtcbiAgfSk7XG5cbiAgcmV0dXJuIG91dDtcbn1cblxuZnVuY3Rpb24gaXNRdW90ZWQgKHZhbCkge1xuICByZXR1cm4gKHZhbC5jaGFyQXQoMCkgPT09IFwiXFxcIlwiICYmIHZhbC5zbGljZSgtMSkgPT09IFwiXFxcIlwiKVxuICAgIHx8ICh2YWwuY2hhckF0KDApID09PSBcIidcIiAmJiB2YWwuc2xpY2UoLTEpID09PSBcIidcIik7XG59XG5cbmZ1bmN0aW9uIHNhZmUodmFsKSB7XG4gIHJldHVybiAodHlwZW9mIHZhbCAhPT0gXCJzdHJpbmdcIlxuICAgICAgfHwgdmFsLm1hdGNoKC9bPVxcclxcbl0vKVxuICAgICAgfHwgdmFsLm1hdGNoKC9eXFxbLylcbiAgICAgIHx8ICh2YWwubGVuZ3RoID4gMVxuICAgICAgICAmJiBpc1F1b3RlZCh2YWwpKVxuICAgICAgfHwgdmFsICE9PSB2YWwudHJpbSgpKVxuICAgID8gSlNPTi5zdHJpbmdpZnkodmFsKVxuICAgIDogdmFsLnJlcGxhY2UoLzsvZywgJ1xcXFw7JykucmVwbGFjZSgvIy9nLCBcIlxcXFwjXCIpO1xufVxuXG5mdW5jdGlvbiB1bnNhZmUodmFsKSB7XG4gIHZhbCA9ICh2YWwgfHwgXCJcIikudHJpbSgpO1xuICBpZiAoaXNRdW90ZWQodmFsKSkge1xuICAgIC8vIHJlbW92ZSB0aGUgc2luZ2xlIHF1b3RlcyBiZWZvcmUgY2FsbGluZyBKU09OLnBhcnNlXG4gICAgaWYgKHZhbC5jaGFyQXQoMCkgPT09IFwiJ1wiKSB7XG4gICAgICB2YWwgPSB2YWwuc3Vic3RyKDEsIHZhbC5sZW5ndGggLSAyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgIHZhbCA9IEpTT04ucGFyc2UodmFsKTtcbiAgICB9IGNhdGNoIChfKSB7fVxuICB9IGVsc2Uge1xuICAgIC8vIHdhbGsgdGhlIHZhbCB0byBmaW5kIHRoZSBmaXJzdCBub3QtZXNjYXBlZCA7IGNoYXJhY3RlclxuICAgIHZhciBlc2MgPSBmYWxzZTtcbiAgICB2YXIgdW5lc2MgPSBcIlwiO1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gdmFsLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdmFyIGMgPSB2YWwuY2hhckF0KGkpO1xuICAgICAgaWYgKGVzYykge1xuICAgICAgICBpZiAoXCJcXFxcOyNcIi5pbmRleE9mKGMpICE9PSAtMSlcbiAgICAgICAgICB1bmVzYyArPSBjO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdW5lc2MgKz0gXCJcXFxcXCIgKyBjO1xuICAgICAgICBlc2MgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAoXCI7I1wiLmluZGV4T2YoYykgIT09IC0xKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIGlmIChjID09PSBcIlxcXFxcIikge1xuICAgICAgICBlc2MgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdW5lc2MgKz0gYztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVzYylcbiAgICAgIHVuZXNjICs9IFwiXFxcXFwiO1xuICAgIHJldHVybiB1bmVzYztcbiAgfVxuICByZXR1cm4gdmFsO1xufVxuXG52YXIgaXNJbnQgPSBmdW5jdGlvbihuKSB7XG4gIHJldHVybiBwYXJzZUludChuKSA9PT0gbjtcbn1cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9