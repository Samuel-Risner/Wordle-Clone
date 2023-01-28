function dispprove(game_id: string): void {
    fetch("/disapprove_word/" + game_id).then((_res) => {window.location.href = '/'});
}