function create_keyboard() {
    var keyboard_object = document.getElementById("keyboard");
    if (keyboard_object === null) {
        console.error("Could not retreive html element with id: 'keyboard'.");
        return;
    }
    var row_1 = "QWERTZUIOP";
    var row_2 = "ASDFGHJKL";
    var row_3 = "YXCVBNM";
    // row 1
    var table = document.createElement("table");
    keyboard_object.appendChild(table);
    var row = document.createElement("tr");
    table.appendChild(row);
    for (var letter = 0; letter < row_1.length; letter++) {
        var cell = document.createElement("td");
        row.appendChild(cell);
        var div = document.createElement("div");
        cell.appendChild(div);
        var button = document.createElement("button");
        div.appendChild(button);
        button.textContent = row_1.charAt(letter);
    }
    // row 2
    var table = document.createElement("table");
    keyboard_object.appendChild(table);
    var row = document.createElement("tr");
    table.appendChild(row);
    for (var letter = 0; letter < row_2.length; letter++) {
        var cell = document.createElement("td");
        row.appendChild(cell);
        var div = document.createElement("div");
        cell.appendChild(div);
        var button = document.createElement("button");
        div.appendChild(button);
        button.textContent = row_2.charAt(letter);
    }
    // row 3
    var table = document.createElement("table");
    keyboard_object.appendChild(table);
    var row = document.createElement("tr");
    table.appendChild(row);
    // Enter button
    var cell = document.createElement("td");
    cell.className = "keyboard_contents special_key";
    row.appendChild(cell);
    var div = document.createElement("div");
    cell.appendChild(div);
    var button = document.createElement("button");
    div.appendChild(button);
    var img = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/enter_key.svg";
    for (var letter = 0; letter < row_3.length; letter++) {
        var cell = document.createElement("td");
        row.appendChild(cell);
        var div = document.createElement("div");
        cell.appendChild(div);
        var button = document.createElement("button");
        div.appendChild(button);
        button.textContent = row_3.charAt(letter);
    }
    // delete button
    var cell = document.createElement("td");
    cell.className = "keyboard_contents special_key";
    row.appendChild(cell);
    var div = document.createElement("div");
    cell.appendChild(div);
    var button = document.createElement("button");
    div.appendChild(button);
    var img = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/delete_key_v2.svg";
}
