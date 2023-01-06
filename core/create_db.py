from os import path

from flask import Flask

import settings

from .db_models import Score, User

def create_database(app:Flask):
    if not path.exists(settings.db.PATH):
        with app.app_context():
            settings.db.DB.create_all()
            
        print('Created Database!')