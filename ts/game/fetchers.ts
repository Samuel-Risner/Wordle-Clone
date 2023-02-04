export { set_progress, submit_word };

import { colour_key, colour_letter } from "./colour.js";

function set_progress(game_id: string, letters: HTMLDivElement[][], also_call: () => any): void {
    fetch("/json/get_progress/" + game_id).then(
        (res) => {
            res.json().then(
                (_res) => {
                    _set_progress(_res, letters);
                    also_call();
                }
            ).catch(
                (_) => {
                    console.error("Colud not get json data from: '/json/get_progress/" + game_id + "'.");
                }
            );
        }
    ).catch(
        (_) => {
            console.error("Failed to aquire json from: '/json/get_progress/" + game_id + "'.");
        }
    );
}

function _set_progress(json_data: [string, number[]][], letters: HTMLDivElement[][]): void {
    for (var line: number = 0; line < json_data.length; line++) {

        var word: string = json_data[line][0];
        var match: number[] = json_data[line][1];

        for (var letter: number = 0; letter < word.length; letter++) {

            var character: string = word.charAt(letter);
            var num: number = match[letter];
            var letter_element: HTMLDivElement = letters[line][letter];

            letter_element.textContent = character;

            colour_key(character.toUpperCase(), num);
            colour_letter(letter_element, num);
        }
    }
}

function submit_word(word: string, game_id: string, call_after: () => any, call_on_success: (json_data: number[] | null) => any): void {
    fetch("/json/add_word/" + game_id + "/" + word).then(
        (res) => {
            res.json().then(
                (res) => {
                    call_on_success(res);
                    call_after();
                }
            ).catch(
                (_) => {
                    console.error("Failed to aquire json from: '/json/get_progress/" + game_id + "/" + word + "'.");
                    call_after();
                }
            );
        }
    ).catch(
        (_) => {
            console.error("Failed to fetch from: '/json/get_progress/" + game_id + "/" + word + "'.");
            call_after();
        }
    );
}