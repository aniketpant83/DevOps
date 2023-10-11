from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    status = db.Column(db.String(50), nullable=False, default='To Do')

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'status': self.status
        }

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Task Management API'})

@app.route('/tasks', methods=['GET'])
def get_tasks():
    tasks = Task.query.all()
    tasks_data = [{'id': task.id, 'name': task.name, 'status': 
task.status} for task in tasks]
    return jsonify(tasks_data)

@app.route('/tasks', methods=['POST'])
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

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task_status(task_id):
    try:
        data = request.get_json()
        new_status = data.get('status')
        headers = dict(request.headers)
        print('Request Headers:', headers)

        # Check if 'name' is present in the JSON data
        #ame' not in data:
        #    raise ValueError("Task name is missing in the request.")
        if 'status' not in data:
            raise ValueError("Task status is missing in the request.")

        task = Task.query.get(task_id)
        task.status = new_status
        db.session.commit()

        return jsonify({'message': 'Task updated successfully', 'task': task.serialize()}), 201
    except ValueError as ve:
        return jsonify({'error': str(ve)}), 400  # Bad Request
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

