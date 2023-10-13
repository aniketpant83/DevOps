# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files into the image
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files into the image
COPY . .

# Expose a port (if your app needs to listen on a specific port)
EXPOSE 3000

# Define the default command to run when the container starts
CMD [ "node", "App.js" ]
