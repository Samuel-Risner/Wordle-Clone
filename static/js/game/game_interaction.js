export { set_current_letter };
/**
 * Returns the position were the user stopped playing the game.
 */
function set_current_letter(letters) {
    let current_letter = [0, 0];
    for (var h = 0; h < letters.length; h++) {
        for (var w = 0; w < letters[h].length; w++) {
            if (letters[h][w].textContent == "") {
                return current_letter = [w, h];
            }
        }
    }
    return current_letter;
}
