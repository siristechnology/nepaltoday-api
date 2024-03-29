# NepalToday-Api

A graphql based api endpoint for NepalToday mobile app and Admin Dashboard in React
It is set to auto-deploy to https://dashboard.heroku.com/apps/nepaltoday-api-qa

![Node CI](https://github.com/siristechnology/nepaltoday-api/workflows/Node%20CI/badge.svg?branch=master)
[![DeepScan grade](https://deepscan.io/api/teams/5348/projects/7147/branches/66890/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5348&pid=7147&bid=66890)
[![codecov](https://codecov.io/gh/siristechnology/nepaltoday-api/branch/master/graph/badge.svg)](https://codecov.io/gh/siristechnology/nepaltoday-api)

### GraphQL

![graphql](/assets/images/graphql-interface.jpg)

## Steps to run

-   `yarn` --to install npm modules
-   Create .env file as per .env.sample file. Get actual values from Heroku env if you need to.
    \*. Don't checkin .env file
-   `yarn dev` --to start api-server and worker in development mode
-   `yarn start` --to start api-server and worker in prod mode
-   `jest --runInBand -t 'some test description'` -- it will run tests with `some test description` in `it` description
-   `yarn lint` --to show linting errors. Add [`--fix`] to auto fix errors.

## Load testing

-   Using artillery : `artillery run ./artillery-load-test.yml`

## Key points

1. Uses mongoose as ORM for mongodb
2. Mongoose schema at /src/db-service/mongooseSchema.js

## Most basic MongoDB commands (terminal)

-   `show dbs` --to show all dbs
-   `use nepaltodaydb` --to switch to nepaltodaydb
-   `show collections` --to show all collections/tables
-   `db.articles.find()` --to show all articles in the collection
-   `db.articles.find({title: 'new title'})` --to show article/articles with title = 'new title'
-   `db.articles.find({}, {title: 1})` --to show title field of all articles (no criteria)
-   `db.articles.remove({})` --to remove all articles documents
-   `db.articles.remove({title: 'new title'})` --to remove all articles with title = 'new title'
-   `db.articles.update({_id:{$exists:true}}, { $set: {createdDate: '2019-01-01'}}, {multi: true})` --to update multiple articles with createdDate = '2019-01-01'
-   `db.articles.find().sort({_id: -1}).limit(10)` -- to display latest articles (i.e order by descending and take 10 records)

## Some helpful commands

1. Run `kill-port 8080` to kill process in port 8080. kill-port is a npm module
