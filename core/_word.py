from settings.words import WORD_VALID_LETTERS

from ._word_loader import WordLoader

class Word():

    def __init__(self, word: str, user_id: int, amount_tries: int, word_loader:WordLoader, language: str):
        self.word = word
        self.user_id = user_id
        self.amount_tries = amount_tries
        self.word_loader = word_loader
        self.language = language
        self.remaining_tries = amount_tries

        self.victory = False
        self.try_results = list()
    
    def get_progress(self) -> list[list[str, list[int]]]:
        return self.try_results
    
    def _do_try(self, word_test: str, word_og: str) -> tuple[int, list[int] | None]:
        """
        Number meanings:
        ================
            (2 -> words do not match / only partially and game is over)
            (1 -> words are an exact match)
            0  -> comparison was successfull 
            -1 -> length of `word_test` doean't match the length of `word_og`
            -2 -> there is an invalid letter in `word_test`
            -3 -> word does not exist / is not in word list
            (-4 -> word_id wasn't found) 
            (-5 -> user_id doesn't correspond to word)
            (-6 -> game over)

        Meaning of numbers in returned list:
        ====================================
        0 -> letter does not occur in word
        1 -> letter occurs in word but isn't at the right position
        2 -> letter occurs in word and is at the right position
        """

        # check length
        if len(word_test) != len(word_og):
            return -1, None
        
        # check for invalid letters
        for character in word_test:
            if character not in WORD_VALID_LETTERS:
                return -2, None
        
        # if the word exists or not
        if not self.word_loader.word_exists(word_test, len(word_og), self.language, False):
            return -3, None

        # create the list for returning to the user
        return_list = list()
        for _ in word_og:
            return_list.append(0)
        
        # do option 2
        word_ = ""       # "word_og", except that characters that had an exact match were replaced with a "."
        characters_ = "" # "word_test", except that characters that had an exact match were replaced with a "#"

        for i in range(0, len(word_og), 1):
            if word_og[i] == word_test[i]:
                return_list[i] = 2

                word_ += "."
                characters_ += "#"
            else:
                word_ += word_og[i]
                characters_ += word_test[i]

        # do option 1:
        for i in range(0, len(word_og), 1):
            if characters_[i] in word_:
                return_list[i] = 1
                word_ = word_[:i] + "_" + word_[i + 1:]        

        return 0, return_list

    def add_try(self, word_test: str) -> tuple[int, list[int] | None]:
        # game is over
        if (self.remaining_tries <= 0) or self.victory:
            return -6 , None
        
        self.remaining_tries -= 1

        success, result = self._do_try(word_test, self.word)

        # if an error occured during comparing
        # no try is lost
        if success < 0:
            self.remaining_tries += 1
            return success, result
        
        # save the try
        self.try_results.append([word_test, result])

        words_match = True
        for character_match in result:
            if character_match != 2:
                words_match = False
                break

        # words match
        # game is then finished
        if words_match:
            self.victory = True
            # self.remaining_tries = -1
            return 1, result

        # this is the last try
        if self.remaining_tries <= 0:
            return 2, result
            
        # words match partially            
        return success, result