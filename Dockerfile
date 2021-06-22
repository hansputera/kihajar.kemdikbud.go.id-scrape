FROM node:14
COPY . /usr/app
WORKDIR /usr/app

RUN yarn install
EXPOSE 3000

CMD ["node", "index.js"]