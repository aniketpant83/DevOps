from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .task import Task
from .user import User