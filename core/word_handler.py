import secrets

from settings import words as settings

from ._word_loader import WordLoader
from ._word import Word

class WordHandler():

    def __init__(self):
        self.word_loader = WordLoader()
        self.unique_ids = dict()
        self.finished_words = dict()
        self.users = dict()

        self.unique_ids.setdefault(None)
        self.finished_words.setdefault(None)
        self.users.setdefault(None)
    
    def _create_unique_id(self) -> str:
        while True:
            the_id = ""

            for i in range(0, settings.LEN_UNIQUE_ID, 1):
                the_id += secrets.choice(settings.UNIQUE_ID_CHARS)
            
            if (the_id not in self.unique_ids) and (the_id not in self.finished_words):
                break

        return the_id

    def new_word(self, user_id: int, amount_letters: int, amount_tries: int, language: str) -> str:
        word = self.word_loader.get_random_word(amount_letters, language)
        unique_id = self._create_unique_id()
        word_object = Word(word, user_id, amount_tries, self.word_loader, language)

        self.unique_ids[unique_id] = word_object

        if user_id in self.users:
            self.users[user_id].append(unique_id)
        else:
            self.users[user_id] = [unique_id]

        return unique_id
    
    def get_word_progress(self, user_id: int, game_id: str) -> list[list[str, list[int]]] | None:
        word: Word = self.unique_ids.get(game_id)

        if word is None:
            return None
        
        if word.user_id != user_id:
            return None
        
        return word.get_progress()
    
    def get_word(self, user_id: int, game_id: str) -> Word:
        word: Word = self.unique_ids.get(game_id)

        if word is None:
            return None
        
        if word.user_id != user_id:
            return None
        
        return word
    
    def do_try(self, user_id: int, game_id: str, word_test: str) -> tuple[int, list[int] | None]:
        word: Word = self.unique_ids.get(game_id)

        if word is None:
            return -4, None
        
        if word.user_id != user_id:
            return -5, None
        
        return word.add_try(word_test)
    
    def finish_word(self, user_id: int, game_id: str) -> bool:
        word: Word = self.unique_ids.get(game_id)

        if word is None:
            return False

        if word.user_id != user_id:
            return False

        word = self.unique_ids.pop(game_id)

        if word is None:
            return False
        
        self.finished_words[game_id] = word
        return True

    def remove_word(self, user_id: int, game_id: str) -> bool:
        word: Word = self.finished_words.get(game_id)

        if word is None:
            return False

        if word.user_id != user_id:
            return False

        self.finished_words.pop(game_id)
        self.users[user_id].remove(game_id)
        return True
    
    def get_word_finished_info(self, user_id: int, game_id: str) -> tuple[bool, str, int, int] | None:
        word: Word = self.finished_words.get(game_id)

        if word is None:
            return None
        
        if word.user_id != user_id:
            return None
        
        return word.victory, word.word, word.amount_tries, word.remaining_tries
    
    def get_active_games(self, user_id: int) -> list[list[str, str, int, int, int]] | None:
        """
        Returns:
            game_id
            language
            word_length
            amount_tries
            remaining_tries
        """
        user = self.users.get(user_id)

        if user is None:
            return None
        
        to_return = list
        for game_id in user:
            to_return.append(game_id)

            game: Word = self.unique_ids.get(game_id)

            if game is None:
                to_return.pop()
                continue

            to_return.append(game.language)
            to_return.append(len(game.word))
            to_return.append(game.amount_tries)
            to_return.append(game.remaining_tries)

        return user