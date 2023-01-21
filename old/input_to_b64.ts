/**
 * Takes an array with ids for HTMLInputElements for which new HTMLInputElements are created, those have the same value, 
 * except that it's base 64 encoded. The names of the newly created HTMLInputElements are the same as the corresponding
 * ids for the other/old HTMLInputElements.
 * @param input_field_ids An array with the ids for HTMLInputElements for which the new HTMLInputElements should be
 * created with the same values but base 64 encoded.
 * @param place_for_new_inputs A HTMLElement to which the newly created HTMLInputElements should be appended.
 */
function input_to_b64(input_field_ids: string[], place_for_new_inputs: string): void{
    var place_element = document.getElementById(place_for_new_inputs);

    if (place_element === null) {
        console.error("Could not retreive html element with id '" + place_for_new_inputs + "'.");
        return;
    }

    for (var input_field_id: number = 0; input_field_id < input_field_ids.length; input_field_id++) {
        var input_element = document.getElementById(input_field_ids[input_field_id]) as HTMLInputElement;

        if (input_element === null) {
            console.error("Could not retreive html element with id '" + input_field_ids[input_field_id] + "'.");
            continue;
        }

        var new_input_element: HTMLInputElement = document.createElement("input");
        new_input_element.hidden = true;
        new_input_element.name = input_field_ids[input_field_id];
        new_input_element.value = btoa(input_element.value);

        place_element.appendChild(new_input_element);
    }
}