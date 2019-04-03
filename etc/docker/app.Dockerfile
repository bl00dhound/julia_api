FROM node:9
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production
RUN npm install -g forever knex
ENV PATH=$PATH:/home/node/.npm-global/bin
COPY . .
# RUN npm run db-up
EXPOSE 8080
CMD [ "npm", "start" ]
