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

    const HEIGHT = 

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
    button.onclick = on_enter;
    button.className = "h-[10vh] rounded-lg border-2 p-1";

    let img: HTMLImageElement = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/enter_key.svg";

    // delete button
    let delete_cell: HTMLTableCellElement = document.createElement("td");

    button = document.createElement("button");
    delete_cell.appendChild(button);
    button.onclick = on_delete;
    button.className = "h-[10vh] rounded-lg border-2 p-1";

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