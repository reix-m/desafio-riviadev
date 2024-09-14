
FROM node:alpine

WORKDIR /usr/app

COPY package*.json .

RUN npm install

COPY . .

RUN scripts/build.sh

EXPOSE 3001

CMD ["npm", "start"]

