FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install --production

# Bundle app source
COPY bin /usr/src/app/bin
COPY models /usr/src/app/models
COPY routes /usr/src/app/routes
COPY CronManager.js /usr/src/app
COPY SocketManager.js /usr/src/app
COPY app.js /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]