FROM node:9
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g forever
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
