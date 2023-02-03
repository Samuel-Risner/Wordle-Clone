export { colour_key, colour_letter };
function _colour_element(element, num) {
    if (num == 0) {
        element.className = "";
    }
    else if (num == 1) {
        element.className = "";
    }
    else if (num == 2) {
        element.className = "";
    }
}
function colour_letter(letter_element, num) {
    _colour_element(letter_element, num);
}
function colour_key(key, num) {
    let element = document.getElementById(key);
    if (element === null) {
        console.error("Could not retreive the html button element with the id:' " + key + "'.");
        return;
    }
    _colour_element(element, num);
}
