import secrets

try:
    import tomllib as toml
except ModuleNotFoundError:
    import toml

from settings.words import PATH_TO_WORD_TOML_FILE, WORD_VALID_LETTERS

class WordLoader():
    """Loads the words corresponding to language and length and is able to check if a certain word of a certain length
    and language was loaded and to return a random word of a certain language and length."""

    def __init__(self):
        self.words: dict[str, tuple[dict[int, list], list[int]]] = dict()
        """
        Key:
        
            Abbreiviation for the language.

        Value:

            - A dictionary consisting of an integer which represents the length of the words in the list.
            - A list containing all the word lengths.
        """

        self._load()

        self.supported_languages: list = list(self.words.keys())
        """Contains the abbreviations for the supported languages. So basically the keys from `self.words`."""
    
    def _load(self):
        """Loads all words."""

        def check_word(word: str, min_length: int, max_length: int) -> bool:
            """Check if the word only contains valid characters, is long enough and isn't to short. If all checks are
            passed `True` is returned, otherwise `False` is returned."""

            # Check if all characters are valid.
            for character in word:
                if character not in WORD_VALID_LETTERS:
                    # print(f"Word: '{word}' contains an invalid character: '{character}'.")
                    return False
            
            # Check if the word is long enough.
            if min_length > 0:
                if len(word) < min_length:
                    # print(f"Word: '{word}' is to short, minimum length: '{min_length}'.")
                    return False
            
            # Check if the word isn't to long.
            if max_length > 0:
                if len(word) > max_length:
                    # print(f"Word: '{word}' is to long, maximum length: '{max_length}'.")
                    return False

            return True
        
        # Load toml file contents.
        with open(PATH_TO_WORD_TOML_FILE, "r") as d:
            toml_stuff: dict[str, dict[str, list | int]] = toml.loads(d.read())

        # If the file wasn't loaded successfully.
        if not isinstance(toml_stuff, dict):
            # print(f"Unable to load toml file: '{PATH_TO_WORD_TOML_FILE}' because no dictionary was returned.")
            raise
        
        # Remove the schematic dictionary.
        if "language" in toml_stuff:
            toml_stuff.pop("language")

        # Go through each language of the dictionary and load it.
        for language, language_dict in toml_stuff.items():
            # If the user commented something out, which they are allowed to for the minimum and maximum length.
            language_dict.setdefault(None)

            # The paths to the files containing the words. If there are no paths there is no use in continuing loading
            # that language.
            word_paths: list[str] = language_dict.get("words")
            if word_paths is None:
                # print(f"The language '{language}' has no paths to files containing words.")
                continue
            
            # Get the minimum word length, the default is -1.
            min_word_length: int = language_dict.get("min_word_length")
            if min_word_length is None:
                min_word_length = -1
            
            # Get the maximum word length, the default is -1.
            max_word_length: int = language_dict.get("max_word_length")
            if max_word_length is None:
                max_word_length = -1
            
            # For all the words the language will have.
            all_words: list[str] = list()

            # Load the words from the files.
            for word_path in word_paths:
                with open(word_path, "r") as d:
                    contents = d.read()
                
                contents = contents.split("\n")

                empty_lines = list()
                for line in contents:
                    if line == "": empty_lines.append(line)
                for line in empty_lines: contents.remove(line)

                all_words.extend(contents)
            
            # Convert "all_words" to a set and back again to prevent words from occuring twice.
            all_words = set(all_words)
            all_words = list(all_words)

            # All the words are saved there in lists, according to their lengths.
            new_language_dict: dict[int, list] = dict()
            # Contains all the lengths of the loaded words, basically the keys from "new_language_dict".
            word_lengths: list[int] = list()

            # Checks all words and adds them to "new_language_dict".
            for word in all_words:
                # Convert the word to all uppercase.
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

            # print(self.words)
    
    def get_random_word(self, length: int, language: str) -> str | None:
        """Returns a random word from the language `language` with the length `length`. If the language does not exist
        or there are no words with the corresponding length `None` is returned."""

        language_dict = self.words.get(language)

        if language is None:
            return None
        
        length_list = language_dict[0].get(length)

        if length_list is None:
            return None
        
        return secrets.choice(length_list)

    def word_exists(self, word: str, length: int, language: str, default: bool) -> bool:
        """Checks if a word `word` from the language `language` and with the length `length` was loaded. If the language
        or the passed length do not exist the passed parameter `default` is returned. Otherwise `True` if the word was
        loaded or `False` if it was not."""

        language_dict = self.words.get(language)

        if language is None:
            return default
        
        length_set = language_dict[0].get(length)

        if length_set is None:
            return default
        
        return word in length_set
    
    def get_word_lengths(self, language: str) -> list[int] | None:
        """Returns a list with the loaded word lengths. "None" is returned if the language is not supported."""

        if language not in self.supported_languages:
            return None

        return self.words.get(language)[1]