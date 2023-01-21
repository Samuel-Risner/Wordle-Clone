import bcrypt

from settings import auth

def generate_password_hash(password: str) -> tuple[bytes, bytes]:
    """Hashes the passowrd `password` and returns its hash and salt."""

    salt = bcrypt.gensalt(auth.SALT_LEN)
    hashed = bcrypt.hashpw(password.encode(), salt)

    return hashed, salt

def check_if_password_matches(password_to_check: str, hashed_password: bytes, salt: bytes) -> bool:
    """Checks if the password `password_to_check` is the same as the hashed password `hashed_password` when it
    is also hashed with the salt `salt`."""
    
    hashed = bcrypt.hashpw(password_to_check.encode(), salt)

    return hashed == hashed_password