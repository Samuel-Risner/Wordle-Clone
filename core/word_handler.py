import secrets, logging

from settings import words

from ._word_loader import WordLoader
from ._word import Word

class WordHandler():

    def __init__(self):
        self.logger = logging.getLogger("word_handler")

        self.word_loader = WordLoader()

        self.active_words: dict[str, Word] = dict()
        """The keys are unique ids and the values "Word" objects."""
        self.finished_words: dict[str, Word] = dict()
        """The keys are unique ids and the values "Word" objects."""
        self.users: dict[int, list[str]] = dict()
        """The keys are user ids and the values game ids."""
        self.unique_ids: set[str] = set()
        """Contains all the unique ids."""
    
    def _create_unique_id(self) -> str:
        """Creates a new unique id which is not yet in "self.unique_ids", adds it to "self.unique_ids" and returns it."""

        # Loops until a not yet existing id is found.
        while True:
            the_id = ""

            # Adds random characters to the id.
            for _ in range(0, words.LEN_UNIQUE_ID, 1):
                the_id += secrets.choice(words.UNIQUE_ID_CHARS)
            
            # If the id is unique it is returned.
            if the_id not in self.unique_ids:
                self.unique_ids.add(the_id)
                self.logger.debug(f"Created new unique id: '{the_id}'.")
                return the_id

    def new_word(self, user_id: int, amount_letters: int, amount_tries: int, language: str) -> str | None:
        """Creates a new word and returns the words unique id."""

        word = self.word_loader.get_random_word(amount_letters, language)

        if word is None:
            # Error message already handeled by "self.word_loader".
            return None

        unique_id = self._create_unique_id()
        word_object = Word(word, user_id, amount_tries, self.word_loader, language)

        self.active_words[unique_id] = word_object

        if user_id in self.users:
            self.users[user_id].append(unique_id)
        else:
            self.users[user_id] = [unique_id]

        return unique_id
    
    def get_word_progress(self, user_id: int, game_id: str) -> list[tuple[str, list[int]]] | None:
        """Returns the progress the user has made in guessing the word. If the word with the unique id `game_id` isn't
        active or the user id `user_id` doesn't correspond to the game `None` is returned.

        Otherwise a list with the progress is returned. The list consists of one ore more guesses, each guess consists
        of a string, the guessed word, and a list with integers. Each integer gives information about the corresponding
        letter of the guessed word:
            - 0 -> The letter does not occur in theword.
            - 1 -> The letter occurs in the word but isn't at the right position.
            - 2 -> The letter occurs in word and is at the right position."""

        word = self.get_word(user_id, game_id)

        if word is None:
            # Error already handeled in "self.get_word".
            return None
        
        return word.get_progress()
    
    def get_word(self, user_id: int, game_id: str) -> Word | None:
        """Returns the "Word" object corresponding to the unique id `game_id`. If the word is not active or the user id
        `user_id` does not match the word `None` is returned."""

        word = self.active_words.get(game_id)

        if word is None:
            self.logger.debug(f"The user with the id: '{user_id}' has no game with the unique id: '{game_id}'.")
            return None
        
        if word.user_id != user_id:
            self.logger.critical(f"Some logic error happened. Function: 'get_word', user id: '{user_id}', unique id: '{game_id}'.")
            return None
        
        return word
    
    def do_try(self, user_id: int, game_id: str, word_test: str) -> tuple[int, list[int] | None]:
        """Does a try for the word with the unique id `game_id` and the word for guessing `word_test`.
        
        Returns the following:
        
            - 2 -> words do not match / only partially and game is over
            - 1 -> words are an exact match
            - 0  -> comparison was successfull 
            - -1 -> length of `word_test` doean't match the length of word the user is trying to guess
            - -2 -> there is an invalid letter in `word_test`
            - -3 -> word does not exist / is not in word list
            - -4 -> word_id wasn't found
            - -5 -> user_id doesn't correspond to word
            - -6 -> the game is already over
        
        With all the negative return values "None" is returned aswell.
        
        With the three positive ones a list with the comparison is returned aswell as the number. The list consists of
        integers. Each integer gives information about the corresponding letters in the word the user is trying to guess
        and the guess `word_test`:
            - 0 -> The letter from `word_test` does not occur in the word the user is trying to guess.
            - 1 -> The letter occurs in the word but isn't at the right position.
            - 2 -> The letter occurs in word and is at the right position."""

        word = self.active_words.get(game_id)

        if word is None:
            return -4, None
        
        if word.user_id != user_id:
            return -5, None
        
        return word.add_try(word_test)
    
    def finish_word(self, user_id: int, game_id: str) -> bool:
        """Removes a word from "self.active_words" and adds it to "self.finished_words". Through this the user can no
        longer try to guess the word. `True` is returned with the action was successfull, otherwise `False`. `False` is
        also returned if the user id `user_id` does not match the word."""

        word = self.active_words.get(game_id)

        if word is None:
            return False

        if word.user_id != user_id:
            return False

        word = self.active_words.pop(game_id)

        if word is None:
            return False
        
        self.finished_words[game_id] = word
        return True

    def remove_word(self, user_id: int, game_id: str) -> bool:
        """Removes a word from "self.finished_words", its unique id from "self.unique_ids" and also from "self.users".
        `True` is returned if the action was successfull, `False` when it wasn't or the user id `user_id` doesn't match
        the one of the word."""

        word = self.finished_words.get(game_id)

        if word is None:
            return False

        if word.user_id != user_id:
            return False

        self.finished_words.pop(game_id)
        self.users[user_id].remove(game_id)
        self.unique_ids.remove(game_id)

        return True
    
    def get_word_finished_info(self, user_id: int, game_id: str) -> tuple[bool, str, int, int] | None:
        """Returns "None" if the word with the unique id `game_id` is not in "self.finished_words" or the user id
        `user_id` does not match the one of the word.
        
        Otherwise a tuple is returned containing the following:
            - `True` if the game was won, `False` if not.
            - The word the user had to guess.
            - How many tries the user had in total to guess the word.
            - How many tries the user needed to guess the word (which is irrelevant when the user lost)."""

        word = self.finished_words.get(game_id)

        if word is None:
            return None
        
        if word.user_id != user_id:
            return None
        
        return word.victory, word.word, word.amount_tries, word.remaining_tries
    
    def get_active_games(self, user_id: int) -> list[tuple[str, str, int, int, int]] | None:
        """Returns a lsit cantaining no or more active games. Each active game is another tuple consisting of:
            - The game id / unique id
            - The language
            - The length of the word
            - The amount tries the user has to guess the word
            - The remaining tries the user has to guess the game.

        `None` is returned if the user does not exist (shouldn't happen).

        In "self.users" each user can have multiple games and also games that are not active. This case is handeled."""

        user = self.users.get(user_id)

        if user is None:
            return None
        
        to_return: list[tuple[str, str, int, int, int]] = list()
        for game_id in user:
            to_return.append(list())
            to_return[-1].append(game_id)

            game = self.active_words.get(game_id)

            if game is None:
                to_return.pop()
                continue

            to_return[-1].append(game.language)
            to_return[-1].append(len(game.word))
            to_return[-1].append(game.amount_tries)
            to_return[-1].append(game.remaining_tries)

        return to_return
    
    def get_unviewed_scores(self, user_id: int) -> list[str] | None:
        """Returns a list with all the game ids / unique ids that the user with the id `user_id` has completed and that
        were not removed yet from "self.finished_words".

        `None`  is returned if the user does not exist (shouldn't happen)."""

        user = self.users.get(user_id)

        if user is None:
            return None
        
        results: list[str] = list()

        for game_id in user:
            game = self.finished_words.get(game_id)

            if game is not None:
                results.append(game_id)

        return results
    
    def get_supported_languages(self) -> list[str]:
        """Returns a list containing the abbreviations for the supported languages."""

        return self.word_loader.supported_languages
    
    def get_word_lengths(self, language: str) -> list[int] | None:
        """Returns a list with the loaded word lengths. "None" is returned if the language is not supported."""
        
        return self.word_loader.get_word_lengths(language)