FROM node:6.12.0

VOLUME /app/output

WORKDIR /app

ADD . .

RUN npm install

CMD ["npm","start"]
