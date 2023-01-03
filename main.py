import json

from flask import Flask, Response
from flask import render_template, redirect, flash, url_for
from flask import request
from flask_login import LoginManager
from flask_login import login_user, login_required, logout_user
from flask_login import current_user

from changable_settings import PORT, HOST
from core.checks import check_game_id
from core.create_db import create_database
from core.db_models import User as MODEL_USER
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

@login_manager.user_loader
def load_user(user_id):
    word_handler.add_user(int(user_id))
    return MODEL_USER.query.get(int(user_id))

# create cutom error pages
for error_num in settings.errors.SUPPORTED_ERROR_PAGES:
    @app.errorhandler(int(error_num))
    def error(e):
        return render_template(f"error_pages/{error_num}.html")

@app.route("/json/get_progress/<game_id>", methods=["POST", "GET"])
@login_required
def get_progress(game_id: str):
    if not check_game_id(game_id):
        return Response(json.dumps([None]), mimetype="application/json")
    
    progress = word_handler.get_word_progress(current_user.id, game_id)
    
    if progress is None:
        json_data = json.dumps([None])
    else:
        json_data = json.dumps(progress)
    
    return Response(json_data, mimetype="application/json")

# @app.route("/jj")
# def route1():
#     dict1 = [["BAUM", [9, 9, 9, 9, 9]], ["HUND", [9, 9, 9, 9, 9]], ["BRAUN", [9, 9, 9, 9, 9]], ["BAUM", [9, 9, 9, 9, 9]]]
#     return Response(json.dumps(dict1), mimetype='application/json')

@app.route("/game/<game_id>")
@login_required
def game(game_id: str):
    word = word_handler.get_word(current_user.id, game_id)

    if word is None:
        return redirect("/error/400/home", code=303)

    return render_template("game.html", game_id=game_id, amount_tries=word.amount_tries, word_length=len(word.word))

@app.route("/game/setup/<language>", methods=["GET", "POST"])
@login_required
def select_game_size(language: str):
    if language not in settings.game.SUPPORTED_LANGUAGES:
        return redirect("/error/400/home", code=303)
    
    if request.method == "POST":
        word_length = request.form.get("word_length")
        amount_tries = request.form.get("amount_tries")

        if (word_length is None) or (amount_tries is None):
            return redirect("/error/400/home", code=303)
        
        try:
            word_length = int(word_length)
        except ValueError:
            return redirect("/error/400/home", code=303)
        
        try:
            amount_tries = int(amount_tries)
        except ValueError:
            return redirect("/error/400/home", code=303)
        
        game_id = word_handler.new_word(current_user.id, word_length, amount_tries, language)

        return redirect(url_for("game", game_id=game_id))

    return render_template(
        "select_game_stuff.html",
        language=language,
        select_language_url=url_for("select_game_language"),
        min_word_length=settings.game.MIN_WORD_LEN,
        max_word_length=settings.game.MAX_WORD_LEN,
        min_tries=settings.game.MIN_TRIES,
        max_tries=settings.game.MAX_TRIES
    )

@app.route("/game/choose_language")
@login_required
def select_game_language():
    return render_template(
        "select_game_language.html",
        languages=settings.game.SUPPORTED_LANGUAGES,
        select_game_size_url=url_for("select_game_size", language="")
    )

@app.route("/")
def index():    
    return render_template("index.html")

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
            return redirect("error/400/sign_up", code=303)
        
        # check if they have correct formatting
        username_check = validate_username(username)
        password_check = validate_password(password)

        if not username_check[0]:
            flash(username_check[1], category="error")
            return render_template("login.html")
        
        if not password_check[0]:
            flash(password_check[1], category="error")
            return render_template("login.html")
        
        # convert password and username from base 64 to plain text
        username = b64_decode(username)
        password = b64_decode(password)

        if username is None:
            flash("Could not base 64 decode the username.", category="error")
            return redirect("error/400/sign_up", code=303)
        if password is None:
            flash("Could not base 64 decode the password.", category="error")
            return redirect("error/400/sign_up", code=303)
        
        # get the user from the database
        user = MODEL_USER.query.filter_by(username=username).first()

        # if the user was not found in the database
        if user is None:
            flash(f"Username '{username}' does not exist.", category="error")
            return render_template("login.html")
        
        # check if the passwords match
        passwords_match = check_if_password_matches(password, user.password_hash, user.salt)

        if not passwords_match:
            flash(f"Password is incorrect.", category="error")
            return render_template("login.html")
        else:
            login_user(user, remember=settings.auth.REMEMBER_USER)

            print(current_user.id)
            print(isinstance(current_user.id, int))

            flash(f"Successfully logged in!.", category="success")
            return (redirect(url_for("index")))

    return render_template("login.html")

@app.route("/logout", methods=["GET", "POST"])
@login_required
def logout():
    if request.method == "POST":
        logout_type = request.form.get("logout_type")

        if logout_type not in ("soft", "hard"):
            return redirect("error/400/logout", code=303)

        if logout_type == "hard":
            word_handler.remove_user(current_user.id)
        
        logout_user()
        return redirect(url_for("login"))

@app.route("/sign_up", methods=["GET", "POST"])
def sign_up():
    if request.method == "POST":
        # get from form
        username = request.form.get("username")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm_password")

        # check if they were in the form
        if (username is None) or (password is None) or (confirm_password is None):
            return redirect("error/400/sign_up", code=303)
        
        # if the two passwords match
        if password != confirm_password:
            flash("Passwords do not match.", category="error")
            return render_template("sign_up.html")
        
        # check if they have correct formatting
        username_check = validate_username(username)
        password_check = validate_password(password)

        if not username_check[0]:
            flash(username_check[1], category="error")
            return render_template("sign_up.html")
        
        if not password_check[0]:
            flash(password_check[1], category="error")
            return render_template("sign_up.html")

        # convert password and username from base 64 to plain text
        username = b64_decode(username)
        password = b64_decode(password)

        if username is None:
            flash("Could not base 64 decode the username.", category="error")
            return redirect("error/400/sign_up", code=303)
        if password is None:
            flash("Could not base 64 decode the password.", category="error")
            return redirect("error/400/sign_up", code=303)

        # if the user already exists
        user = MODEL_USER.query.filter_by(username=username).first()
        if user is not None:
            flash("Username already exists!", category="error")
            return render_template("sign_up.html")

        # create new user
        password_hash, salt = generate_password_hash(password)
        new_user = MODEL_USER(username=username, password_hash=password_hash, salt=salt)
        DB.session.add(new_user)
        DB.session.commit()
        login_user(new_user, remember=settings.auth.REMEMBER_USER)

        flash("Account created! And logged in!", category="success")
        return (redirect(url_for("index")))

    return render_template("sign_up.html")

@app.route("/error/<num>/<origin>")
def error(num: str, origin: str):
    if num in settings.errors.SUPPORTED_ERROR_PAGES:
        return render_template(f"error_pages/{num}.html", origin=origin), int(num)
    else:
        return render_template(f"error_pages/404.html"), 404

if __name__ == "__main__":
    # app.run(port=PORT, host=HOST)
    app.run(debug=True, port=PORT, host=HOST)