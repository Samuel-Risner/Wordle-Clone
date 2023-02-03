export { colour_key, colour_letter };

function _colour_element(element: HTMLElement, num: number): void {
    if (num == 0) {
        element.className = "";
    } else if (num == 1) {
        element.className = "";
    } else if (num == 2) {
        element.className = "";
    }
}

function colour_letter(letter_element: HTMLDivElement, num: number): void {
    _colour_element(letter_element, num);
}

function colour_key(key: string, num: number): void {
    let element = document.getElementById(key) as HTMLButtonElement;

    if (element === null) {
        console.error("Could not retreive the html button element with the id:' " + key + "'.");
        return;
    }

    _colour_element(element, num)
}