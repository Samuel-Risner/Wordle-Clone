import { create_game_field } from "./game/create_game_field.js";
// import { create_keyboard } from "./game/create_keyboard.js";
import { info_tracker } from "./game/info_tracker.js";
import { test } from "./game/test.js";

create_game_field(
    info_tracker.letters,
    info_tracker.WORD_LENGTH,
    info_tracker.amount_tries,
    info_tracker.GAME
);

// create_keyboard(
//     (_: string) => {},
//     () => {},
//     () => {},
    
// );

// function init_game(): void {
//     var game = document.getElementById("game");

//     if (game === null) {
//         console.error("Could not retreive html element with the id: 'game'.");
//         return;
//     }

//     var table = document.createElement("table");
//     game.appendChild(table);

//     var cell_width = 90 / word_length;

//     for (var h: number = 0; h < amount_tries; h++) {
//         var tr: HTMLTableRowElement = document.createElement("tr");
//         table.appendChild(tr);
//         letters.push([]);

//         for (var w: number = 0; w < word_length; w++) {
//             var td: HTMLTableCellElement = document.createElement("td");
//             tr.appendChild(td);
//             var div: HTMLDivElement = document.createElement("div");
//             td.appendChild(div)
            
//             div.textContent = "";
//             div.style.width = String(cell_width) + "vw";
//             div.style.fontSize = String(cell_width * 0.8) + "vw";
//             div.className = "letter";

//             letters[h].push(div);
//         }
//     }
// }

// /**
//  * This function gets the current game state from the server. This is needed when the user leaves the page or
//  * accidentaly refreshes the game.
//  * @returns A promise for json data.
//  */
// async function _get_progress_async() {
//     var response = await fetch("/json/get_progress/" + game_id);
//     var json = await response.json();

//     return json;
// }

// /**
//  * Sets the position were the user stopped playing the game.
//  */
// function _set_current_letter(): void {
//     for (var h: number = 0; h < letters.length; h++) {
//         for (var w: number = 0; w < letters[h].length; w++) {
//             if (letters[h][w].textContent == "") {
//                 current_letter = [w, h];
//                 current_try = h;
//                 return;
//             }
//         }
//     }
// }

// /**
//  * Undos the last word as long as it wasn't submitted.
//  */
// function _undo_last_word(): void {
//     for (var i: number = 0; i < word_length; i++) {
//         letters[current_letter[1]][i].textContent = "";
//         current_letter = [0, current_letter[1]];
//         current_word = "";
//     }
// }

// /**
//  * Loads the already existing tries into the ui.
//  * @param json_data The data for the tries, it consists of a string, the guesses word, and then an array of numbers
//  * where each number corresponds to a character of the word:
//  *      > 0: letter does not occur in word that the user is trying to guess
//  *      > 1: letter occurs in word but isn't at the right position
//  *      > 2: letter occurs in the word and is at the right position.
//  */
// function _set_progress(json_data: [string, number[]][]): void {
//     for (var line: number = 0; line < json_data.length; line++) {
//         var word = json_data[line][0];
//         var match = json_data[line][1];

//         for (var letter: number = 0; letter < word.length; letter++) {
//             var character = word.charAt(letter);
//             var num = match[letter];
//             var letter_object = letters[line][letter];

//             letter_object.textContent = character;

//             var key = document.getElementById(character);

//             if (key === null) {
//                 console.error("Could not retreive the html element with the id: '" + character + "'.");
//                 return;
//             }

//             if (num == 0) {
//                 letter_object.className = "letter does_not_occur_in_game";
//                 if (key.className == "keyboard_contents button") {
//                     key.className = "keyboard_contents button does_not_occur_in_game";
//                 }
//             } else if (num == 1) {
//                 letter_object.className = "letter occurs_in_word";
//                 if (key.className != "keyboard_contents button correct_position") {
//                     key.className = "keyboard_contents button occurs_in_word";
//                 }
//             } else if (num == 2) {
//                 letter_object.className = "letter correct_position";
//                 key.className = "keyboard_contents button correct_position";
//             }
//         }
//     }

//     _set_current_letter();
// }

// /**
//  * This function handels the promise from the async function `_get_progress_async` and passes it on to the function
//  * `_set_progress`. This function is also called from a script tag in the html file. 
//  */
// function set_progress(): void{
//     _get_progress_async().then(
//         (_res) => {console.log("SUPER!"); console.log(_res); _set_progress(_res)}
//     ).catch(
//         (_res) => {console.log("UPSI!"); console.log(_res);}
//     );
// }

// /**
//  * Enters an letter into the ui.
//  * @param letter The letter that is to be entered into the ui.
//  */
// function _add_letter(letter: string): void {
//     if (current_letter[0] >= word_length) {
//         return;
//     }

//     if (current_try >= amount_tries) {
//         return;
//     }

//     letters[current_letter[1]][current_letter[0]].textContent = letter;
//     current_letter[0] = current_letter[0] + 1;
//     current_word = current_word + letter;
// }

// /**
//  * Removes the last letter that was entered into the ui, aslong as the entered word wasn't submited.
//  */
// function _remove_letter(): void {
//     if (current_letter[0] <= 0) {
//         return;
//     }

//     current_word = current_word.substring(0, current_word.length - 1);
//     current_letter[0] = current_letter[0] - 1;
//     letters[current_letter[1]][current_letter[0]].textContent = "";
// }

// /**
//  * @returns A promise with json data containing the matches for the characters with the guessed word.
//  */
// async function _get_word_result() {
//     var response = await fetch("/json/add_word/" + game_id + "/" + current_word);
//     var json = await response.json();

//     return json;
// }

// function _evaluate_submit_result(json_data: number[] | null): void {
//     if (json_data === null) {
//         _undo_last_word();
//         return;
//     }

//     for (var i: number = 0; i < word_length; i++) {
//         var letter_object = letters[current_letter[1]][i];
//         var num = json_data[i];
//         var character = current_word.charAt(i);

//         var key = document.getElementById(character);

//         if (key === null) {
//             console.error("Could not retreive the html element with the id: '" + character + "'.");
//             return;
//         }

//         if (num == 0) {
//             letter_object.className = "letter does_not_occur_in_game";
//             if (key.className == "keyboard_contents button") {
//                 key.className = "keyboard_contents button does_not_occur_in_game";
//             }
//         } else if (num == 1) {
//             letter_object.className = "letter occurs_in_word";
//             if (key.className != "keyboard_contents button correct_position") {
//                 key.className = "keyboard_contents button occurs_in_word";
//             }
//         } else if (num == 2) {
//             letter_object.className = "letter correct_position";
//             key.className = "keyboard_contents button correct_position";
//         }
//     }

//     current_word = "";
//     current_letter = [0, current_letter[1] + 1];
//     current_try = current_try + 1;

//     _victory(json_data);
// }

// function _enter(): void {
//     if (current_word.length != word_length) {
//         return;
//     }

//     enter_button.disabled = true;
//     delete_button.disabled = true;

//     _get_word_result().then(
//         (_res) => {
//             console.log("SUPER!");
//             console.log(_res);
//             _evaluate_submit_result(_res);
//             enter_button.disabled = false;
//             delete_button.disabled = false;
//         }
//     ).catch(
//         (_res) => {console.log("UPSI!"); console.log(_res);}
//     );
// }


// function _victory(json_data: number[]): void {
//     for (var i: number = 0; i < json_data.length; i++) {
//         if (json_data[i] != 2) {
//             if (current_try == amount_tries) {
//                 window.location.href = "/game/result/" + game_id;
//             }

//             return;
//         }
//     }
//     window.location.href = "/game/result/" + game_id;
// }

// window.onkeydown = function(event): void {
//     console.log(event.keyCode);
//     let code: number = event.keyCode;

//     // enter
//     if (code === 13) {
//         _enter();

//     // backspace 
//     } else if (code === 8) {
//         _remove_letter();

//     // letter
//     } else {
//         if (code < 65) {
//             return;
//         }
//         if (code > 90) {
//             return;
//         }
//         let key: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(code - 65);
//         _add_letter(key);
//     }
// }