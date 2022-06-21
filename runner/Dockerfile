FROM alpinelinux/docker-cli

RUN apk update \
  && apk add --no-cache nodejs npm

WORKDIR /home/app

COPY package* /home/app

RUN npm install

COPY . /home/app

CMD ["node", "index.js"]
