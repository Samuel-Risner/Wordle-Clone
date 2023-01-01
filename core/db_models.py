from flask_login import UserMixin

from settings import auth, game
from settings.db import DB

class Score(DB.Model):
    id              = DB.Column(DB.Integer, primary_key=True)

    word_length     = DB.Column(DB.String(game.MAX_WORD_LEN))
    tries           = DB.Column(DB.Integer())
    completed       = DB.Column(DB.Integer())
    best_time       = DB.Column(DB.Integer())
    average_time    = DB.Column(DB.Integer())

    user_id = DB.Column(DB.Integer, DB.ForeignKey("user.id")) # "user.id" is meant to be lowercase 

class User(DB.Model, UserMixin):
    id              = DB.Column(DB.Integer, primary_key=True)

    username        = DB.Column(DB.String(auth.USERNAME_MAX_LEN), unique=True)
    password_hash   = DB.Column(DB.BINARY(auth.BCRYPT_HASH_LEN))
    salt            = DB.Column(DB.BINARY(auth.SALT_LEN))

    score           = DB.relationship("Score") # "Score" is meant to be capitalized