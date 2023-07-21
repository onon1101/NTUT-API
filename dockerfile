FROM node:18.17.0

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "start"]