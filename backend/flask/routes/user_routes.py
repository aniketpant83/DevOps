from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from . import user_routes
from models import User
from flask_bcrypt import Bcrypt
from models import db
from flask_jwt_extended import create_access_token
from flask_login import LoginManager, login_user, login_required, logout_user, UserMixin, current_user
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import Blueprint

user_routes = Blueprint('user_routes', __name__)

@user_routes.route('/validate_token', methods=['GET'])
@jwt_required()
def validate_token():
    current_user = get_jwt_identity()
    print("the Current user is:",current_user)
    return jsonify(valid=True, user=current_user), 200

@user_routes.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    users_data = [{'id': user.id, 'username': user.username, 'email': 
user.email, 'password': user.password_hash} for user in users]
    return jsonify(users_data)


@user_routes.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'error': 'Username already exists'}), 400

    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    access_token = create_access_token(identity=username)
    
    return jsonify({
    'message': 'User registered successfully',
    'user': username,
    'access_token': access_token
}), 201


@user_routes.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        login_user(user)
        access_token = create_access_token(identity=username)
        return jsonify({
    'message': 'User logged in successfully',
    'user': username,
    'token': access_token
}), 200

    return jsonify({'error': 'Invalid username or password'}), 401


@user_routes.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'User logged out successfully'}), 200


@user_routes.route('/protected')
@login_required
def protected_route():
    return jsonify({'message': 'This is a protected route for authenticated users'}), 200