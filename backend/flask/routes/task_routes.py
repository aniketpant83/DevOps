from flask import jsonify, request
from flask_login import LoginManager, login_user, login_required, logout_user, UserMixin, current_user
from . import task_routes
from models import Task
from flask import Blueprint
from models import Task
from models import db

task_routes = Blueprint('task_routes', __name__)

@task_routes.route('/')
@login_required
def home():
    return jsonify({'message': 'Welcome to the Task Management API'})

@task_routes.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    tasks_data = [{'id': task.id, 'name': task.name, 'status': 
task.status} for task in tasks]
    return jsonify(tasks_data)

@task_routes.route('/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()

        headers = dict(request.headers)
        print('Request Headers:', headers)

        # Check if 'name' is present in the JSON data
        if 'name' not in data:
            raise ValueError("Task name is missing in the request.")

        new_task = Task(name=data['name'])
        db.session.add(new_task)
        db.session.commit()

        return jsonify({'message': 'Task created successfully'}), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400  # Bad Request
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@task_routes.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task_status(task_id):
    try:
        data = request.get_json()
        new_status = data.get('status')
        headers = dict(request.headers)
        print('Request Headers:', headers)

        if 'status' not in data:
            raise ValueError("Task status is missing in the request.")

        task = Task.query.get(task_id)
        task.status = new_status
        db.session.commit()

        return jsonify({'message': 'Task updated successfully', 'task': task.serialize()}), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400  # Bad Request
    except Exception as e:
        return jsonify({'error update': str(e)}), 500
    
@task_routes.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return jsonify({'message': 'Task deleted successfully'}), 200
        else:
            return jsonify({'error': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error del': str(e)}), 500