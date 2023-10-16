
import unittest
import json
from app import app, db, Task

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        self.app = app.test_client()
        with app.app_context():
            db.create_all()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()


    def test_home_endpoint(self):
        response = self.app.get('/')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Welcome to the Task Management API')

    def test_create_task(self):
        response = self.app.post('/tasks', json={'name': 'Test Task'})
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 201)
        self.assertIn('message', data)
        self.assertEqual(data['message'], 'Task created successfully')

    def test_get_tasks(self):
        task = Task(name='Test Task')
        with app.app_context():
            db.session.add(task)
            db.session.commit()
            response = self.app.get('/tasks')
            data = json.loads(response.data)
            self.assertEqual(response.status_code, 200)
            self.assertIsInstance(data, list)
            self.assertEqual(len(data), 1)
            self.assertEqual(data[0]['name'], 'Test Task')

    def test_update_task_status(self):
        task = Task(name='Test Task')
        with app.app_context():
            db.session.add(task)
            db.session.commit()
            response = self.app.put(f'/tasks/{task.id}', json={'status': 'In Progress'})
            data = json.loads(response.data)
            self.assertEqual(response.status_code, 201)
            self.assertIn('message', data)
            self.assertEqual(data['message'], 'Task updated successfully')
            self.assertIn('task', data)
            self.assertEqual(data['task']['status'], 'In Progress')

    def test_delete_task(self):
        task = Task(name='Test Task')
        with app.app_context():
            db.session.add(task)
            db.session.commit()
            response = self.app.delete(f'/tasks/{task.id}')
            data = json.loads(response.data)
            self.assertEqual(response.status_code, 200)
            self.assertIn('message', data)
            self.assertEqual(data['message'], 'Task deleted successfully')

        # Verify the task is actually deleted
        response = self.app.get(f'/tasks/{task.id}')
        self.assertEqual(response.status_code, 404)

if __name__ == '__main__':
    unittest.main()
