# Task Management Web Application

## Attempting the below project, not in a strict order:

- Write a web application in React/Vue/Angular. (Done)
- Write a REST API in Flask/Django/GoGin/whatever hooked to a database like Postgres. (Done)
- Make your web application create and consume content from the API, locally at first. (Done)
- Write Dockerfiles for both projects and publish to a container registry like ghcr.io. (Partially done, not published)
- Deploy both containers with the solution of your choice, be it on a single node Docker runtime, or even a Kubernetes cluster. (Done using two docker containers)
- Setup DNS records such as your-app.io and api.your-app.io that point to both production workloads, and have Let'sEncrypt give you TLS certificate to access both project over the internet via HTTPS. (To Do)
- Make your production front-end communicate with your production API. Figure out what CORS is and why it may be a problem in that setup. (To Do)
- Document everything in each projects README.md file. (In Progress)
- Write unit tests for both projects and end-to-end tests that make your front-end interacting with your API. (Partially Done)
- Write CI pipelines that run tests automatically on every push. (To Do)
- Write build pipelines that publish your containers automatically on each git tag of your main branch. Make sure to follow semantic versionning. (To Do)
- Find a solution that automates promotion of new artifacts in production when conditions are met. (To Do)
___

***Note:*** I am a beginner myself, but if you're even greener than me and not getting any of the terms, I URGE you to open chatGPT and understand these terms instead of glossing over it.

**How the app works:** Add tasks, refresh the page to see the added tasks (marked as Issue 1 under issues heading). You can click on the tasks to move them around. When a task reaches 'Done' state and is clicked again, it deletes it in the backend but on the frontend, it pushes it in a cylical process back to 'To Do'. Refresh the page to see the task as deleted (marked as Issue 2, linked to Issue 1 I think).

## Running The App
There are two approaches you can take; locally or docker. I would suggest doing it using the Approach 2 (dockers) as the whole point of containers is to make it portable and prevent a dependency mismatch. 

***Approach 1:*** Steps to Run the Full-Stack App Locally

-Backend: On one terminal, navigate to the folder named backend, and execute the command 'python3 app.py'  
-Frontend: On second terminal, navigate to the folder named frontend, and execute the command 'npm start'  
-Access frontend on localhost:3000.  
-Access backend on localhost:5000 or localhost:5000/tasks.  
-Use the app.  

***Approach 2:*** Steps to Run the Full-Stack App on Containers:

Download Docker: Go to https://hub.docker.com, and choose the one for your OS.

From the dockerfiles in the repo, we will create two images and then two containers, one for Flask and one for React. To make these containers interact with each other we need to put them on the same network (since we are no longer working on the same local machine).  
-docker network create <network_name>

Backend: We need to first build an image. Then run container from that image.  
-On one terminal, navigate to the folder named backend where the dockerfile for Flask is.  
-Execute the command 'docker build -t <image_name>'  
-Execute the command 'docker run --name <container_name> --network <network_name> -p 5000:5000 <image_name>  
Note: Port 5000 is where your backend is exposed. If you're new to this stuff, then you probably wanna look up small things like what 5000:5000 means.


Frontend: We need to first build an image. Then run container from that image.  
-On one terminal, navigate to the folder named frontend where the dockerfile for React is.  
-Execute the command 'docker build -t <image_name>'  
-Execute the command 'docker run --name <container_name> --network <network_name> -p 3000:3000 <image_name>

Now that the app is running on the containers,
-Access frontend on localhost:3000.  
-Access backend on localhost:5000 or localhost:5000/tasks.  
-Use the app.
___

***Unit Test:***
Written unit tests for Flask but working on the rest.

**Issues:** Can solve these with some effort but prioritizing finishing a skeletal structure for now.

Issue 1: Having to refresh the web page to see the added tasks.  
Issue 2: Having to refresh the web page to see deleted tasks, or else it is going from 'Done' to 'To Do'. Mostly linked to the above issue.

**Immediate Work In Progress:**
Adding unit tests for react. Adding end-to-end testing. CICD of the entire process.

