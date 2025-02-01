FROM node:20.14.0


WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install express

COPY . .


EXPOSE 8010

CMD ["node", "server.js"]

