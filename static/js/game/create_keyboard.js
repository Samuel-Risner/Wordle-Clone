export { create_keyboard, disable_enter_button, enable_enter_button, disable_delete_button, enable_delete_button, disable_all, enable_all };
/**
 * Conatains all the keyboard buttons. The first two buttons are the enter and delete buttons.
 */
let KEY_ELEMETS = [];
/**
 * Disables the enter button.
 */
function disable_enter_button() {
    KEY_ELEMETS[0].disabled = true;
}
/**
 * Enables the enter button.
 */
function enable_enter_button() {
    KEY_ELEMETS[0].disabled = false;
}
/**
 * Disables the delete button.
 */
function disable_delete_button() {
    KEY_ELEMETS[1].disabled = true;
}
/**
 * Enables the delete button.
 */
function enable_delete_button() {
    KEY_ELEMETS[1].disabled = false;
}
/**
 * Disables all keyboard buttons.
 */
function disable_all() {
    for (let btn of KEY_ELEMETS) {
        btn.disabled = true;
    }
}
/**
 * Enables all keyboard buttons.
 */
function enable_all() {
    for (let btn of KEY_ELEMETS) {
        btn.disabled = false;
    }
}
/**
 * Creates the keyboard and adds it to the html element with the id "keyboard". The styles for the keys are set here aswell.
 * @param on_letter_click What happens when a button with a letter is clicked. The letter is passed to the function.
 * @param on_enter The function that is called when the enter button is pressed.
 * @param on_delete The function that is called when the delete button is pressed.
 */
function create_keyboard(on_letter_click, on_enter, on_delete) {
    var keyboard_object = document.getElementById("keyboard");
    if (keyboard_object === null) {
        console.error("Could not retreive html element with id: 'keyboard'.");
        return;
    }
    // const HEIGHT = 
    _create_row("QWERTZUIOP", keyboard_object, on_letter_click);
    // space left
    let space_left = document.createElement("div");
    space_left.className = "w-[5%]";
    // space right
    let space_right = document.createElement("div");
    space_right.className = space_left.className;
    _create_row("ASDFGHJKL", keyboard_object, on_letter_click, space_left, space_right);
    // Enter button
    let enter_cell = document.createElement("td");
    enter_cell.className = "w-[15%]";
    let button_enter = document.createElement("button");
    enter_cell.appendChild(button_enter);
    KEY_ELEMETS.push(button_enter);
    button_enter.onclick = on_enter;
    button_enter.className = "w-11/12 h-[95%] rounded-lg border-2 p-1";
    let img_enter = document.createElement("img");
    button_enter.appendChild(img_enter);
    img_enter.src = "/static/images/enter_key.svg";
    img_enter.className = "sm:w-[68%] m-auto";
    // delete button
    let delete_cell = document.createElement("td");
    let button_delete = document.createElement("button");
    delete_cell.appendChild(button_delete);
    KEY_ELEMETS.push(button_delete);
    button_delete.onclick = on_delete;
    button_delete.className = button_enter.className;
    let img_delete = document.createElement("img");
    button_delete.appendChild(img_delete);
    img_delete.src = "/static/images/delete_key_v2.svg";
    img_delete.className = img_enter.className;
    _create_row("YXCVBNM", keyboard_object, on_letter_click, enter_cell, delete_cell);
}
/**
 * Creates a new table which conatins a row of keyboard buttons. The styles for the keys are also set here.
 * @param letters The letters that are to be added to the row.
 * @param append_to The html element to which the created table is going to be appended to.
 * @param on_letter_click The function which is called when a letter is pressed. The pressed letter is passed to the function.
 * @param prepend A html element, for example the enter button or a spacer, which is added to the beginning of the keyboard row.
 * @param append The same as "prepend", only that the element is added to the end of the row.
 */
function _create_row(letters, append_to, on_letter_click, prepend = null, append = null) {
    let table = document.createElement("table");
    append_to.appendChild(table);
    table.className = "w-full h-1/3 text-center";
    let row = document.createElement("tr");
    table.appendChild(row);
    row.className = "w-full h-full";
    if (prepend !== null) {
        row.appendChild(prepend);
    }
    for (let character of letters) {
        var cell = document.createElement("td");
        row.appendChild(cell);
        cell.className = "w-[10%]";
        var button = document.createElement("button");
        cell.appendChild(button);
        KEY_ELEMETS.push(button);
        button.textContent = character;
        button.onclick = () => {
            on_letter_click(character);
        };
        button.id = character;
        button.className = "w-11/12 h-[95%] rounded-lg border-2";
    }
    if (append !== null) {
        row.appendChild(append);
    }
}
