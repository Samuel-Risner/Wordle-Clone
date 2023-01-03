var game_id = "";
var amount_tries = 0;
var word_length = 0;

var current_try = 0;
var letters: HTMLDivElement[][] = [];
var current_letter: [number, number] = [0, 0];
var current_word = "";

function set_stuff(new_game_id: string, new_amount_tries: string, new_word_length: string): void{
    game_id = new_game_id;
    amount_tries = Number(new_amount_tries);
    word_length = Number(new_word_length);
}

function init_game(): void {
    var game = document.getElementById("game");

    if (game === null) {
        console.error("Could not retreive html element with the id: 'game'.");
        return;
    }

    var table = document.createElement("table");
    game.appendChild(table);

    var cell_width = 90 / word_length;

    for (var h: number = 0; h < amount_tries; h++) {
        var tr: HTMLTableRowElement = document.createElement("tr");
        table.appendChild(tr);
        letters.push([]);

        for (var w: number = 0; w < word_length; w++) {
            var td: HTMLTableCellElement = document.createElement("td");
            tr.appendChild(td);
            var div: HTMLDivElement = document.createElement("div");
            td.appendChild(div)
            
            div.textContent = ""; // + w + "|" + h;
            div.style.width = String(cell_width) + "vw";
            div.className = "letter";

            letters[h].push(div);
        }
    }
}

function _set_current_letter(): boolean {
    for (var h: number = 0; h < letters.length; h++) {
        for (var w: number = 0; w < letters[h].length; w++) {
            if (letters[h][w].textContent != "") {
                current_letter = [w, h];
                return true;
            }
        }
    }

    return false;
}

async function _get_progress_async() {
    var response = await fetch("/json/get_progress/" + game_id);
    var json = await response.json();

    return json;
}

function _set_progress(json_data: [string, number[]][]): void {
    for (var line: number = 0; line < json_data.length; line++) {
        var word = json_data[line][0];
        var match = json_data[line][1];

        for (var letter: number = 0; letter < word.length; letter++) {
            var character = word.charAt(letter);
            var num = match[letter];

            letters[line][letter].textContent = character + num;
        }
    }

    _set_current_letter();
}

function set_progress(): void{
    _get_progress_async().then(
        (_res) => {console.log("SUPER!"); console.log(_res); _set_progress(_res)}
    ).catch(
        (_res) => {console.log("UPSI!"); console.log(_res);}
    );
}

function _add_letter(letter: string): void {
    if (current_letter[0] >= word_length) {
        return;
    }

    letters[current_letter[1]][current_letter[0]].textContent = letter;
    current_letter[0] = current_letter[0] + 1;
    current_word = current_word + letter;
}

function _remove_letter(): void {
    if (current_letter[0] <= 0) {
        return;
    }

    current_word = current_word.substring(0, current_word.length - 1);
    current_letter[0] = current_letter[0] - 1;
    letters[current_letter[1]][current_letter[0]].textContent = "";
    console.log("REMOVE!")
}

function _enter(): void {
    
}

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

        let letter_: string = row_1.charAt(letter);
        button.textContent = letter_;
        button.onclick = () => {_add_letter(letter_);};
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

        let letter_: string = row_2.charAt(letter);
        button.textContent = letter_;
        button.onclick = () => {_add_letter(letter_);};
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
    var img: HTMLImageElement = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/enter_key.svg";
    
    for (var letter: number = 0; letter < row_3.length; letter++) {
        var cell: HTMLTableCellElement = document.createElement("td");
        row.appendChild(cell);
        var div: HTMLDivElement = document.createElement("div");
        cell.appendChild(div);
        var button: HTMLButtonElement = document.createElement("button");
        div.appendChild(button);

        let letter_: string = row_3.charAt(letter);
        button.textContent = letter_;
        button.onclick = () => {_add_letter(letter_);};
    }

    // delete button
    var cell: HTMLTableCellElement = document.createElement("td");
    cell.className = "keyboard_contents special_key";
    row.appendChild(cell);
    var div: HTMLDivElement = document.createElement("div");
    cell.appendChild(div);
    var button: HTMLButtonElement = document.createElement("button");
    div.appendChild(button);
    var img: HTMLImageElement = document.createElement("img");
    button.appendChild(img);
    img.src = "/static/images/delete_key_v2.svg";
    button.onclick = _remove_letter;
}