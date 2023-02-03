export { set_progress, submit_word };
import { colour_key, colour_letter } from "./colour.js";
function set_progress(game_id, letters, also_call) {
    fetch("/json/get_progress/" + game_id).then((res) => {
        res.json().then((_res) => {
            _set_progress(_res, letters);
            also_call();
        }).catch((_) => {
            console.error("Colud not get json data from: '/json/get_progress/" + game_id + "'.");
        });
    }).catch((_) => {
        console.error("Failed to aquire json from: '/json/get_progress/" + game_id + "'.");
    });
}
function _set_progress(json_data, letters) {
    for (var line = 0; line < json_data.length; line++) {
        var word = json_data[line][0];
        var match = json_data[line][1];
        for (var letter = 0; letter < word.length; letter++) {
            var character = word.charAt(letter);
            var num = match[letter];
            var letter_element = letters[line][letter];
            letter_element.textContent = character;
            colour_key(character.toUpperCase(), num);
            colour_letter(letter_element, num);
        }
    }
}
function submit_word(word, game_id, call_after, call_on_success) {
    fetch("/json/add_word/" + game_id + "/" + word).then((res) => {
        res.json().then((res) => {
            call_on_success(res);
            call_after();
        }).catch((_) => {
            console.error("Failed to aquire json from: '/json/get_progress/" + game_id + "/" + word + "'.");
            call_after();
        });
    }).catch((_) => {
        console.error("Failed to fetch from: '/json/get_progress/" + game_id + "/" + word + "'.");
        call_after();
    });
}
