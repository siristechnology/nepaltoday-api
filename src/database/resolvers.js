exports.resolver = {
  Query: {
    getArticles: async (parent, args, { Article }) => {
      args.criteria = args.criteria || {};
      args.criteria.lastQueryDate =
        args.criteria.lastQueryDate || new Date("2001-01-01");
      args.criteria.lastArticleId =
        args.criteria.lastArticleId || "000000000000000000000000";

      const articles = await Article.find({
        link: { $ne: null },
        modifiedDate: { $gt: new Date(args.criteria.lastQueryDate) },
        _id: { $gt: args.criteria.lastArticleId }
      })
        .populate("source")
        .sort({ _id: -1 })
        .limit(100);
      console.log("Article here", articles);
      return articles;
    },
    getTweets: async (parent, args, { Tweet }) => {
      console.log("arguments here========", args, "Tweets=======", Tweet);
      args.criteria = args.criteria || {};
      args.criteria.lastQueryDate =
        args.criteria.lastQueryDate || new Date("2001-01-01");
      args.criteria.lastTweetId =
        args.criteria.lastTweetId || "000000000000000000000000";

      const tweets = await Tweet.find()
        .populate("twitterHandle")
        .sort({ _id: -1 })
        .limit(100);
      return tweets;
    }
  }
};
