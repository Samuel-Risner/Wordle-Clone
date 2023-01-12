import json

from flask import Flask, Response
from flask import render_template, redirect, flash, url_for
from flask import request
from flask_login import LoginManager
from flask_login import login_user, login_required, logout_user
from flask_login import current_user

from changable_settings import PORT, HOST
from core.checks import check_game_id, check_word_characters
from core.create_db import create_database
from core.db_models import User as MODEL_USER
from core.error_pages import render_error, init_error_pages
from core.hash_functions import check_if_password_matches, generate_password_hash
from core.secret_functions import get_app_secret_key
from core.validate_password_username import validate_password, validate_username, b64_decode
from core.word_handler import WordHandler
from settings.db import DB
import settings

word_handler = WordHandler()

app = Flask(__name__)
app.config["SECRET_KEY"] = get_app_secret_key()
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{settings.db.NAME}"

DB.init_app(app)
create_database(app)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

init_error_pages(app)

@login_manager.user_loader
def load_user(user_id):
    return MODEL_USER.query.get(int(user_id))

@app.route("/json/get_progress/<game_id>", methods=["POST", "GET"])
@login_required
def get_progress(game_id: str):
    if not check_game_id(game_id):
        return settings.words.DEFAULT_JSON_RESPONSE
    
    progress = word_handler.get_word_progress(current_user.id, game_id)
    
    if progress is None:
        return settings.words.DEFAULT_JSON_RESPONSE
    
    return Response(json.dumps(progress), mimetype="application/json")

@app.route("/json/add_word/<game_id>/<word>")
@login_required
def add_word(game_id: str, word: str):
    if (not check_game_id(game_id)) or (not check_word_characters(word)):
        return settings.words.DEFAULT_JSON_RESPONSE
    
    success, result = word_handler.do_try(current_user.id, game_id, word)

    # defeat or victory / game over
    if success in (1, 2, -6):
        word_handler.finish_word(current_user.id, game_id)
    
    # no error occured
    if (success >= 0):
        return Response(json.dumps(result), mimetype="application/json")
        
    return settings.words.DEFAULT_JSON_RESPONSE

@app.route("/game/result/<game_id>")
@login_required
def game_result(game_id: str):
    if not check_game_id(game_id):
        return render_error(404)
    
    word_info = word_handler.get_word_finished_info(current_user.id, game_id)
    word_handler.remove_word(current_user.id, game_id)
    
    if word_info is None:
        return render_error(400)

    return render_template(
        "result.html",
        victory=word_info[0],
        word_to_guess=word_info[1],
        available_tries=word_info[2],
        remaining_tries=word_info[3],
        user=current_user
    )

@app.route("/game/play/<game_id>")
@login_required
def game(game_id: str):
    if not check_game_id(game_id):
        return render_error(404)

    word = word_handler.get_word(current_user.id, game_id)

    if word is None:
        return render_error(404)

    return render_template(
        "game.html",
        game_id=game_id,
        amount_tries=word.amount_tries,
        word_length=len(word.word),
        user=current_user
    )

@app.route("/game/setup/<language>", methods=["GET", "POST"])
@login_required
def select_game_size(language: str):
    if language not in settings.game.SUPPORTED_LANGUAGES:
        return render_error(400)
    
    if request.method == "POST":
        word_length = request.form.get("word_length")
        amount_tries = request.form.get("amount_tries")

        if (word_length is None) or (amount_tries is None):
            return render_error(400)
        
        try:
            word_length = int(word_length)
        except ValueError:
            return render_error(400)
        
        try:
            amount_tries = int(amount_tries)
        except ValueError:
            return render_error(400)
        
        game_id = word_handler.new_word(current_user.id, word_length, amount_tries, language)

        return redirect(url_for("game", game_id=game_id))

    return render_template(
        "select_game_stuff.html",
        language=language,
        select_language_url=url_for("select_game_language"),
        min_word_length=settings.game.MIN_WORD_LEN,
        max_word_length=settings.game.MAX_WORD_LEN,
        min_tries=settings.game.MIN_TRIES,
        max_tries=settings.game.MAX_TRIES,
        user=current_user
    )

@app.route("/game/choose_language")
@login_required
def select_game_language():
    return render_template(
        "select_game_language.html",
        languages=settings.game.SUPPORTED_LANGUAGES,
        select_game_size_url=url_for("select_game_size", language=""),
        user=current_user
    )

@app.route("/active_games")
@login_required
def active_games():
    games = word_handler.get_active_games(current_user.id)
    print(games)
    return render_template("active_games.html", active_games=games, user=current_user)

@app.route("/finished_games")
@login_required
def finished_games():
    pass

@app.route("/")
def index():    
    return render_template("index.html", user=current_user)

@app.route("/home")
def home():
    return redirect(url_for("index"))

# @app.route("/account")
# @login_required
# def account():
#     return render_template("account.html")

# @app.route("/account/delete_account")
# @login_required
# def delete_account():
#     return render_template("delete_account.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        # get from form
        username = request.form.get("username")
        password = request.form.get("password")

        # check if they were in the form
        if (username is None) or (password is None):
            return render_error(400)
        
        # check if they have correct formatting
        username_check = validate_username(username)
        password_check = validate_password(password)

        if not username_check[0]:
            flash(username_check[1], category="error")
            return render_template("login.html", user=current_user)
        
        if not password_check[0]:
            flash(password_check[1], category="error")
            return render_template("login.html", user=current_user)
        
        # convert password and username from base 64 to plain text
        username = b64_decode(username)
        password = b64_decode(password)

        if username is None:
            flash("Could not base 64 decode the username.", category="error")
            return render_error(400)
        if password is None:
            flash("Could not base 64 decode the password.", category="error")
            return render_error(400)
        
        # get the user from the database
        user = MODEL_USER.query.filter_by(username=username).first()

        # if the user was not found in the database
        if user is None:
            flash(f"Username '{username}' does not exist.", category="error")
            return render_template("login.html", user=current_user)
        
        # check if the passwords match
        passwords_match = check_if_password_matches(password, user.password_hash, user.salt)

        if not passwords_match:
            flash(f"Password is incorrect.", category="error")
            return render_template("login.html", user=current_user)
        else:
            login_user(user, remember=settings.auth.REMEMBER_USER)

            print(current_user.id)
            print(isinstance(current_user.id, int))

            flash(f"Successfully logged in!", category="success")
            return redirect(url_for("index"))

    return render_template("login.html", user=current_user)

@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    if request.method == "POST":        
        logout_user()
        return redirect(url_for("login"))
    
    return render_template("logout.html", user=current_user)

@app.route("/sign_up", methods=["GET", "POST"])
def sign_up():
    if request.method == "POST":
        # get from form
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        # check if they were in the form
        if (username is None) or (password is None) or (confirm_password is None):
            return render_error(400)
        
        # if the two passwords match
        if password != confirm_password:
            flash("Passwords do not match.", category="error")
            return render_template("sign_up.html", user=current_user)
        
        # check if they have correct formatting
        username_check = validate_username(username)
        password_check = validate_password(password)

        if not username_check[0]:
            flash(username_check[1], category="error")
            return render_template("sign_up.html", user=current_user)
        
        if not password_check[0]:
            flash(password_check[1], category="error")
            return render_template("sign_up.html", user=current_user)

        # convert password and username from base 64 to plain text
        username = b64_decode(username)
        password = b64_decode(password)

        if username is None:
            flash("Could not base 64 decode the username.", category="error")
            return render_error(400)
        if password is None:
            flash("Could not base 64 decode the password.", category="error")
            return render_error(400)

        # if the user already exists
        user = MODEL_USER.query.filter_by(username=username).first()
        if user is not None:
            flash("Username already exists!", category="error")
            return render_template("sign_up.html", user=current_user)

        # create new user
        password_hash, salt = generate_password_hash(password)
        new_user = MODEL_USER(username=username, password_hash=password_hash, salt=salt)
        DB.session.add(new_user)
        DB.session.commit()
        login_user(new_user, remember=settings.auth.REMEMBER_USER)

        flash("Account created! And logged in!", category="success")
        return (redirect(url_for("index")))

    return render_template("sign_up.html", user=current_user)

if __name__ == "__main__":
    # app.run(port=PORT, host=HOST)
    app.run(debug=True, port=PORT, host=HOST)