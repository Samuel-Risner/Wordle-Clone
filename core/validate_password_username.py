import base64, binascii

from settings import auth

def b64_decode(to_decode: str) -> str | None:
    to_decode = to_decode.encode()

    try:
        to_decode = base64.b64decode(to_decode)
    except binascii.Error:
        return None
    
    try:
        to_decode = to_decode.decode("UTF-8")
    except UnicodeDecodeError:
        return None
    
    return to_decode

def _check(to_check: str, min_len: int, max_len: int, valid_chars: str, name: str) -> tuple[bool, str]:
    to_check = b64_decode(to_check)
    print(to_check)

    if to_check is None:
        return False, f"Could not base 64 decode the {name}."
    
    if len(to_check) < min_len:
        return False, f"The {name} must at least contain {min_len} letters."
    
    if len(to_check) > max_len:
        return False, f"The {name} may not consist of more than {max_len} letters."
    
    for character in to_check:
        if character not in valid_chars:
            return False, f"The {name} may not contain the character '{character}' but may only contain\
                characters in '{valid_chars}'."

    return True, "Buh! This is an empty string!"

def validate_username(username: str) -> tuple[bool, str]:
    return _check(username, auth.USERNAME_MIN_LEN, auth.USERNAME_MAX_LEN, auth.USERNAME_VALID_CHARS, "username")

def validate_password(password: str) -> tuple[bool, str]:
    return _check(password, auth.PASSWORD_MIN_LEN, auth.PASSWORD_MAX_LEN, auth.PASSWORD_VALID_CHARS, "password")