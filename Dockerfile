FROM node:9
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g forever
ENV PATH=$PATH:/home/node/.npm-global/bin
COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]
