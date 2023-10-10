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
    data = request.get_json()
    new_task = Task(name=data['name'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'Task created successfully'}), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

