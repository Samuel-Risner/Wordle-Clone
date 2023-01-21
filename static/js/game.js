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
var current_letter = [0, 0];
var current_word = "";
/**
 * This function is called from a script tag in the html file.
 * @param new_game_id The game id that is going to be used.
 * @param new_amount_tries How many tries the user has / how often they can guess.
 * @param new_word_length The length of the word the user is trying to guess.
 */
function set_stuff(new_game_id, new_amount_tries, new_word_length) {
    game_id = new_game_id;
    amount_tries = Number(new_amount_tries);
    word_length = Number(new_word_length);
}
/**
 * Creates the ui in which the user can see their guesses. This function is called from a script tag in the html file.
 */
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
        letters.push([]);
        for (var w = 0; w < word_length; w++) {
            var td = document.createElement("td");
            tr.appendChild(td);
            var div = document.createElement("div");
            td.appendChild(div);
            div.textContent = "";
            div.style.width = String(cell_width) + "vw";
            div.style.fontSize = String(cell_width * 0.8) + "vw";
            div.className = "letter";
            letters[h].push(div);
        }
    }
}
/**
 * This function gets the current game state from the server. This is needed when the user leaves the page or
 * accidentaly refreshes the game.
 * @returns A promise for json data.
 */
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
/**
 * Sets the position were the user stopped playing the game.
 */
function _set_current_letter() {
    for (var h = 0; h < letters.length; h++) {
        for (var w = 0; w < letters[h].length; w++) {
            if (letters[h][w].textContent == "") {
                current_letter = [w, h];
                current_try = h;
                return;
            }
        }
    }
}
/**
 * Undos the last word as long as it wasn't submitted.
 */
function _undo_last_word() {
    for (var i = 0; i < word_length; i++) {
        letters[current_letter[1]][i].textContent = "";
        current_letter = [0, current_letter[1]];
        current_word = "";
    }
}
/**
 * Loads the already existing tries into the ui.
 * @param json_data The data for the tries, it consists of a string, the guesses word, and then an array of numbers
 * where each number corresponds to a character of the word:
 *      > 0: letter does not occur in word that the user is trying to guess
 *      > 1: letter occurs in word but isn't at the right position
 *      > 2: letter occurs in the word and is at the right position.
 */
function _set_progress(json_data) {
    for (var line = 0; line < json_data.length; line++) {
        var word = json_data[line][0];
        var match = json_data[line][1];
        for (var letter = 0; letter < word.length; letter++) {
            var character = word.charAt(letter);
            var num = match[letter];
            var letter_object = letters[line][letter];
            letter_object.textContent = character;
            if (num == 0) {
                letter_object.className = "letter does_not_occur_in_game";
            }
            else if (num == 1) {
                letter_object.className = "letter occurs_in_word";
            }
            else if (num == 2) {
                letter_object.className = "letter correct_position";
            }
        }
    }
    _set_current_letter();
}
/**
 * This function handels the promise from the async function `_get_progress_async` and passes it on to the function
 * `_set_progress`. This function is also called from a script tag in the html file.
 */
function set_progress() {
    _get_progress_async().then(function (_res) { console.log("SUPER!"); console.log(_res); _set_progress(_res); })["catch"](function (_res) { console.log("UPSI!"); console.log(_res); });
}
/**
 * Enters an letter into the ui.
 * @param letter The letter that is to be entered into the ui.
 */
function _add_letter(letter) {
    if (current_letter[0] >= word_length) {
        return;
    }
    if (current_try >= amount_tries) {
        return;
    }
    letters[current_letter[1]][current_letter[0]].textContent = letter;
    current_letter[0] = current_letter[0] + 1;
    current_word = current_word + letter;
}
/**
 * Removes the last letter that was entered into the ui, aslong as the entered word wasn't submited.
 */
function _remove_letter() {
    if (current_letter[0] <= 0) {
        return;
    }
    current_word = current_word.substring(0, current_word.length - 1);
    current_letter[0] = current_letter[0] - 1;
    letters[current_letter[1]][current_letter[0]].textContent = "";
}
/**
 *
 * @returns A promise with json data containing the matches for the characters with the guessed word.
 */
function _get_word_result() {
    return __awaiter(this, void 0, void 0, function () {
        var response, json;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/json/add_word/" + game_id + "/" + current_word)];
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
function _evaluate_submit_result(json_data) {
    if (json_data === null) {
        _undo_last_word();
        return;
    }
    for (var i = 0; i < word_length; i++) {
        var letter_object = letters[current_letter[1]][i];
        var num = json_data[i];
        if (num == 0) {
            letter_object.className = "letter does_not_occur_in_game";
        }
        else if (num == 1) {
            letter_object.className = "letter occurs_in_word";
        }
        else if (num == 2) {
            letter_object.className = "letter correct_position";
        }
    }
    current_word = "";
    current_letter = [0, current_letter[1] + 1];
    current_try = current_try + 1;
    _victory(json_data);
}
function _enter() {
    if (current_word.length != word_length) {
        return;
    }
    _get_word_result().then(function (_res) { console.log("SUPER!"); console.log(_res); _evaluate_submit_result(_res); })["catch"](function (_res) { console.log("UPSI!"); console.log(_res); });
}
/**
 * Creates the keyboard for the user.
 */
function create_keyboard() {
    var keyboard_object = document.getElementById("keyboard");
    if (keyboard_object === null) {
        console.error("Could not retreive html element with id: 'keyboard'.");
        return;
    }
    var row_1 = "QWERTZUIOP";
    var row_2 = "ASDFGHJKL";
    var row_3 = "YXCVBNM";
    // row 1
    var table = document.createElement("table");
    keyboard_object.appendChild(table);
    var row = document.createElement("tr");
    table.appendChild(row);
    var _loop_1 = function () {
        cell = document.createElement("td");
        row.appendChild(cell);
        div = document.createElement("div");
        cell.appendChild(div);
        button = document.createElement("button");
        div.appendChild(button);
        var letter_ = row_1.charAt(letter);
        button.textContent = letter_;
        button.onclick = function () { _add_letter(letter_); };
        button.id = letter_;
        button.className = "keyboard_contents button";
    };
    var cell, div, button;
    for (var letter = 0; letter < row_1.length; letter++) {
        _loop_1();
    }
    // row 2
    var table = document.createElement("table");
    keyboard_object.appendChild(table);
    var row = document.createElement("tr");
    table.appendChild(row);
    var _loop_2 = function () {
        cell = document.createElement("td");
        row.appendChild(cell);
        div = document.createElement("div");
        cell.appendChild(div);
        button = document.createElement("button");
        div.appendChild(button);
        var letter_ = row_2.charAt(letter);
        button.textContent = letter_;
        button.onclick = function () { _add_letter(letter_); };
        button.id = letter_;
        button.className = "keyboard_contents button";
    };
    var cell, div, button;
    for (var letter = 0; letter < row_2.length; letter++) {
        _loop_2();
    }
    // row 3
    var table = document.createElement("table");
    keyboard_object.appendChild(table);
    var row = document.createElement("tr");
    table.appendChild(row);
    // Enter button
    var cell = document.createElement("td");
    cell.className = "keyboard_contents special_key";
    row.appendChild(cell);
    var div = document.createElement("div");
    cell.appendChild(div);
    var button = document.createElement("button");
    div.appendChild(button);
    var img = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/enter_key.svg";
    button.onclick = _enter;
    button.className = "keyboard_contents button";
    var _loop_3 = function () {
        cell = document.createElement("td");
        row.appendChild(cell);
        div = document.createElement("div");
        cell.appendChild(div);
        button = document.createElement("button");
        div.appendChild(button);
        var letter_ = row_3.charAt(letter);
        button.textContent = letter_;
        button.onclick = function () { _add_letter(letter_); };
        button.id = letter_;
        button.className = "keyboard_contents button";
    };
    var cell, div, button;
    for (var letter = 0; letter < row_3.length; letter++) {
        _loop_3();
    }
    // delete button
    var cell = document.createElement("td");
    cell.className = "keyboard_contents special_key";
    row.appendChild(cell);
    var div = document.createElement("div");
    cell.appendChild(div);
    var button = document.createElement("button");
    div.appendChild(button);
    var img = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/delete_key_v2.svg";
    button.onclick = _remove_letter;
    button.className = "keyboard_contents button";
}
function _victory(json_data) {
    for (var i = 0; i < json_data.length; i++) {
        if (json_data[i] != 2) {
            if (current_try == amount_tries) {
                window.location.href = "/game/result/" + game_id;
            }
            return;
        }
    }
    window.location.href = "/game/result/" + game_id;
}
window.onkeydown = function (event) {
    console.log(event.keyCode);
    var code = event.keyCode;
    // enter
    if (code === 13) {
        _enter();
        // backspace 
    }
    else if (code === 8) {
        _remove_letter();
        // letter
    }
    else {
        if (code < 65) {
            return;
        }
        if (code > 90) {
            return;
        }
        var key = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(code - 65);
        _add_letter(key);
    }
};
