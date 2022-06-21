FROM node:gallium-alpine

WORKDIR /home/app

COPY package* /home/app

RUN npm install

COPY . /home/app

CMD ["node", "index.js"]
