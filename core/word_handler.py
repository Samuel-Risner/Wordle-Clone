import secrets

from settings import words as settings

from ._word_loader import WordLoader
from ._word import Word

class WordHandler():

    def __init__(self):
        self.word_loader = WordLoader()
        self.unique_ids = dict()
    
    def _create_unique_id(self) -> str:
        while True:
            the_id = ""

            for i in range(0, settings.LEN_UNIQUE_ID, 1):
                the_id += secrets.choice(settings.UNIQUE_ID_CHARS)
            
            if the_id not in self.unique_ids:
                break

        return the_id

    def new_word(self, username: str, amount_letters: int, amount_tries: int):
        word = self.word_loader.get_random_word(amount_letters)
        unique_id = self._create_unique_id()
        word_object = Word(word, username, amount_tries, self.word_loader)