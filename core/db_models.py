from flask_login import UserMixin

from settings import auth, words
from settings.db import DB

class Score(DB.Model): # type: ignore
    id              = DB.Column(DB.Integer, primary_key=True)

    language        = DB.Column(DB.String(words.LANGUAGE_MAX_LEN))
    word_length     = DB.Column(DB.Integer())
    tries           = DB.Column(DB.Integer())
    completed       = DB.Column(DB.Integer())

    user_id = DB.Column(DB.Integer, DB.ForeignKey("user.id")) # "user.id" is meant to be lowercase 

class User(DB.Model, UserMixin): # type: ignore
    id              = DB.Column(DB.Integer, primary_key=True)

    username        = DB.Column(DB.String(auth.USERNAME_MAX_LEN), unique=True)
    password_hash   = DB.Column(DB.BINARY(auth.BCRYPT_HASH_LEN))
    salt            = DB.Column(DB.BINARY(auth.SALT_LEN))

    score           = DB.relationship("Score") # "Score" is meant to be capitalized