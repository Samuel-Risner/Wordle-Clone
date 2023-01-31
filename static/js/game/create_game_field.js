export { create_game_field };
function create_game_field(tiles, word_length, amount_tries, append_to) {
    let table = document.createElement("table");
    append_to.appendChild(table);
    table.className = "table-fixed w-screen";
    for (let column = 0; column < amount_tries; column++) {
        let row_element = document.createElement("tr");
        table.appendChild(row_element);
        let row_list = [];
        tiles.push(row_list);
        for (let row = 0; row < word_length; row++) {
            let cell = document.createElement("td");
            row_element.appendChild(cell);
            let div = document.createElement("div");
            cell.appendChild(div);
            row_list.push(div);
            div.textContent = "W";
            cell.className = "bg-red-100";
        }
    }
}
