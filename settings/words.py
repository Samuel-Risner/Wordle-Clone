import json

from flask import Response

LEN_UNIQUE_ID = 16
UNIQUE_ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

WORD_VALID_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

DEFAULT_JSON_RESPONSE = Response(json.dumps(None), mimetype="application/json")

PATH_TO_WORD_TOML_FILE = "words.toml"

LANGUAGES = {
    "en": [
        [
            "words/en/test.dic",
        ],
        [5, 6, 7, 8],
        [6, 7, 9, 12],
    ],
    "de": [
        [
            "words/de/len_5.dic",
            "words/de/len_6.dic",
            "words/de/len_7.dic",
            "words/de/len_8.dic",
        ],
        [5, 6, 7, 8],
        [6, 7, 9, 12],
    ],
}