FROM node:alpine

WORKDIR /app

VOLUME [ "/app/data" ]

EXPOSE 3000

COPY package*.json ./

RUN npm install

COPY . . 

CMD [ "npm", "run", "start" ]
