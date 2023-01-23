import json

from flask import Response

LEN_UNIQUE_ID = 16
UNIQUE_ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

WORD_VALID_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

DEFAULT_JSON_RESPONSE = Response(json.dumps(None), mimetype="application/json")

PATH_TO_WORD_TOML_FILE = "words.toml"

MIN_TRIES = 1
MAX_TRIES = 32

# SUPPORTED_LANGUAGES = ["en", "de"]
LANGUAGE_MAX_LEN = 2
LANGUAGE_VALID_CHARS = "abcdefghijklmnopqrstuvwxyz"