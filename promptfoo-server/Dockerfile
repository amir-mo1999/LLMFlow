FROM node:21-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Necessary for node-gyp deps
RUN apk update && apk add --no-cache python3 build-base

RUN npm install

RUN npm install -g pm2

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]
