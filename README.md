# NepalToday-Api

[![Greenkeeper badge](https://badges.greenkeeper.io/siristechnology/nepaltoday-api.svg)](https://greenkeeper.io/)

A graphql based api endpoint for NepalToday mobile app

![alt text](/assets/images/graphql-interface.png)

## Some helpful commands

1. Run `kill-port 4000` to kill process in port 4000. kill-port is a npm module

## Note: currently docker build is failing because it refers to a private repo

## Steps to run docker image locally

1. Run `docker build -t nepaltoday-image .` to build docker image.
   `nepaltoday-image` is image name and `.` is path to dockerfile.
2. Run `docker run -e PORT=3000 -p 3000:3000 nepaltoday-image` to run docker
   image `nepaltoday-image` locally
   - Heroku ignores EXPOSE command inside dockerfile. It randomly supplies PORT
     variable and maps it to http ports
   - Run `docker ps` to view running containers
   - Run `docker stop [container-id]` to stop a running container

## Some helpful docker commands

- To view all the images: docker images
- To view all the containers including stopped ones: docker ps -a
- To remove all containers: docker rm \$(docker ps -a -q)
- To remove all images (deletes physical files): docker rm \$(docker ps -a -q)
- To view app logs: heroku logs -a lunchmateserver
- To run bash into heroku app: heroku run bash -a lunchmateserver
- To clean up: docker system prune -a
- To run bash into local docker: docker exec -it [container] bash => heroku
  doesn't let you use bash as root, need to explore more.

## Steps to push docker image to Heroku

1. Run `heroku login` to login to heroku-cli. [heroku-cli install link
   https://devcenter.heroku.com/articles/heroku-cli]
2. Run `heroku container:login` to login to heroku container registry
3. Run `heroku container:push web -a nepaltoday-api` to build & push docker
   image to heroku
4. Run `heroku container:release web -a nepaltoday-api` to release the app
