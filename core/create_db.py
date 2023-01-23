import os

from flask import Flask

from settings.db import PATH, NAME, DB

def create_database(app: Flask):
    """Creates the database if it does already exist."""

    if (not os.path.exists(PATH)) and (not os.path.exists(NAME)):
        with app.app_context():
            DB.create_all()
            
        print('Created Database!')