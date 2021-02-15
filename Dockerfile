FROM node:14.11.0

WORKDIR /usr/src/app

# Install dependencies
COPY package.json yarn.lock .yarnrc ./
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 8080
CMD [ "yarn", "start" ]