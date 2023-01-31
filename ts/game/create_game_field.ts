export { create_game_field };

function create_game_field(
        tiles: HTMLDivElement[][],
        word_length: number,
        amount_tries: number,
        append_to: HTMLElement
    ): void {
    
    let table: HTMLTableElement = document.createElement("table");
    append_to.appendChild(table);
    table.className = "table-fixed w-screen";

    for (let column: number = 0; column < amount_tries; column++) {

        let row_element: HTMLTableRowElement = document.createElement("tr");
        table.appendChild(row_element);

        let row_list: HTMLDivElement[] = [];
        tiles.push(row_list);

        for (let row: number = 0; row < word_length; row++) {
            let cell: HTMLTableCellElement = document.createElement("td");
            row_element.appendChild(cell);
            let div: HTMLDivElement = document.createElement("div");
            cell.appendChild(div);
            row_list.push(div);

            div.textContent = "W";
            cell.className = "bg-red-100";
        }
    }
}