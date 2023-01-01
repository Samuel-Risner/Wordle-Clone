import bcrypt

from settings import auth

def generate_password_hash(password: str) -> tuple[bytes, bytes]:
    password = password.encode()
    salt = bcrypt.gensalt(auth.SALT_LEN)
    hashed = bcrypt.hashpw(password, salt)

    return hashed, salt

def check_if_password_matches(password_to_check: str, hashed_password: bytes, salt: bytes) -> bool:
    password_to_check = password_to_check.encode()
    hashed = bcrypt.hashpw(password_to_check, salt)

    return hashed == hashed_password