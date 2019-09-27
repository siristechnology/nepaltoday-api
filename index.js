const morgan = require("morgan");
const express = require("express");
const glue = require("schemaglue");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morganBody = require("morgan-body");
const errorhandler = require("errorhandler");
const { ApolloServer } = require("apollo-server-express");
const { mongooseSchema } = require("nepaltoday-db-service");

const { DATABASE_URL } = require("./src/config/env");
console.log("data base url here", DATABASE_URL);

const isDevelopment = process.env.NODE_ENV === "development";

// Configure Mongoose
mongoose.promise = global.Promise;
mongoose.connect(DATABASE_URL, { useNewUrlParser: true });
mongoose.set("debug", true);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (isDevelopment) {
  morganBody(app, {
    noColors: true,
    logRequestBody: true,
    logResponseBody: true
  });
} else {
  app.use(morgan("combined"));
}

if (isDevelopment) {
  app.use(errorhandler());
}

// Error handlers & middlewares
if (isDevelopment) {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);

    res.send({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

app.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.send({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

const { schema, resolver } = glue("./src", {
  js: "**/resolver*.js",
  ignore: "**/*.test.js"
});

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolver,
  context: ({ req, res }) => ({
    ...{ userContext: req.payload },
    ...mongooseSchema
  }),
  playground: {
    settings: {
      "editor.theme": "light"
    },
    version: "1.7.25"
  }
});

server.applyMiddleware({ app });

app.listen(process.env.PORT, () =>
  console.log(`Server running on http://localhost:${process.env.PORT}`)
);
