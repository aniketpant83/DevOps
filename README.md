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

- Backend: On one terminal, navigate to the folder named backend, and execute the command 'python3 app.py'  
- Frontend: On second terminal, navigate to the folder named frontend, and execute the command 'npm start'  
- Access frontend on localhost:3000.  
- Access backend on localhost:5000 or localhost:5000/tasks.  
- Use the app.  

***Approach 2:*** Steps to Run the Full-Stack App on Containers:

Download Docker: Go to https://hub.docker.com, and choose the one for your OS.

From the dockerfiles in the repo, we will create two images and then two containers, one for Flask and one for React. To make these containers interact with each other we need to put them on the same network (since we are no longer working on the same local machine).  
- docker network create <network_name>

Backend: We need to first build an image. Then run container from that image.  
- On one terminal, navigate to the folder named backend where the dockerfile for Flask is.  
- Execute the command 'docker build -t <image_name>'  
- Execute the command 'docker run --name <container_name> --network <network_name> -p 5000:5000 <image_name>  
Note: Port 5000 is where your backend is exposed. If you're new to this stuff, then you probably wanna look up small things like what 5000:5000 means.


Frontend: We need to first build an image. Then run container from that image.  
- On one terminal, navigate to the folder named frontend where the dockerfile for React is.  
- Execute the command 'docker build -t <image_name>'  
- Execute the command 'docker run --name <container_name> --network <network_name> -p 3000:3000 <image_name>

Now that the app is running on the containers,
- Access frontend on localhost:3000.  
- Access backend on localhost:5000 or localhost:5000/tasks.  
- Use the app.
___

**CICD Using Gitlab-CI**

Note: A gitlab-ci file runs in stages. Each stage must have one or more jobs under it.
Two stages: Build (Two jobs: build_backend, build_frontend) and Deploy (deploys network and buils containers). Third stage Test yet to be included. 

Build job(s): moves into appropriate directories and builds images using the dockerfiles stored in those directories. Proceeds to compress and save the same in the form of artifacts. 

Deploy job: Creates a common network for both containers to connec to. Moves into appropriate directories and runs the docker containers on the loaded artifacts.  

___

**WIP: Unit Tests**
Written unit tests for Flask but working on the rest. Need to integrate the same into CICD

___

**Major Learnings Per Stage**

I went into this project with very little knowledge on each stage. That was the whole point of doing the project, so I could learn! To an experienced engineer, this should not take much time but it took me a lot of time to overcome some fundamental issues. I would suggest you skip reading this part as the best way to learn is to bump into these issues yourself and grow from them. Come and refer to these as the last resort, when even the rest of the internet fails you! Below are my learnings.

***Frontend React:*** 
The basic layout + syntax of React. Learnt how to use developer tools/web inspector to read http requests and responses. Learnt the importance of logging at different steps.

***Flask:*** 

- The basic layout and syntax for Flask. Also, very important to add try and except blocks as they make error handling much easier and also give you a sense of what is going wrong.
- Learnt the need for CORS, thereby allowing frontend and backend to interact with each other. Only with flask, did my data on frontend persist.

***Docker*** 

- Since we are no longer deploying on our local, the way the frontend accesses the backend changes. 
- Till now flask was receiving requests from react on the same host. Now we are running flask on one container and react on another. So we need to first create a common network, so that the containers are running on the same network. 
- Even the flask code needs a minor change. The last line of code in flask is app.run(debug=True) when running the fullstack from the same host, but when it needs be accessed from another host on the same network, we need to change the line to app.run(host='0.0.0.0',debug='True')
- Everytime you install stuff for your code, update your requirements.txt so that the image builds correctly.
- when creating a dockerfile, create the directories properly so that the two programs can interact with each other through corrcet pathing.

***Unit Tests***

- Run pytest from the backend directory and not from the test directory. There is a particular way of naming test files because pytest looks for that.
- Need to run all db operations withing 'with app.app_context():' block or else it will fail.
- For npm tests for react, the dependencies shouldn't have different version of jest installed. That is what has currently halted my progress in writing tests.

***CICD Pipeline***

- Need to call a base docker image (dind) or else your docker commands will fail.
- Each job runs on a separate environment/host, hence it adds complexities of passing the built image/network into the next jobs.
- Each job starts from the base directory.
- the '.' at the end of the docker build indicates to build it in the current directory, however this was not a requirement when I was doing it locally (maybe different default settings for not mentioning which directory).
- When you want to save something and upload it as an artifact, the path you give is where it searches for that particular document. Then when you load this saved document, it also searches in that same path.
- You cannot deploy frontend and backend in two different jobs because they have to connec to same network, and that network has to be in the same job. 
- It is very difficult to access the web app from the deployed container.
___
**Issues:** Can solve these with some effort but prioritizing finishing a skeletal structure for now.

Issue 1: Having to refresh the web page to see the added tasks.  
Issue 2: Having to refresh the web page to see deleted tasks, or else it is going from 'Done' to 'To Do'. Mostly linked to the above issue.
Issue 3: Accessing the web app after launching it on the gitlab runner.
Issue 4: Should the containers be deployed on to an EC2 instance? Easier to access the web app on EC2.
Issue 5: Including tests in CICD pipeline.

Please feel free to reach out if you want to pursue this project and have any doubts. Guiding others will only improve my knowledge. Wishing you the best!


