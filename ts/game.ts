var game_id = "";
var amount_tries = 0;
var word_length = 0;

var current_try = 0;
var letters: HTMLDivElement[][] = [];

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

        for (var w: number = 0; w < word_length; w++) {
            var td: HTMLTableCellElement = document.createElement("td");
            tr.appendChild(td);
            var div: HTMLDivElement = document.createElement("div");
            td.appendChild(div)
            
            div.textContent = "" + w + "|" + h;
            div.style.width = String(cell_width) + "vw";
            div.className = "letter";
        }
    }
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
}

function set_progress(): void{
    _get_progress_async().then(
        (_res) => {console.log("SUPER!"); console.log(_res); _set_progress(_res)}
    ).catch(
        (_res) => {console.log("UPSI!"); console.log(_res);}
    );
}