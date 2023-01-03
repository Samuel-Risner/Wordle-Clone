function create_keyboard(): void{
    var keyboard_object = document.getElementById("keyboard") as HTMLDivElement;

    if (keyboard_object === null) {
        console.error("Could not retreive html element with id: 'keyboard'.");
        return;
    }

    var row_1: string = "QWERTZUIOP";
    var row_2: string = "ASDFGHJKL";
    var row_3: string = "YXCVBNM";

    // row 1

    var table: HTMLTableElement = document.createElement("table");
    keyboard_object.appendChild(table);
    var row: HTMLTableRowElement = document.createElement("tr");
    table.appendChild(row);

    for (var letter: number = 0; letter < row_1.length; letter++) {
        var cell: HTMLTableCellElement = document.createElement("td");
        row.appendChild(cell);
        var div: HTMLDivElement = document.createElement("div");
        cell.appendChild(div);
        var button: HTMLButtonElement = document.createElement("button");
        div.appendChild(button);

        button.textContent = row_1.charAt(letter);
    }

    // row 2

    var table: HTMLTableElement = document.createElement("table");
    keyboard_object.appendChild(table);
    var row: HTMLTableRowElement = document.createElement("tr");
    table.appendChild(row);
    
    for (var letter: number = 0; letter < row_2.length; letter++) {
        var cell: HTMLTableCellElement = document.createElement("td");
        row.appendChild(cell);
        var div: HTMLDivElement = document.createElement("div");
        cell.appendChild(div);
        var button: HTMLButtonElement = document.createElement("button");
        div.appendChild(button);

        button.textContent = row_2.charAt(letter);
    }

    // row 3

    var table: HTMLTableElement = document.createElement("table");
    keyboard_object.appendChild(table);
    var row: HTMLTableRowElement = document.createElement("tr");
    table.appendChild(row);

    // Enter button
    var cell: HTMLTableCellElement = document.createElement("td");
    cell.className = "keyboard_contents special_key";
    row.appendChild(cell);
    var div: HTMLDivElement = document.createElement("div");
    cell.appendChild(div);
    var button: HTMLButtonElement = document.createElement("button");
    div.appendChild(button);
    
    for (var letter: number = 0; letter < row_3.length; letter++) {
        var cell: HTMLTableCellElement = document.createElement("td");
        row.appendChild(cell);
        var div: HTMLDivElement = document.createElement("div");
        cell.appendChild(div);
        var button: HTMLButtonElement = document.createElement("button");
        div.appendChild(button);

        button.textContent = row_3.charAt(letter);
    }

    // delete button
    var cell: HTMLTableCellElement = document.createElement("td");
    cell.className = "keyboard_contents special_key";
    row.appendChild(cell);
    var div: HTMLDivElement = document.createElement("div");
    cell.appendChild(div);
    var button: HTMLButtonElement = document.createElement("button");
    div.appendChild(button);
}