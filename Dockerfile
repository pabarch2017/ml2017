FROM node:6.12.0

WORKDIR /app

ADD . .

RUN npm install

CMD ["npm","start"]
