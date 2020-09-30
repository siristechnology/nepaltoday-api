FROM node:14.11.0

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile
RUN cd node_modules/wordpos && yarn postinstall && cd ../..

COPY . .

ENV PORT=${PORT:-8080}

EXPOSE $PORT

CMD [ "yarn", "start" ]
