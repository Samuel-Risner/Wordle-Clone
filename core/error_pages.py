from flask import Flask
from flask import render_template

def render_error(error: int) -> tuple[str, int]:
    """Returns the rendered template for the error `error` with the corresponding integer `error`."""

    return render_template(f"error_pages/{error}.html"), error

def init_error_pages(app: Flask):
    """Adds custom error pages to the flask app `app`."""

    @app.errorhandler(400)
    def error_400(error):
        return render_template("error_pages/400.html"), 400

    @app.errorhandler(404)
    def erro_404r(error):
        return render_template("error_pages/404.html"), 404

    @app.errorhandler(500)
    def error_500(error):
        return render_template("error_pages/500.html"), 500