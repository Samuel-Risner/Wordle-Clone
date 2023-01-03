function display_input_value(input_id, output_id) {
    var input_element = document.getElementById(input_id);
    var output_element = document.getElementById(output_id);
    if (input_element === null) {
        console.error("Could not retreive the html element with the id: '" + input_id + "'.");
        return;
    }
    if (output_element === null) {
        console.error("Could not retreive the html element with the id: '" + output_id + "'.");
        return;
    }
    output_element.textContent = input_element.value;
}
