function dispprove(game_id) {
    fetch("/disapprove_word/" + game_id).then(function (_res) { window.location.href = '/'; });
}
