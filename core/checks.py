from urllib.parse import unquote

import settings

def check_game_id(game_id: str) -> bool:
    """Checks if the length of the game id `game_id` and its characters match the requirements. `True` is returned if that's
    the case otherwise `False`."""

    if len(game_id) != settings.words.LEN_UNIQUE_ID:
        return False

    for character in game_id:
        if character not in settings.words.UNIQUE_ID_CHARS:
            return False

    return True

def check_word_characters(word: str) -> bool:
    """Checks if all the characters in the word `word` are supported. If they are `True` is returned otherwise `False`."""

    for character in word:
        if character not in settings.words.WORD_VALID_LETTERS:
            return False
    
    return True

def check_word(word: str, min_length: int, max_length: int) -> bool:
    """Check if the word only contains valid characters, is long enough and isn't to short. If all checks are
    passed `True` is returned, otherwise `False` is returned."""

    if not check_word_characters(word):
        return False
    
    # Check if the word is long enough.
    if min_length > 0:
        if len(word) < min_length:
            return False
    
    # Check if the word isn't to long.
    if max_length > 0:
        if len(word) > max_length:
            return False

    return True

def check_language(language: str) -> bool:
    """Checks if the language `language` has the required amount of characters and if they are valid. If everything is ok
    `True` is returned otherwise `False`."""

    if len(language) != settings.words.LANGUAGE_MAX_LEN:
        return False 
    
    for character in language:
        if character not in settings.words.LANGUAGE_VALID_CHARS:
            return False
    
    return True



def _check(to_check: str, min_len: int, max_len: int, valid_chars: str, name: str) -> tuple[bool, str, str | None]:
    """
    Returns:
    - if `to_check` was successfully checked
    - a string containing an error message if `to_check` was not successfully checked, if the check was successfull
    the string can be ignored
    - if `to_check` was successfully checked the url unquoted string of `to_check`, otherwise None
    """

    print(to_check)

    to_check = unquote(to_check, "UTF-8")
    
    if len(to_check) < min_len:
        return False, f"The {name} must at least contain {min_len} letters.", None
    
    if len(to_check) > max_len:
        return False, f"The {name} may not consist of more than {max_len} letters.", None
    
    # invalid characters
    for character in to_check:
        if character not in valid_chars:
            return False, f"The {name} may not contain the character '{character}' but may only contain\
                characters in '{valid_chars}'.", None

    return True, "Buh! This is an empty string!", to_check

def check_username(username: str) -> tuple[bool, str, str | None]:
    """
    Checks if the username `username` matches the requirements in valid characters and minimum and maximum length.
    
    Returns:
    - if `username` was successfully checked
    - a string containing an error message if `username` was not successfully checked, if the check was successfull
    the string can be ignored
    - if `username` was successfully checked the url unquoted string of `username`, otherwise None
    """

    return _check(username, settings.auth.USERNAME_MIN_LEN, settings.auth.USERNAME_MAX_LEN, settings.auth.USERNAME_VALID_CHARS, "username")

def check_password(password: str) -> tuple[bool, str, str | None]:
    """
    Checks if the password `password` matches the requirements in valid characters and minimum and maximum length.

    Returns:
    - if `password` was successfully checked
    - a string containing an error message if `password` was not successfully checked, if the check was successfull
    the string can be ignored
    - if `password` was successfully checked the url unquoted string of `password`, otherwise None
    """

    return _check(password, settings.auth.PASSWORD_MIN_LEN, settings.auth.PASSWORD_MAX_LEN, settings.auth.PASSWORD_VALID_CHARS, "password")