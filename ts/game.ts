import { create_game_field } from "./game/create_game_field.js";
import { create_keyboard } from "./game/create_keyboard.js";
import { set_progress } from "./game/fetchers.js";
import { info_tracker } from "./game/info_tracker.js";

/**
 * Returns the position were the user stopped playing the game.
 */
function set_current_letter(letters: HTMLDivElement[][]): [number, number] {
    let current_letter: [number, number] = [0, 0];

    for (var h: number = 0; h < letters.length; h++) {
        for (var w: number = 0; w < letters[h].length; w++) {
            if (letters[h][w].textContent == "") {
                return current_letter = [w, h];
            }
        }
    }

    return current_letter;
}

create_keyboard(
    (_:string) => {},
    () => {},
    () => {}
)

create_game_field(
    info_tracker.letters,
    info_tracker.WORD_LENGTH,
    info_tracker.amount_tries,
    info_tracker.GAME
);

set_progress(
    info_tracker.GAME_ID,
    info_tracker.letters,
    () => {
        // Set the users current progress.
        let pos = set_current_letter(info_tracker.letters);
        info_tracker.current_letter[0] = pos[0];
        info_tracker.current_letter[1] = pos[1];
    }
);



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