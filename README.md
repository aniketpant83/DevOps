# DevOps

Attemping the below project:

-Write a web application in React/Vue/Angular
-Write a REST API in Flask/Django/GoGin/whatever hooked to a database like Postgres
-Make your web application create and consume content from the API, locally at first.
-Write Dockerfiles for both projects and publish to a container registry like ghcr.io
-Deploy both containers with the solution of your choice, be it on a single node Docker runtime, or even a Kubernetes cluster.
-Setup DNS records such as your-app.io and api.your-app.io that point to both production workloads, and have Let'sEncrypt give you TLS certificate to access both project over the internet via HTTPS.
-Make your production front-end communicate with your production API. Figure out what CORS is and why it may be a problem in that setup.
-Document everything in each projects README.md file.
-Write unit tests for both projects and end-to-end tests that make your front-end interacting with your API.
-Write CI pipelines that run tests automatically on every push.
-Write build pipelines that publish your containers automatically on each git tag of your main branch. Make sure to follow semantic versionning.
-Find a solution that automates promotion of new artifacts in production when conditions are met.
