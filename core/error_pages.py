from flask import Flask
from flask import render_template

def render_error(error: int) -> tuple[str, int]:
    return render_template(f"error_pages/{error}.html"), error

def init_error_pages(app: Flask):
    @app.errorhandler(400)
    def error(e):
        return render_template("error_pages/400.html"), 400

    @app.errorhandler(404)
    def error(e):
        return render_template("error_pages/404.html"), 404

    @app.errorhandler(500)
    def error(e):
        return render_template("error_pages/500.html"), 500