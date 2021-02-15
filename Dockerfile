FROM node:14.11.0-slim

WORKDIR /usr/src/app

# Install dependencies
COPY package.json yarn.lock .yarnrc ./
RUN npm install -g yarn
RUN yarn plugin import workspace-tools
RUN yarn set version berry
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start" ]