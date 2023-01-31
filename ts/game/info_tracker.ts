export { info_tracker };

class InfoTracker {

    private GAME_ID: string;
    public amount_tries: number;
    public WORD_LENGTH: number;

    private current_try: number;
    public letters: HTMLDivElement[][];
    private current_letter: [number, number];
    private current_word: string;

    public GAME: HTMLDivElement;

    constructor() {
        this.GAME_ID = document.getElementById("game_id")?.textContent as string;
        this.amount_tries = Number(document.getElementById("amount_tries")?.textContent as string);
        this.WORD_LENGTH = Number(document.getElementById("word_length")?.textContent as string);

        this.current_try = 0;
        this.letters = [];
        this.current_letter = [0, 0];
        this.current_word = "";

        this.GAME = document.getElementById("game") as HTMLDivElement;
    }

}

const info_tracker = new InfoTracker();