export { create_keyboard };

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

    _create_row("QWERTZUIOP", keyboard_object, on_letter_click);
    _create_row("ASDFGHJKL", keyboard_object, on_letter_click);

    // Enter button
    let enter_cell: HTMLTableCellElement = document.createElement("td");
    // enter_cell.className = "keyboard_contents special_key";

    let button: HTMLButtonElement = document.createElement("button");
    enter_cell.appendChild(button);
    button.onclick = on_enter;
    // button.className = "keyboard_contents button";

    let img: HTMLImageElement = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/enter_key.svg";

    // delete button
    let delete_cell: HTMLTableCellElement = document.createElement("td");
    // delete_cell.className = "keyboard_contents special_key";

    button = document.createElement("button");
    delete_cell.appendChild(button);
    button.onclick = on_delete;
    // button.className = "keyboard_contents button";

    img = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/delete_key_v2.svg";

    _create_row("YXCVBNM", keyboard_object, on_letter_click, enter_cell, delete_cell);
}

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
    row.className =  "w-full";

    if (prepend !== null) {
        row.appendChild(prepend);
    }

    for (let character of letters) {
        var cell: HTMLTableCellElement = document.createElement("td");
        row.appendChild(cell);
        cell.className = "bg-green-500 w-1/12 aspect-sqare";

        var button: HTMLButtonElement = document.createElement("button");
        cell.appendChild(button);

        button.textContent = character;
        button.onclick = () => {
            on_letter_click(character);
        }
        button.id = character;
        button.className = "bg-violet-500 w-1/12 aspect-square";
    }

    if (append !== null) {
        row.appendChild(append);
    }
}