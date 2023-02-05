export { info_tracker };
class InfoTracker {
    constructor() {
        var _a, _b, _c;
        this.GAME_ID = (_a = document.getElementById("game_id")) === null || _a === void 0 ? void 0 : _a.textContent;
        this.amount_tries = Number((_b = document.getElementById("amount_tries")) === null || _b === void 0 ? void 0 : _b.textContent);
        this.WORD_LENGTH = Number((_c = document.getElementById("word_length")) === null || _c === void 0 ? void 0 : _c.textContent);
        this.current_try = 0;
        this.letters = [];
        this.current_letter = [0, 0];
        this.current_word = "";
        this.GAME = document.getElementById("game");
    }
}
/**
 * An object storing general iformation needed for the game.
 */
const info_tracker = new InfoTracker();
