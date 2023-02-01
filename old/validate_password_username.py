# from urllib.parse import unquote

# from settings import auth

# def _check(to_check: str, min_len: int, max_len: int, valid_chars: str, name: str) -> tuple[bool, str, str | None]:
#     """
#     Returns:
#     - if `to_check` was successfully checked
#     - a string containing an error message if `to_check` was not successfully checked, if the check was successfull
#     the string can be ignored
#     - if `to_check` was successfully checked the url unquoted string of `to_check`, otherwise None
#     """

#     print(to_check)

#     # url unquote 
#     to_check = unquote(to_check, "UTF-8")
    
#     # to short
#     if len(to_check) < min_len:
#         return False, f"The {name} must at least contain {min_len} letters.", None
    
#     # to long
#     if len(to_check) > max_len:
#         return False, f"The {name} may not consist of more than {max_len} letters.", None
    
#     # invalid characters
#     for character in to_check:
#         if character not in valid_chars:
#             return False, f"The {name} may not contain the character '{character}' but may only contain\
#                 characters in '{valid_chars}'.", None

#     return True, "Buh! This is an empty string!", to_check

# def validate_username(username: str) -> tuple[bool, str, str | None]:
#     """
#     Checks if the username `username` matches the requirements in valid characters and minimum and maximum length.
    
#     Returns:
#     - if `username` was successfully checked
#     - a string containing an error message if `username` was not successfully checked, if the check was successfull
#     the string can be ignored
#     - if `username` was successfully checked the url unquoted string of `username`, otherwise None
#     """

#     return _check(username, auth.USERNAME_MIN_LEN, auth.USERNAME_MAX_LEN, auth.USERNAME_VALID_CHARS, "username")

# def validate_password(password: str) -> tuple[bool, str, str | None]:
#     """
#     Checks if the password `password` matches the requirements in valid characters and minimum and maximum length.

#     Returns:
#     - if `password` was successfully checked
#     - a string containing an error message if `password` was not successfully checked, if the check was successfull
#     the string can be ignored
#     - if `password` was successfully checked the url unquoted string of `password`, otherwise None
#     """

#     return _check(password, auth.PASSWORD_MIN_LEN, auth.PASSWORD_MAX_LEN, auth.PASSWORD_VALID_CHARS, "password")