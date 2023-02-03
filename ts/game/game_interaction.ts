export { set_current_letter };

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