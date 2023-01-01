from flask_sqlalchemy import SQLAlchemy

NAME = "database.db"
PATH = f"instance/{NAME}"
DB = SQLAlchemy()