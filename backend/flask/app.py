from flask import Flask
from config import Config
from models import db, User, Task
from routes import user_routes, task_routes
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)

app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(user_routes.user_routes)
app.register_blueprint(task_routes.task_routes)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', debug=True)
