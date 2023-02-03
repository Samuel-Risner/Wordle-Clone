export { create_keyboard, disable_enter_button, enable_enter_button, disable_delete_button, enable_delete_button, disable_all, enable_all };

/**
 * Conatains all the keyboard buttons. The first two buttons are the enter and delete buttons.
 */
let KEY_ELEMETS: HTMLButtonElement[] = [];

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
function create_keyboard(
        on_letter_click: (letter: string) => any,
        on_enter: () => any,
        on_delete: () => any
    ): void {
    
    var keyboard_object = document.getElementById("keyboard") as HTMLDivElement;

    if (keyboard_object === null) {
        console.error("Could not retreive html element with id: 'keyboard'.");
        return;
    }

    // const HEIGHT = 

    _create_row("QWERTZUIOP", keyboard_object, on_letter_click);

    // space left
    let space_left: HTMLDivElement = document.createElement("div");
    space_left.className = "w-[5vw]";

    // space right
    let space_right: HTMLDivElement = document.createElement("div");
    space_right.className = "w-[5vw]";

    _create_row("ASDFGHJKL", keyboard_object, on_letter_click, space_left, space_right);

    // Enter button
    let enter_cell: HTMLTableCellElement = document.createElement("td");

    let button: HTMLButtonElement = document.createElement("button");
    enter_cell.appendChild(button);
    KEY_ELEMETS.push(button);
    button.onclick = on_enter;
    button.className = "h-[10vh] rounded-lg border-2 p-1";

    let img: HTMLImageElement = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/enter_key.svg";

    // delete button
    let delete_cell: HTMLTableCellElement = document.createElement("td");

    button = document.createElement("button");
    delete_cell.appendChild(button);
    KEY_ELEMETS.push(button);
    button.onclick = on_delete;
    button.className = "h-[10vh] rounded-lg border-2 p-1";

    img = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/delete_key_v2.svg";

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
function _create_row(
        letters: string,
        append_to: HTMLElement,
        on_letter_click: (letter: string) => any,
        prepend: HTMLElement | null = null,
        append: HTMLElement | null = null,
    ): void {
    
    let table: HTMLTableElement = document.createElement("table");
    append_to.appendChild(table);
    table.className = "w-full";

    let row: HTMLTableRowElement = document.createElement("tr");
    table.appendChild(row);
    row.className =  "w-full h-[12vh] text-center";

    if (prepend !== null) {
        row.appendChild(prepend);
    }

    for (let character of letters) {
        var cell: HTMLTableCellElement = document.createElement("td");
        row.appendChild(cell);
        cell.className = "w-[10vw]";

        var button: HTMLButtonElement = document.createElement("button");
        cell.appendChild(button);
        KEY_ELEMETS.push(button);   

        button.textContent = character;
        button.onclick = () => {
            on_letter_click(character);
        }
        button.id = character;
        button.className = "text-[4vh] w-11/12 h-[10vh] rounded-lg border-2";
    }

    if (append !== null) {
        row.appendChild(append);
    }
}