import { colour_key, colour_letter } from "./game/colour.js";
import { create_game_field } from "./game/create_game_field.js";
import { create_keyboard, disable_all, enable_all } from "./game/create_keyboard.js";
import { set_progress, submit_word } from "./game/fetchers.js";
import { info_tracker } from "./game/info_tracker.js";

/**
 * Returns the position were the user stopped playing the game.
 */
function set_current_letter(): void {
    for (var h: number = 0; h < info_tracker.letters.length; h++) {
        for (var w: number = 0; w < info_tracker.letters[h].length; w++) {
            if (info_tracker.letters[h][w].textContent == "") {
                info_tracker.current_letter[0] = w;
                info_tracker.current_letter[1] = h;
                return;
            }
        }
    }
}

/**
 * Enters an letter into the ui.
 * @param letter The letter that is to be entered into the ui.
 */
function add_letter(letter: string): void {
    if (info_tracker.current_letter[0] >= info_tracker.WORD_LENGTH) {
        return;
    }

    if (info_tracker.current_try >= info_tracker.amount_tries) {
        return;
    }

    info_tracker.letters[info_tracker.current_letter[1]][info_tracker.current_letter[0]].textContent = letter;
    info_tracker.current_letter[0] = info_tracker.current_letter[0] + 1;
    info_tracker.current_word = info_tracker.current_word + letter;
}

/**
 * Removes the last letter that was entered into the ui, aslong as the entered word wasn't submited.
 */
function delete_button(): void {
    if (info_tracker.current_letter[0] <= 0) {
        return;
    }

    info_tracker.current_word = info_tracker.current_word.substring(0, info_tracker.current_word.length - 1);
    info_tracker.current_letter[0] = info_tracker.current_letter[0] - 1;
    info_tracker.letters[info_tracker.current_letter[1]][info_tracker.current_letter[0]].textContent = "";
}

function enter_button(): void {
    if (info_tracker.current_word.length != info_tracker.WORD_LENGTH) {
        return;
    }

    disable_all();

    submit_word(
        info_tracker.current_word,
        info_tracker.GAME_ID,
        enable_all,
        evaluate_submit
    )
}

/**
 * Undos the last word as long as it wasn't submitted.
 */
function undo_last_word(): void {
    for (var i: number = 0; i < info_tracker.WORD_LENGTH; i++) {
        info_tracker.letters[info_tracker.current_letter[1]][i].textContent = "";
        info_tracker.current_letter = [0, info_tracker.current_letter[1]];
        info_tracker.current_word = "";
    }
}

function evaluate_submit(json_data: number[] | null): void {
    // Word does not exist.
    if (json_data === null) {
        undo_last_word();
        return;
    }

    for (var i: number = 0; i < info_tracker.WORD_LENGTH; i++) {
        var letter_element = info_tracker.letters[info_tracker.current_letter[1]][i];
        var num = json_data[i];
        var character = info_tracker.current_word.charAt(i);

        colour_key(character, num);
        colour_letter(letter_element, num);
    }

    info_tracker.current_word = "";
    info_tracker.current_letter = [0, info_tracker.current_letter[1] + 1];
    info_tracker.current_try = info_tracker.current_try + 1;

    // If the word was correct.
    for (var i: number = 0; i < json_data.length; i++) {
        if (json_data[i] != 2) {
            if (info_tracker.current_try == info_tracker.amount_tries) {
                window.location.href = "/game/result/" + info_tracker.GAME_ID;
            }

            return;
        }
    }

    window.location.href = "/game/result/" + info_tracker.GAME_ID;

}

window.onkeydown = function(event: KeyboardEvent): void {
    let key: string = event.key;

    // enter
    if (key == "Enter") {
        enter_button();

    // backspace 
    } else if (key == "Backspace") {
        delete_button();

    // letter
    } else {
        if (key.length != 1) {
            return;
        }

        let valid_cahars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        if (valid_cahars.includes(key)) {
            add_letter(key.toUpperCase());
        }
    }
}

create_keyboard(
    add_letter,
    enter_button,
    delete_button
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
    set_current_letter
);