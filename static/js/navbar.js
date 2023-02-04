"use strict";
/**
 * Toggles if the navbar is collapsed or not.
 */
function toggle_dropdown() {
    var nav_hidden = document.getElementById("navbar_hidden");
    var nav_show = document.getElementById("navbar_show");
    if (nav_hidden === null) {
        console.error("Could not retreive the html element with the id: 'nav_hidden'.");
        return;
    }
    if (nav_show === null) {
        console.error("Could not retreive the html element with the id: 'navbar_show'.");
        return;
    }
    nav_hidden.hidden = !nav_hidden.hidden;
    nav_show.hidden = !nav_show.hidden;
}
