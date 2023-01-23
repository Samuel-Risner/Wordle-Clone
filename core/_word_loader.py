import secrets, logging

try:
    import tomllib as toml
except ModuleNotFoundError:
    import toml

from settings.words import PATH_TO_WORD_TOML_FILE
from .checks import check_language, check_word

class WordLoader():
    """Loads the words corresponding to language and length and is able to check if a certain word of a certain length
    and language was loaded and to return a random word of a certain language and length."""

    def __init__(self):
        self.logger = logging.getLogger("word_loader")

        self.words: dict[str, tuple[dict[int, list[str]], list[int]]] = dict()
        """
        Key:
        
            Abbreviation for the language.

        Value:
            - A tuple containing:
            - A dictionary consisting of an integer which represents the length of the words in a list.
            - A list containing all the word lengths.
        """

        self._load()

        self.supported_languages: list[str] = list(self.words.keys())
        """Contains the abbreviations for the supported languages. So basically the keys from `self.words`."""
    
    def _load(self):
        """Loads all words."""

        # Load toml file contents.
        with open(PATH_TO_WORD_TOML_FILE, "r") as d:
            toml_stuff: dict[str, dict[str, list[str] | int]] = toml.loads(d.read())

        # If the file wasn't loaded successfully.
        if not isinstance(toml_stuff, dict):
            raise
        
        # Remove the schematic/example dictionary.
        if "language" in toml_stuff:
            toml_stuff.pop("language")

        # Go through each language of the dictionary and load it.
        for language, language_dict in toml_stuff.items():

            # check if the language abbreviation was formatted correctly 
            if not check_language(language):
                self.logger.error(f"Language abbreviation: '{language}' is not formatted correctly.")
                continue

            # The paths to the files containing the words. If there are no paths there is no use in continuing loading
            # that language.
            word_paths: list[str] = language_dict.get("words") # type: ignore
            if word_paths is None:
                self.logger.error(f"The language '{language}' has no paths to files containing words.")
                continue
            
            # Get the minimum word length, the default is -1.
            min_word_length: int = language_dict.get("min_word_length") # type: ignore
            if min_word_length is None:
                self.logger.debug(f"Defaulting to '-1' for the minimum word length for the language: '{language}'.")
                min_word_length = -1
            
            # Get the maximum word length, the default is -1.
            max_word_length: int = language_dict.get("max_word_length") # type: ignore
            if max_word_length is None:
                self.logger.debug(f"Defaulting to '-1' for the maximum word length for the language: '{language}'.")
                max_word_length = -1
            
            # For all the words the language will have.
            all_words: list[str] = list()

            # Load the words from the files.
            for word_path in word_paths:
                with open(word_path, "r") as d:
                    contents = d.read()
                
                contents = contents.split("\n")

                empty_lines: list[str] = list()
                for line in contents:
                    if line == "": empty_lines.append(line)
                for line in empty_lines: contents.remove(line)

                all_words.extend(contents)
            
            # Convert "all_words" to a set and back again to prevent words from occuring twice.
            temp = set(all_words)
            all_words = list(temp)

            # All the words are saved in lists, according to their lengths.
            new_language_dict: dict[int, list] = dict()
            # Contains all the lengths of the loaded words, basically the keys from "new_language_dict".
            word_lengths: list[int] = list()

            # Checks all words and adds them to "new_language_dict".
            for word in all_words:
                word = word.upper()

                # Check if the word meets the requirements concerning valid characters and maximum and minimum length.
                # And adds the word to "new_language_dict" and the length of the word to "word_lengths".
                if check_word(word, min_word_length, max_word_length):
                    length = len(word)
                    if length in word_lengths:
                        new_language_dict[length].append(word)
                    else:
                        word_lengths.append(length)
                        new_language_dict[length] = [word]
            
            # Sort the lengths from smallest to largest.
            word_lengths.sort()

            # Add the language to the class attribute.
            self.words[language] = (new_language_dict, word_lengths)
    
    def get_random_word(self, length: int, language: str) -> str | None:
        """Returns a random word from the language `language` with the length `length`. If the language does not exist,
        is incorrecty formatted or there are no words with the corresponding length `None` is returned."""

        if not check_language(language):
            self.logger.debug(f"Language: '{language}' is not correctly formatted.")
            return None

        language_dict = self.words.get(language)

        if language_dict is None:
            self.logger.debug(f"Language: '{language}' does not exist.")
            return None
        
        length_list = language_dict[0].get(length)

        if length_list is None:
            self.logger.debug(f"There are no words with the length: '{length}' for the language: '{language}'.")
            return None
        
        word = secrets.choice(length_list)
        self.logger.debug(f"Random word: '{word}'.")
        return word

    def word_exists(self, word: str, length: int, language: str, default: bool) -> bool:
        """Checks if the word `word` from the language `language` and with the length `length` was loaded. If the language
        or the passed length do not exist or the language is incorrecty formatted the passed parameter `default` is
        returned. Otherwise `True` if the word was loaded or `False` if it was not."""

        if not check_language(language):
            self.logger.debug(f"Language: '{language}' is not correctly formatted.")
            return default

        language_dict = self.words.get(language)

        if language_dict is None:
            self.logger.debug(f"Language: '{language}' does not exist.")
            return default
        
        length_set = language_dict[0].get(length)

        if length_set is None:
            self.logger.debug(f"There are no words with the length: '{length}' for the language: '{language}'.")
            return default
        
        return word in length_set
    
    def get_word_lengths(self, language: str) -> list[int] | None:
        """Returns a list with the loaded word lengths. `None` is returned if the language is not supported or
        incorrectly formatted."""

        if not check_language(language):
            self.logger.debug(f"Language: '{language}' is not correctly formatted.")
            return None
    	
        words = self.words.get(language)
        if words is None:
            self.logger.debug(f"Language: '{language}' does not exist.")
            return None

        return words[1]