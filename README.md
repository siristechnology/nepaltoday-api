# NepalToday-Api

A graphql based api endpoint for NepalToday mobile app

It is set to auto-deploy to https://dashboard.heroku.com/apps/nepaltoday-api-qa

![alt text](/assets/images/graphql-interface.png)

## Steps to run
1. `yarn` --to install npm modules
2. Create .env file as per .env.sample file. Get actual values from Heroku env if you need to.
3. jest --runInBand -t 'some test description' -- it will run tests with `some test description` in `it` description
4. don't checkin .env file

## Key points
1. Uses mongoose as ORM for mongodb
2. Mongoose schema at /src/db-service/mongooseSchema.js

## Most basic MongoDB commands (terminal)
- `show dbs` --to show all dbs
- `use nepaltodaydb` --to switch to nepaltodaydb
- `show collections` --to show all collections/tables
- `db.articles.find()` --to show all articles in the collection
- `db.articles.find({title: 'new title'})` --to show article/articles with title = 'new title'
- `db.articles.find({}, {title: 1})` --to show title field of all articles (no criteria)
- `db.articles.remove({})` --to remove all articles documents
- `db.articles.remove({title: 'new title'})` --to remove all articles with title = 'new title'
- `db.articles.update({_id:{$exists:true}}, { $set: {createdDate: '2019-01-01'}}, {multi: true})` --to update multiple articles with createdDate = '2019-01-01'

## Some helpful commands
1. Run `kill-port 4000` to kill process in port 4000. kill-port is a npm module
