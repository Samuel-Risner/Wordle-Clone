var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var game_id = "";
var amount_tries = 0;
var word_length = 0;
var current_try = 0;
var letters = [];
function set_stuff(new_game_id, new_amount_tries, new_word_length) {
    game_id = new_game_id;
    amount_tries = Number(new_amount_tries);
    word_length = Number(new_word_length);
}
function init_game() {
    var game = document.getElementById("game");
    if (game === null) {
        console.error("Could not retreive html element with the id: 'game'.");
        return;
    }
    var table = document.createElement("table");
    game.appendChild(table);
    var cell_width = 90 / word_length;
    for (var h = 0; h < amount_tries; h++) {
        var tr = document.createElement("tr");
        table.appendChild(tr);
        for (var w = 0; w < word_length; w++) {
            var td = document.createElement("td");
            var div = document.createElement("div");
            td.appendChild(div);
            tr.appendChild(td);
            div.textContent = "" + w + "|" + h;
            // div.style.backgroundColor = "red";
            div.style.width = String(cell_width) + "vw";
            // div.style.paddingTop = "100%";
            // div.style.aspectRatio = "1/1";
            div.className = "letter";
            //             = "background-color: red;
            //   width: 100%;
            //   padding-top: 100%; /* 1:1 Aspect Ratio */
            //   position: relative; /* If you want text inside of it */"
        }
    }
}
function _get_progress_async() {
    return __awaiter(this, void 0, void 0, function () {
        var response, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/json/get_progress/" + game_id)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    json = _a.sent();
                    return [2 /*return*/, json];
            }
        });
    });
}
function _set_progress(json_data) {
    for (var line = 0; line < json_data.length; line++) {
        var word = json_data[line][0];
        var match = json_data[line][1];
        for (var letter = 0; letter < word.length; letter++) {
            var character = word.charAt(letter);
            var num = match[letter];
            letters[line][letter].textContent = character + num;
        }
    }
}
function set_progress() {
    _get_progress_async().then(function (_res) { console.log("SUPER!"); console.log(_res); _set_progress(_res); })["catch"](function (_res) { console.log("UPSI!"); console.log(_res); });
}
