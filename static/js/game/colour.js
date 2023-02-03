export { colour_key, colour_letter };
/**
 * Colours an element curresponding to the number.
 * @param element The element that is supposed to be coloured.
 * @param num The number for the colour.
 */
function _colour_element(element, num) {
    if (num == 0) {
        element.style.backgroundColor = "red";
    }
    else if (num == 1) {
        element.style.backgroundColor = "yellow";
    }
    else if (num == 2) {
        element.style.backgroundColor = "green";
    }
}
/**
 * Colours a letter on the game field.
 * @param letter_element The tiles element.
 * @param num The number for the colour.
 */
function colour_letter(letter_element, num) {
    _colour_element(letter_element, num);
}
/**
 * Colours a letter on the keyboard.
 * @param key The letters character.
 * @param num The number for the colour.
 */
function colour_key(key, num) {
    let element = document.getElementById(key);
    if (element === null) {
        console.error("Could not retreive the html button element with the id:' " + key + "'.");
        return;
    }
    _colour_element(element, num);
}
