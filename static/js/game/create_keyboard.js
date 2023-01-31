export { create_keyboard };
function create_keyboard(on_letter_click, on_enter, on_delete) {
    var keyboard_object = document.getElementById("keyboard");
    if (keyboard_object === null) {
        console.error("Could not retreive html element with id: 'keyboard'.");
        return;
    }
    _create_row("QWERTZUIOP", keyboard_object, on_letter_click);
    _create_row("ASDFGHJKL", keyboard_object, on_letter_click);
    // Enter button
    let enter_cell = document.createElement("td");
    // enter_cell.className = "keyboard_contents special_key";
    let button = document.createElement("button");
    enter_cell.appendChild(button);
    button.onclick = on_enter;
    // button.className = "keyboard_contents button";
    let img = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/enter_key.svg";
    // delete button
    let delete_cell = document.createElement("td");
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
function _create_row(letters, append_to, on_letter_click, prepend = null, append = null) {
    let table = document.createElement("table");
    append_to.appendChild(table);
    table.className = "w-full";
    let row = document.createElement("tr");
    table.appendChild(row);
    row.className = "w-full";
    if (prepend !== null) {
        row.appendChild(prepend);
    }
    for (let character of letters) {
        var cell = document.createElement("td");
        row.appendChild(cell);
        cell.className = "bg-green-500 w-1/12 aspect-sqare";
        var button = document.createElement("button");
        cell.appendChild(button);
        button.textContent = character;
        button.onclick = () => {
            on_letter_click(character);
        };
        button.id = character;
        button.className = "bg-violet-500 w-1/12 aspect-square";
    }
    if (append !== null) {
        row.appendChild(append);
    }
}
