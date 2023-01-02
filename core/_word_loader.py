import secrets

from settings import words as WORDS

class WordLoader():

    def __init__(self):
        self.words = dict()

        self._load()
    
    def _load(self):
        def check_characters(word: str) -> bool:
            for character in word:
                if character not in WORDS.WORD_VALID_LETTERS:
                    print(f"Word: '{word}' contains an invalid character: '{character}'.")
                    return False
            return True

        for language, next_ in WORDS.LANGUAGES.items():
            # seperate the paths to the dictionarys and the permitted lengths for words
            paths, word_lengths, _ = next_

            # create a set for each word length and add them to a dictionary
            length_dict = dict()
            for length in word_lengths:
                length_dict[length] = set()

            # create a dict for the language and add it to `self.words`
            self.words[language] = length_dict
            
            # load the words from the paths
            for path in paths:
                # get the contents seperated into lines / words
                with open(path, "r") as d:
                    contents = d.read().split("\n")

                # check each word
                for word in contents:
                    # check the length
                    if len(word) not in word_lengths:
                        print(f"Word: '{word}' is not long enough (only words with lengths in {word_lengths}).")
                        continue

                    # convert the words to all caps
                    word = word.upper()

                    # check the character
                    if not check_characters(word):
                        continue

                    # add word
                    length_dict[len(word)].add(word)
            
            # convert the sets to lists
            for length in word_lengths:
                self.words[language][length] = list(self.words[language][length])

        print(self.words)
    
    def get_random_word(self, length: int, language: str) -> str | None:
        language_dict = self.words.get(language)

        if language is None:
            return None
        
        length_set = language_dict.get(length)

        if length_set is None:
            return None
        
        return secrets.choice(length_set)

    def word_exists(self, word: str, length: int, language: str) -> bool:
        return True