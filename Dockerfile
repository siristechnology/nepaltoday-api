FROM node:14.11.0

# WORKDIR /usr/src/app

# Install dependencies
COPY package.json yarn.lock .yarnrc ./
RUN yarn install

COPY . .

EXPOSE 8080
CMD [ "yarn", "dev" ]