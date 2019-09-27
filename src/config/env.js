require("dotenv").config();

const getDbUrl = () => {
  try {
    const env = process.env.NODE_ENV;
    switch (env) {
      case "development":
        return process.env.DATABASE_URL_DEV;
      case "qa":
        return process.env.DATABASE_URL_QA;
      case "production":
        return process.env.DATABASE_URL_PROD;
      case "test":
        return process.env.DATABASE_URL_TEST;
      default:
        return process.env.DATABASE_URL_DEV;
    }
  } catch (error) {
    console.log(
      "Error on getting database url from .env fle ==========",
      error
    );
  }
};

const DATABASE_URL = getDbUrl();

module.exports = {
  DATABASE_URL
};
